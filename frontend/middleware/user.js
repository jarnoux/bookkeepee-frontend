var retrieveUser = function (action, req, res, next) {
        'use strict';
        var userModel = req.registry.get('models.user');

        if (!req.session.user) {
            userModel[action].call(userModel, req.body, function (err, result) {
                if (err) {
                    return next(err);
                }
                req.session.user = result;
                return res.redirect('/home');
            }).on('error', next);
        } else {
            next();
        }
    };
module.exports = {
    register: function () {
        'use strict';
        return retrieveUser.bind(null, 'register');
    },
    login: function () {
        'use strict';
        return retrieveUser.bind(null, 'login');
    },
    logout: function () {
        'use strict';
        return function logout(req, res, next) {
            delete req.session.user;
            return res.redirect('/');
        };
    }
};
