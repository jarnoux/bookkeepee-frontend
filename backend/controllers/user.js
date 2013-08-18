/*jslint nomen:true*/
var _ = require('underscore'),
    registry = require('rig').registry,
    HTTPStatus = require('../lib/http-status'),
    User,

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
            User = User || registry.get('models.user');
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
                res.json(newUser);
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
            User = User || registry.get('models.user');
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
                    res.json(user);
                }
            );
        };
    },

    edit: function (options) {
        'use strict';

        return function edit(req, res, next) {
            User = User || registry.get('models.user');
            var id = req.params.id,
                update = req.body;

            User.findById(id, function (err, user) {
                if (err) {
                    return next(err);
                }
                _.extend(user, update);
                user.save(function (err) {
                    if (err) {
                        return next(err);
                    }
                    res.json(user);
                });
            });
        };
    },

    byId: function (options) {
        'use strict';

        return function byId(req, res, next) {
            var User = registry.get('models.user'),
                id = req.params.id;

            User.findById(id, function (err, user) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.send(HTTPStatus.NOT_FOUND);
                }
                res.json(user);
            });
        };
    }
};
