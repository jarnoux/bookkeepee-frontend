/*jslint nomen:true, node: true*/

"use strict";

var _ = require('underscore'),
    HTTPStatus = require('../lib/http-status');

module.exports = {

    byProperty: function (options) {

        return function byProperty(req, res, next) {
            var Unit = req.registry.get('models.unit'),
                Tenant = req.registry.get('models.tenant'),
                property = req.params.pid;

            Unit.find({property: property}, {id: 1}, function (err, units) {
                if (err) {
                    return next(err);
                }
                Tenant.find({unitId: {$in: units}}, function (err, tenants) {
                    if (err) {
                        return next(err);
                    }
                    res.json(tenants);
                });
            });
        };
    },

    create: function (options) {

        return function create(req, res, next) {
            var Tenant = req.registry.get('models.tenant'),
                postData = _.clone(req.body);

            postData.property = req.params.pid;

            Tenant.create(postData, function (err, unit) {
                if (err) {
                    console.log(err);
                    return next(err);
                }
                res.json(unit);
            });
        };
    },

    remove: function (options) {

        return function remove(req, res, next) {
            var registry = req.registry,
                Tenant = registry.get('models.tenant'),
                id = req.params.tid;

            Tenant.findByIdAndRemove(id, function (err, tenant) {
                if (err) {
                    return next(err);
                }
                res.send(HTTPStatus.NO_CONTENT);
            });
        };
    },

    edit: function (options) {

        return function edit(req, res, next) {
            var Tenant = req.registry.get('models.tenant'),
                id = req.params.tid,
                update = { $set: req.body };

            Tenant.findByIdAndUpdate(id, update, function (err, unit) {
                if (err) {
                    return next(err);
                }
                res.json(unit);
            });
        };
    },

    find: function (options) {

        return function find(req, res, next) {
            var Tenant = req.registry.get('models.tenant'),
                query = req.body;

            Tenant.find(query, function (err, units) {
                if (err) {
                    return next(err);
                }
                res.json(units);
            });
        };
    },

    byId: function (options) {

        return function byId(req, res, next) {
            var Tenant = req.registry.get('models.tenant'),
                id = req.params.tid;

            Tenant.findById(id, function (err, unit) {
                if (err) {
                    return next(err);
                }
                if (!unit) {
                    return res.send(HTTPStatus.NOT_FOUND);
                }
                res.json(unit);
            });
        };
    }
};
