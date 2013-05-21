var Config   = require('../config'),
    Router   = function (options) {
        this._registry = options.registry;
        this._routesConfigs = new Config(options.routes);
    };

Router.prototype.map = function(app) {
    var routes = this._routesConfigs.get(),
        router = this,
        use    = function (middleware) {
            app.use(router._registry[middleware]);
        };
    for (var nextRoute in routes) {
        if (nextRoute === '') {
            routes[nextRoute].forEach(use);
        } else {
            for (var verb in routes[nextRoute]) {
                app[verb](nextRoute, routes[nextRoute][verb].map(this._registry.get.bind(this._registry)));
            }
        }
    }
};

module.exports = Router;
