module.exports = function () {
    'use strict';
    return function (req, done) {
        return done(null, {
            username: req.session.user && req.session.user.username,
            email   : req.session.user && req.session.user.email
        });
    };
};
