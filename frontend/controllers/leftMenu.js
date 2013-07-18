module.exports = function () {
    'use strict';
    return function (req, res, done) {
        var defaultRoute = req.session.user ? 'home' : 'index',
            route = req.route.path.substr(1) || defaultRoute,
            data  = {
                user : req.session.user,
                route: {}
            };
        // choose the menu to highlight
        data.route[route] = true;
        return done(null, data);
    };
};
