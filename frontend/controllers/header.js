module.exports = function () {
    'use strict';
    return function (req, res, done) {
        setTimeout(done, 0);
    };
};
