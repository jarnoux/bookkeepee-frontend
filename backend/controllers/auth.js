var User,
    InvalidCredentialsError = function (message) {
        'use strict';
        this.name    = 'InvalidCredentialsError';
        this.message = message;
    };

InvalidCredentialsError.prototype = new Error();
InvalidCredentialsError.prototype.constructor = InvalidCredentialsError;

module.exports = {
    register: function (options) {
        'use strict';
        return function register(req, res, next) {
            User = User || req.registry.get('models.user');
            var newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            });
            newUser.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.end(JSON.stringify(newUser));
                return next();
            });
        };
    },
    logout: function (options) {
        'use strict';
        return function logout(req, res, next) {
            // TODO: maybe here do usage stats, last conn time, durations, etc.
            res.end();
            next();
        };
    },
    login: function (options) {
        'use strict';
        return function login(req, res, next) {
            User = User || req.registry.get('models.user');
            User.getAuthenticated(
                req.body.username,
                req.body.password,
                function (err, user, failReason) {
                    if (err) {
                        return next(err);
                    }
                    if (!user) {
                        return next(new InvalidCredentialsError('Invalid Credentials, please try again.'));
                    }
                    // TODO: log the fail reason
                    res.end(JSON.stringify(user));
                }
            );
        };
    }
};
