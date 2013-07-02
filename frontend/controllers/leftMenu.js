module.exports = function () {
    'use strict';
    return function (req, res, done) {
        var route = req.route.path.substr(1) || 'index',
            data  = {
                user : req.session.user,
                route: {}
            };
        // choose the menu to highlight
        data.route[route] = true;
        return done(null, data);
    };
};
