var http        = require('http'),
    querystring = require('querystring'),
    authModule  = function auth() {
        'use strict';
        var User,
            retrieveUser = function (path, req, res, next) {
                var backend = req.registry.get('models.backend'),
                    postBody;
                if (!req.session.user) {
                    postBody = querystring.stringify(req.body);
                    backend.request({
                        path: path,
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
        return {
            register: function configureRegister() {
                return retrieveUser.bind(null, '/register');
            },
            login: function configureLogin() {
                return retrieveUser.bind(null, '/login');
            },
            logout: function configureLogout() {
                return function logout(req, res, next) {
                    delete req.session.user;
                    return res.redirect('/');
                };
            }
        };
    };

module.exports = authModule;
