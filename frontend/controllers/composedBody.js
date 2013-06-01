module.exports = function () {
    'use strict';
    return function (req, done) {
        return done(null, {
            text: 'Hello Composed World!'
        });
    };
};
