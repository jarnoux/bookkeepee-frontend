/*jslint forin: true */

var async = require('async');

module.exports = function (registry, options) {
    'use strict';
    var config = registry.getConfig('middleware.dispatcher'),
        dispatchPlan = function (plan, req, res, planDone) {
            var controller,
                key,
                toFlushInOrder,
                retentionPool = {},
                expandedPlan;

            if (typeof plan === 'string') {
                expandedPlan = config.plans[plan];

                if (expandedPlan instanceof Array) {
                    return dispatchPlan(expandedPlan, req, res, planDone);
                }

                controller = registry.get('controllers.' + plan);
                if (!controller) {
                    return planDone(new Error('No plan nor any registered controller for route: ' + req.route.path));
                }

                if (expandedPlan instanceof Object) {
                    for (key in expandedPlan) {
                        retentionPool[key] = dispatchPlan.bind(null, expandedPlan[key], req, res);
                    }
                    retentionPool[plan] = controller.bind(null, req);
                    return async.parallel(retentionPool, function (err, preRenderedBits) {
                        var key;
                        for (key in preRenderedBits[plan]) {
                            preRenderedBits[key] = preRenderedBits[plan][key];
                        }
                        return res.render(plan + '.html', preRenderedBits, planDone);
                    });
                }

                return controller(req, function renderResult(err, result) {
                    if (err) {
                        return planDone(err);
                    }
                    return res.render(plan + '.html', result, planDone);
                });
            }

            if (plan instanceof Array) {
                toFlushInOrder = plan.concat();

                return async.each(plan, function dispatchAndSchedule(subplan, subplanDone) {
                    dispatchPlan(subplan, req, res, function scheduleRendered(err, html) {
                        if (err) {
                            return subplanDone(err);
                        }
                        retentionPool[subplan] = html;
                        while (toFlushInOrder[0] in retentionPool) {
                            res.write(retentionPool[toFlushInOrder.shift()] || '');
                        }
                        return subplanDone();
                    });
                }, planDone);
            }
        };
    return function dispatcher(req, res, next) {
        // read the plan from the config given the matched route and method
        req.plan = config.routes[req.route.path] &&
            (config.routes[req.route.path][req.route.method] || config.routes[req.route.path].all);
        if (!req.plan) {
            return next(new Error('No plan for route ' + req.route.path));
        }
        // initiate the recursive dispatch of the plan
        return dispatchPlan(req.plan, req, res, function done(err, result) {
            if (!err) {
                return res.end(result);
            }
            next(err);
        });
    };
};
