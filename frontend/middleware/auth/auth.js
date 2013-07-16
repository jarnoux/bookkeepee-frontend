var retrieveUser = function (path, req, res, next) {
        'use strict';
        var backend = req.registry.get('models.backend');

        if (!req.session.user) {
            backend.request({
                path: path,
                method: 'post'
            }, req.body, function (err, result) {
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
        return retrieveUser.bind(null, '/register');
    },
    login: function () {
        'use strict';
        return retrieveUser.bind(null, '/login');
    },
    logout: function () {
        'use strict';
        return function logout(req, res, next) {
            delete req.session.user;
            return res.redirect('/');
        };
    }
};
