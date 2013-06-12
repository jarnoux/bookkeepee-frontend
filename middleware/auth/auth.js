var authModule = function () {
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
            return function enticate(req, res, next) {
                User = User || req.registry.get('models.user');
                if (!req.session.user) {
                    User.getAuthenticated(
                        req.body.username,
                        req.body.password,
                        function (err, user, failReason) {
                            if (err) {
                                return next(err);
                            }
                            if (!user) {
                                return next(new Error('Invalid Credentials'));
                            }
                            // TODO: log the fail reason
                            req.session.user = user;
                            return res.redirect('/');
                        }
                    );
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
