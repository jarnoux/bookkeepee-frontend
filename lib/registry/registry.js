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
                    registry._registerASingleResource(path.basename(name) + '.' + file, path.join(name, file));
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
    if (this[name]) {
        return this[name];
    }
    throw new Error('Could not find resource "' + name + '" in the registry.');
};

Registry.prototype._registerASingleResource = function (name, resource) {
    'use strict';
    var configuredResource,
        nextKey,
        nestedResource;

    // we try to load named modules
    if (typeof resource === 'string') {
        // if it's a file, remove the extention
        if (fs.statSync(resource).isFile()) {
            name = name.substring(0, name.lastIndexOf('.'));
        }
        resource = require(resource);
    }
    // now if the resource is configurable, try to do it
    if (typeof resource === 'function') {
        try {
            configuredResource = this.__config__.ure(resource, name);
        } catch (e) {
            console.warn(e.message);
            console.warn(name + ' not registered');
            return;
        }
        // if the configuration returned nothing, try to call it as a constructor instead
        resource = configuredResource || new resource(this.__config__.get(name));
    }
    // now if it's an object, register each of its function member recursively
    if (typeof resource === 'object') {
        for (nextKey in resource) {
            nestedResource = resource[nextKey];
            // if the member is a function, bind it's context to its parent object
            if (typeof nestedResource === 'function') {
                nestedResource = nestedResource.bind(resource);
            }
            this._registerASingleResource(name + '.' + nextKey, nestedResource);
        }
    }
    this[name] = resource;
};

Registry.prototype.getConfig = function (name) {
    'use strict';
    return this.__config__.get(name);
};

module.exports = Registry;
