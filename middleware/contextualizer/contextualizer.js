/*jslint forin: true */

module.exports = function (options) {
    'use strict';
    return function contextualizer(req, res, next) {
        var key;
        req.context = {};
        // start by taking all the context configs
        for (key in options) {
            req.context[key] = options[key];
        }
        next();
    };
};
