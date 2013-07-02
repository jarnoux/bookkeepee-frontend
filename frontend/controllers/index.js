module.exports = function () {
    'use strict';
    return function (req, res, done) {
        return done(null, req.session.user && {
            firstName: req.session.user.firstName,
            lastName : req.session.user.lastName,
            email    : req.session.user.email
        });
    };
};
