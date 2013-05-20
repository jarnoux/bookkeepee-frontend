/**
 *  A configuration utility that allows easy synchronous and async access
 *  to configurations stored in a json file and can call/configure a 
 *  function with those configurations; 
 */

var fs     = require('fs'),
    Config = function (filePath) {
        this._parsedConfig = JSON.parse(fs.readFileSync(filePath));
    };

Config.prototype.get = function (path) {
    var config = this._parsedConfig;
    if (!path) return config;
    path = path.split('.');
    for (var nextPathSegment = 0; nextPathSegment < path.length; nextPathSegment++) {
        config = config && config[path[nextPathSegment]];
    }
    return config;
};

Config.prototype.ure = function(configurable, path) {
    return configurable.call(null, this.get(path));
};

module.exports = Config;