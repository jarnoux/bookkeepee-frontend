var handlebars = require('handlebars'),
    fs         = require('fs'),
    cache = {};

module.exports = function(path, templateData, callback) {
    if (!cache._templates) {
        cache._templates = {};
    }
    if (!cache._templates[path]) {
        fs.readFile(path, function (err, data) {
            if (err) {
                callback(err);
            }
            cache._templates[path] = handlebars.compile(data.toString());
            callback(null, cache._templates[path](templateData));
        });
    } else {
        callback(null, cache._templates[path](templateData));
    }
};
