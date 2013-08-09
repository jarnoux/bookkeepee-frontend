/*jslint node: true */
'use strict';

var mongoose             = require('mongoose'),
    Schema               = mongoose.Schema,
    bcrypt               = require('bcrypt'),
    SALT_WORK_FACTOR     = 10,
    MAX_LOGIN_ATTEMPTS   = 5,
    LOCK_TIME            = 2 * 60 * 60 * 1000,

    ContactSchema = new Schema({
        name:  {type: String, required: true },
        phone: {type: String, required: true },
        email: {type: String}
    }),

    UserSchema = new Schema({
        firstName:      { type: String, required: true },
        lastName:       { type: String, required: true },
        dateOfBirth:    { type: Date },
        email:          { type: String, unique: true, required: true},
        phone:          { type: String, index: true },
        password:       { type: String, required: true },
        loginAttempts:  { type: Number, required: true, 'default': 0 },
        lockUntil:      { type: Number },
        references:     [ ContactSchema ]
    }),

    reasons = UserSchema.statics.failedLogin = {
        NOT_FOUND: 0,
        PASSWORD_INCORRECT: 1,
        MAX_ATTEMPTS: 2
    };

UserSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, callback);
};
UserSchema.methods.incLoginAttempts = function (callback) {
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

UserSchema.statics.getAuthenticated = function (email, password, callback) {
    this.findOne({ email: email }, function (err, user) {
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

UserSchema.virtual('isLocked').get(function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

UserSchema.pre('save', function (next) {
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

UserSchema.index({
    lastName : 1,
    firstName: 1
}, { unique: true });

module.exports = function (options) {
    return mongoose.model('User', UserSchema);
};