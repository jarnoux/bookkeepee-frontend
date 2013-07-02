module.exports = function () {
    'use strict';
    return function (req, res, done) {
        return done(null, {
            user: req.session.user
        });
    };
};
