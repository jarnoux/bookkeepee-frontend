var fs        = require('fs'),
    Config = function (options) {
        this.configFile = options;
    };

Config.prototype._parseConfigFile = function (callback) {
    if (!callback) {
        this._parsedConfig = JSON.parse(fs.readFileSync(this.configFile));
        return this._parsedConfig;
    }
    fs.readFile(this.configFile, function (err, fileData) {
        try {
            this._parsedConfig = JSON.parse(fileData);
        } catch (e) {
            err = err || e;
        }
        return callback && callback(err, this._parsedConfig);
    });
};

Config.prototype.get = function (path, callback) {
    var resolve = function (config, path) {
            if (!path) return config;
            path = path.split('.');
            for (var nextPathSegment = 0; nextPathSegment < path.length; nextPathSegment++) {
                config = config[path[nextPathSegment]];
            }
            return config;
        };

    if (!this._parsedConfig) {
        console.log('reading file');
        if (!callback) {
            return resolve(this._parseConfigFile(), path);
        }
        this._parseConfigFile(function (err, config) {
            callback(err, resolve(config, path));
        });
    } else {
        if (!callback) {
            return resolve(this._parsedConfig, path);
        }
        callback(null, resolve(this._parsedConfig, path));
    }
};

Config.prototype.ure = function(configurable, path, callback) {
    if (!callback) {
        return configurable.call(null, this.get(path));
    }
    this.get(path, function (err, config) {
        callback(err, configurable.call(null, config));
    });
};

Config.prototype.ureSync = function(configurable, path) {
    return this.ure(configurable, path);
};
module.exports = Config;