module.exports = function () {
    'use strict';
    return function (req, res, done) {
        return done(null, {
            text: 'Hello Composed World!'
        });
    };
};
