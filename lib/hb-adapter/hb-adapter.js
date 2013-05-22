var handlebars = require('handlebars'),
    fs         = require('fs'),
    cache;

module.exports = function (options) {
    'use strict';
    return function (path, templateData, callback) {
        if (!cache) {
            cache = {};
        }
        if (!cache[path]) {
            fs.readFile(path, function (err, data) {
                if (err) {
                    callback(err);
                }
                cache[path] = handlebars.compile(data.toString());
                callback(null, cache[path](templateData));
            });
        } else {
            callback(null, cache[path](templateData));
        }
    };
};
