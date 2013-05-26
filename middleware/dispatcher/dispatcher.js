/*jslint forin: true */

var async = require('async');

module.exports = function (registry, options) {
    'use strict';
    var config = registry.getConfig('middleware.dispatcher'),
        dispatchPlan = function (plan, req, res, planDone) {
            var controller,
                remainingPlans,
                retentionRoom = {};
            if (typeof plan === 'string') {
                controller = registry.get('controllers.' + plan);
                if (!controller) {
                    return planDone(new Error('No plan nor any registered controller for route: ' + req.route.path));
                }
                return controller(req, function (err, html) {
                    if (err) {
                        return planDone(err);
                    }
                    return res.render(plan + '.html', html, planDone);
                });
            }
            if (plan instanceof Array) {
                remainingPlans = plan.concat();
                return async.each(plan, function (subplan, subplanDone) {
                    dispatchPlan(subplan, req, res, function schedule(err, html) {
                        if (err) {
                            return subplanDone(err);
                        }
                        retentionRoom[subplan] = html;
                        while (retentionRoom.hasOwnProperty(remainingPlans[0])) {
                            res.write(retentionRoom[remainingPlans.shift()] || '');
                        }
                        return subplanDone();
                    });
                }, planDone);
            }
        };
    return function dispatcher(req, res, next) {
        req.plan = config.routes[req.route.path] &&
            (config.routes[req.route.path][req.route.method] || config.routes[req.route.path].all);
        if (!req.plan) {
            return next(new Error('No plan for route ' + req.route.path));
        }
        return dispatchPlan(req.plan, req, res, function done(err, result) {
            if (err) {
                return next(err);
            }
            return res.end(result);
        });
    };
};
