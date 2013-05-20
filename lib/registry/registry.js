/**
 *  A registry that configures resources and uniformizes retrieval.
 */

var fs = require('fs'),
    path = require('path'),
    Registry = function (config){
        this.__config__ = config;
    };

Registry.prototype.register = function (name, resource) {
    var registry = this;
    // if only one argument, then we try to load a bundle of node modules
    // or a series of resources.
    if (!resource) {
        if (typeof name === 'object') {
            for (var nextName in name) {
                this.register(nextName, name[nextName]);
            }
        } else return fs.readdirSync(name).forEach(function (file) {
            if (file === 'registry') return;
            registry._registerASingleResource(file, path.join(name, file));
        });
    } else return this._registerASingleResource(name, resource);
};

Registry.prototype.get = function(name) {
    return this[name];
};

Registry.prototype._registerASingleResource = function (name, resource) {
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
