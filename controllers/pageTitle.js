module.exports = function (options) {
    'use strict';
    return function (req, res, done) {
        return done(null, {
            title: options[req.path]
        });
    };
};
