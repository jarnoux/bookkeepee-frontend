module.exports = {
    top: function () {
        'use strict';
        return function (req, res, done) {
            var timeout = Math.floor(5000 * Math.random());
            setTimeout(function () {
                done(null, {
                    text: 'Hello Top World!',
                    timeout: timeout
                });
            }, timeout);
        };
    },
    middle: function () {
        'use strict';
        return function (req, res, done) {
            var timeout = Math.floor(5000 * Math.random());
            setTimeout(function () {
                done(null, {
                    text: 'Hello Middle World!',
                    timeout: timeout
                });
            }, timeout);
        };
    },
    bottom: function () {
        'use strict';
        return function (req, res, done) {
            var timeout = Math.floor(5000 * Math.random());
            setTimeout(function () {
                done(null, {
                    text: 'Hello Bottom World!',
                    timeout: timeout
                });
            }, timeout);
        };
    }
};
