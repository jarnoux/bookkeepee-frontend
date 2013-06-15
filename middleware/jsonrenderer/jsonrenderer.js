module.exports = function (options) {
    'use strict';
    options = options || [];

    return function (req, res, next) {
        res.renderJSON = function (json, callback) {
            try {
                callback(null, JSON.stringify.bind(null, json).apply(null, options));
            } catch (e) {
                callback(e);
            }
        };
        next();
    };
};
