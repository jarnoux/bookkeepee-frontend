/*jslint nomen: true, forin: true, stupid: true, newcap: true */
/**
 *  A registry that configures resources and uniformizes retrieval.
 */

var fs = require('fs'),
    path = require('path'),
    Registry = function (config) {
        'use strict';
        this.__config__ = config;
        this.__resourceStore__ = {};
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
                registry._registerASingleResource(path.basename(name) + '.' + file, path.join(name, file));
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
    return this.__resourceStore__[name];
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
    // NOW if the resource is configurable, try to do it
    if (typeof resource === 'function') {
        try {
            configuredResource = this.__config__.ure(resource, name);
        } catch (e) {
            if (e instanceof this.__config__.ConfigurationError) {
                console.warn(e.message);
                console.warn(name + ' registration skipped');
                return;
            }
            // else it's probably a constructor trying to set an undefined "this"
        }
    }
    // here we have either resource is an object and configuredResource is undefined
    // or resource resource is a function and configuredResource is anything or undefined
    // so then if configuredResource is undefined, try to call resource as a constructor instead
    if (typeof resource === 'function' && !configuredResource) {
        this.__resourceStore__[name] =  new resource(this.__config__.get(name));
    } else {
        // else either configuredResource is something and we want it, or we want resource
        resource = configuredResource || resource;
        // if resource is an object, register each of its function member recursively
        if (typeof resource === 'object') {
            for (nextKey in resource) {
                nestedResource = resource[nextKey];
                // if the member is a function, bind it's context to its parent object
                if (typeof nestedResource === 'function') {
                    nestedResource = nestedResource.bind(resource);
                }

                this._registerASingleResource(name + '.' + nextKey, nestedResource);
            }
        } else {
            this.__resourceStore__[name] = resource;
        }
    }
};

Registry.prototype.getConfig = function (name) {
    'use strict';
    return this.__config__.get(name);
};
Registry.prototype.middleware = function registry() {
    'use strict';
    var self = this;
    return function (req, res, next) {
        req.registry = self;
        next();
    };
};

module.exports = Registry;
