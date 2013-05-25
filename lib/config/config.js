/*jslint nomen: true, stupid: true */
/**
 *  A configuration utility that allows easy synchronous and async access
 *  to configurations stored in a json file and can call/configure a 
 *  function with those configurations; 
 */

var fs     = require('fs'),
    Config = function (filePath) {
        'use strict';
        this._parsedConfig = JSON.parse(fs.readFileSync(filePath));
    };

Config.prototype.get = function (path) {
    'use strict';
    var config = this._parsedConfig,
        nextPathSegment;
    if (!path) {
        return config;
    }
    path = path.split('.');
    for (nextPathSegment = 0; nextPathSegment < path.length; nextPathSegment += 1) {
        config = config && config[path[nextPathSegment]];
    }
    return config;
};

Config.prototype.ure = function (configurable, path) {
    'use strict';
    var options = this.get(path);
    // if there is no options available and yet the configurable expects some
    if ((options === undefined && configurable.length) || configurable.length > 1) {
        throw new Error('Function ' + configurable.name + ' has ' +
            (!options ? 'no' : 1) + ' config available yet expects ' + configurable.length);
    }

    return configurable.call(null, options);
};

module.exports = Config;