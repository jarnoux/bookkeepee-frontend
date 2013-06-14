/*jslint nomen: true, forin: true */

var Config   = require('../config'),
    Router   = function (options) {
        'use strict';
        this._registry = options.registry;
        this._routesConfigs = new Config(options.routes);
    };

Router.prototype.map = function (app) {
    'use strict';
    var routes = this._routesConfigs.get(),
        router = this,
        nextRoute,
        verb,
        use    = function (middleware) {
            app.use(router._registry.get(middleware));
        };
    try {
        for (nextRoute in routes) {
            if (nextRoute === '') {
                routes[nextRoute].forEach(use);
            } else {
                for (verb in routes[nextRoute]) {
                    app[verb](nextRoute, routes[nextRoute][verb].map(this._registry.get.bind(this._registry)));
                }
            }
        }
    } catch (e) {
        throw new Error('Could not map route ' + (verb && verb.toUpperCase()) + ' "' + nextRoute + '": ' + e.message);
    }
};

module.exports = Router;
