var mongoose             = require('mongoose'),
    Schema               = mongoose.Schema,
    bcrypt               = require('bcrypt'),
    SALT_WORK_FACTOR     = 10,
    MAX_LOGIN_ATTEMPTS   = 5,
    LOCK_TIME            = 2 * 60 * 60 * 1000,
    userSchema           = new Schema({
        username     : { type: String, unique: true, required: true },
        email        : { type: String, unique: true, required: true},
        password     : { type: String, required: true },
        loginAttempts: { type: Number, required: true, 'default': 0 },
        lockUntil    : { type: Number }
    }),
    reasons = userSchema.statics.failedLogin = {
        NOT_FOUND: 0,
        PASSWORD_INCORRECT: 1,
        MAX_ATTEMPTS: 2
    };

userSchema.methods.comparePassword = function (candidatePassword, callback) {
    'use strict';
    bcrypt.compare(candidatePassword, this.password, callback);
};
userSchema.methods.incLoginAttempts = function (callback) {
    'use strict';
    var updates;
    // if we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        updates = {
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        };
    } else {
        // otherwise we're incrementing
        updates = { $inc: { loginAttempts: 1 } };
        // lock the account if we've reached max attempts and it's not locked already
        if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
            updates.$set = { lockUntil: Date.now() + LOCK_TIME };
        }
    }
    return this.update(updates, callback);
};

userSchema.statics.getAuthenticated = function (username, password, callback) {
    'use strict';
    this.findOne({ username: username }, function (err, user) {
        if (err) {
            return callback(err);
        }

        // make sure the user exists
        if (!user) {
            return callback(null, null, reasons.NOT_FOUND);
        }

        // check if the account is currently locked
        if (user.isLocked) {
            // just increment login attempts if account is already locked
            return user.incLoginAttempts(function (err) {
                if (err) {
                    return callback(err);
                }
                return callback(null, null, reasons.MAX_ATTEMPTS);
            });
        }

        // test for a matching password
        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                return callback(err);
            }

            // check if the password was a match
            if (isMatch) {
                // if there's no lock or failed attempts, just return the user
                if (!user.loginAttempts && !user.lockUntil) {
                    return callback(null, user);
                }
                // reset attempts and lock info
                var updates = {
                    $set: { loginAttempts: 0 },
                    $unset: { lockUntil: 1 }
                };

                user.update(updates, function (err) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, user);
                });
            } else {
                // password is incorrect, so increment login attempts before responding
                user.incLoginAttempts(function (err) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, null, reasons.PASSWORD_INCORRECT);
                });
            }

        });
    });
};

userSchema.virtual('isLocked').get(function () {
    'use strict';
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.pre('save', function (next) {
    'use strict';
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) {
        return next();
    }

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) {
            return next(err);
        }

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) {
                return next(err);
            }

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

module.exports = function (options) {
    'use strict';
    mongoose = mongoose.connect(options.dbUrl);
    return mongoose.model('User', userSchema);
};