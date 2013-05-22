/*jslint nomen: true, forin: true, stupid: true, newcap: true */
/**
 *  A registry that configures resources and uniformizes retrieval.
 */

var fs = require('fs'),
    path = require('path'),
    Registry = function (config) {
        'use strict';
        this.__config__ = config;
    };

Registry.prototype.register = function (name, resource) {
    'use strict';
    var registry = this,
        nextName;
    // if only one argument and it's an object, load in batch
    // if it's a string, assume path and load each in the directory
    if (!resource) {
        switch (typeof name) {
        case 'object':
            for (nextName in name) {
                this.register(nextName, name[nextName]);
            }
            break;
        case 'string':
            return fs.readdirSync(name).forEach(function (file) {
                if (file !== 'registry') {
                    registry._registerASingleResource(file, path.join(name, file));
                }
            });
        default:
            throw new Error('expected an object or a string, but got ' + name + ' instead.');
        }
    } else {
        return this._registerASingleResource(name, resource);
    }
};

Registry.prototype.get = function (name) {
    'use strict';
    return this[name];
};

Registry.prototype._registerASingleResource = function (name, resource) {
    'use strict';
    var configuredResource;
    // we try to load named modules
    if (typeof resource === 'string') {
        resource = require(resource);
    }
    // now if the resource is configurable, try to do it
    if (typeof resource === 'function') {
        configuredResource = this.__config__.ure(resource, name);
        // if the configuration returned nothing, try to call it as a constructor instead
        resource = configuredResource || new resource(this.__config__.get(name));
    }
    this[name] = resource;
};

module.exports = Registry;
