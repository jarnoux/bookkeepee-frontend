var Rig = require('rig');

var retrieveUser = function (action, options, req, res, next) {
        'use strict';
        var userModel = Rig.registry.get('models.user');

        if (!req.session.user) {
            userModel[action].call(userModel, {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password
            }, function (err, result) {
                if (err) {
                    return next(err);
                }
                req.session.user = result;
                res.cookie(options.cookie.name, result.email, {
                    maxAge: options.cookie.ttl,
                    signed: true
                });
                return res.redirect('/home');
            }).on('error', next);
        } else {
            next();
        }
    };
module.exports = {
    register: function (options) {
        'use strict';
        return retrieveUser.bind(null, 'register', options);
    },
    login: function (options) {
        'use strict';
        return retrieveUser.bind(null, 'login', options);
    },
    logout: function () {
        'use strict';
        return function logout(req, res, next) {
            delete req.session.user;
            return res.redirect('/');
        };
    }
};
