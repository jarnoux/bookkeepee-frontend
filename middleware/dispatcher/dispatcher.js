var async = require('async');

module.exports = function (registry, options) {
    'use strict';
    var config = registry.getConfig('middleware.dispatcher'),
        dispatch = function (path, plan, req, res, callback) {
            var controller;
            if (typeof plan === 'string') {
                controller = config.plans[plan];
                try {
                    controller = controller || registry.get('controllers.' + plan);
                } catch (e) {
                    callback(new Error('No plan nor registered controller for route: ' + req.route.path));
                }
                res.render(plan + '.html', controller(req), callback);
            }
        };
    return function dispatcher(req, res, next) {
        if (!registry) {
            return next(new Error('Dispatcher needs runtime Registry'));
        }
        res.log.info('Route matched: ' + req.route.path);

        // debugger;
        var plan = config.routes[req.route.path] &&
            (config.routes[req.route.path][req.route.method] || config.routes[req.route.path].all);
        if (!plan) {
            return next(new Error('No plan for route ' + req.route.path));
        }

        dispatch(req.route.path, plan, req, res, function (err, result) {
            res.write(result);
            res.end();
        });

    };
};
