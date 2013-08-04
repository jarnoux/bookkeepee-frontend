/*jslint nomen:true*/

"use strict";

var _ = require('underscore'),
    HTTPStatus = require('../lib/http-status'),
    User,

    InvalidCredentialsError = function (message) {
        this.name    = 'InvalidCredentialsError';
        this.message = message;
    };

InvalidCredentialsError.prototype = new Error();
InvalidCredentialsError.prototype.constructor = InvalidCredentialsError;

module.exports = {

    register: function (options) {

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

        return function logout(req, res, next) {
            // TODO: maybe here do usage stats, last conn time, durations, etc.
            res.end();
            next();
        };
    },

    login: function (options) {

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
    },

    edit: function (options) {

        return function edit(req, res, next) {
            User = User || req.registry.get('models.user');
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

        return function byId(req, res, next) {
            var User = req.registry.get('models.user'),
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
