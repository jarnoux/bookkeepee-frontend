var http        = require('http'),
    querystring = require('querystring'),
    authModule  = function auth() {
        'use strict';
        var User;
        return {
            register: function () {
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
                        req.session.user = newUser;
                        return res.redirect('/');
                    });
                };
            },
            login: function () {
                return function login(req, res, next) {
                    var backend = req.registry.get('models.backend'),
                        postBody;
                    if (!req.session.user) {
                        postBody = querystring.stringify(req.body);
                        backend.call({
                            path: '/login',
                            method: 'post'
                        }, postBody, function (err, result) {
                            if (err) {
                                return next(err);
                            }
                            req.session.user = result;
                            return res.redirect('/');
                        }).on('error', next);
                    } else {
                        next();
                    }
                };
            },
            logout: function () {
                return function logout(req, res, next) {
                    delete req.session.user;
                    return res.redirect('/');
                };
            }
        };
    };

module.exports = authModule;
