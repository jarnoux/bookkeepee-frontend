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
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password
            });

            newUser.save(function (err) {
                if (err) {
                    return next(err);
                }
                req.renderJSON(newUser, function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    res.end(result);
                });
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
                req.body.email,
                req.body.password,
                function (err, user, failReason) {
                    if (err) {
                        return next(err);
                    }
                    if (!user) {
                        return next(new InvalidCredentialsError('Invalid Credentials, please try again.'));
                    }
                    // TODO: log the fail reason
                    req.renderJSON(user, function (err, string) {
                        if (err) {
                            next(err);
                        }
                        res.end(string);
                    });
                }
            );
        };
    }
};
