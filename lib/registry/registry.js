/**
 *  A registry that configures resources and uniformizes retrieval.
 */

var fs = require('fs'),
    path = require('path'),
    Registry = function (config){
        this.__config = config;
    };

/**
 * Register and configures a resource under a name.
 *  The name is used to retrieve the potential configuration and he configured resource as
 *      a member on this registry object.
 *
 *  If the resource is an object, the registry just assigns it to itself at the given name.
 *  If the resource is a string, the registry tries to load the corresponding node module
 *      at that absolute path.
 *  If the resource is a function, and a configuration exists for this name in the given config
 *      object, then it is called with that configuration. 
 *      Else it is called without any argument. If the function return is falsy, it will 
 *      be called as a constructor with the same configuration;
 *  If no resource is provided, the name is considered the absolute path to a 
 *  bundle of node modules and they are registered and configured with their module name
 *  as name in this registry.
 */
Registry.prototype.register = function (name, resource) {
    var registry = this;
    // if only one argument, then we try to load a bundle of node modules
    if (!resource) {
        return fs.readdirSync(name).forEach(function (file) {
            if (file === 'registry') return;
            registry._registerASingleResource(file, path.join(name, file));
        });
    }
    return this._registerASingleResource(name, resource);
};


Registry.prototype._registerASingleResource = function (name, resource) {
    var configuredResource;

    // we try to load named modules
    if (typeof resource === 'string') {
        resource = require(resource);
    }
    // now if the resource is configurable, try to do it
    if (typeof resource === 'function') {
        configuredResource = this.__config.ure(resource, name);
        // if the configuration returned nothing, try to call it as a constructor instead
        resource = configuredResource || new resource(this.__config.get(name));
    }

    this[name] = resource;
};

module.exports = Registry;
