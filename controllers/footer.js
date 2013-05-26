module.exports = function () {
    'use strict';
    return function (req, done) {
        setTimeout(done, 0);
    };
};
