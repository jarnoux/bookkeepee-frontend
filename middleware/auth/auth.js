var authModule = function (registry) {
    
    var User = registry.get('models.user');
    return {
        register: function () {
            'use strict';
            return function register(req, res, next) {
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
        enticate: function () {
            'use strict';
            return function enticate(req, res, next) {
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
                        });
                } else {
                    next();
                }
            };
        },
        logout: function () {
            'use strict';
            return function logout(req, res, next) {
                delete req.session.user;
                return res.redirect('/');
            };
        }
    };
};

module.exports = authModule;
