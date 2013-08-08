var retrieveUser = function (action, options, req, res, next) {
        'use strict';
        var userModel = req.registry.get('models.user');

        if (!req.session.user) {
            userModel[action].call(userModel, req.body, function (err, result) {
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
