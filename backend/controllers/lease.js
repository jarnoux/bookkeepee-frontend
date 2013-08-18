/*jslint nomen:true, node: true, forin: true */

"use strict";

var _ = require('underscore'),
    registry = require('rig').registry,
    HTTPStatus = require('../lib/http-status');

module.exports = {

    byUnit: function (options) {

        return function byUnit(req, res, next) {
            var Lease = registry.get('models.lease'),
                unit = req.params.id;

            Lease.byUnit(unit, function (err, leases) {
                if (err) {
                    return next(err);
                }
                res.json(leases);
            });
        };
    },

    create: function (options) {

        return function create(req, res, next) {
            var Lease = registry.get('models.lease'),
                postData = _.clone(req.body);

            postData.unit = req.params.id;

            Lease.create(postData, function (err, lease) {
                if (err) {
                    return next(err);
                }
                res.json(lease);
            });
        };
    },

    remove: function (options) {

        return function remove(req, res, next) {
            var Lease = registry.get('models.lease'),
                id = req.params.id;

            Lease.findByIdAndRemove(id, function (err, lease) {
                if (err) {
                    return next(err);
                }
                if (!lease) {
                    return res.send(HTTPStatus.NOT_FOUND);
                }
                res.send(HTTPStatus.NO_CONTENT);
            });
        };
    },

    edit: function (options) {

        return function edit(req, res, next) {
            var Lease = registry.get('models.lease'),
                id = req.params.id,
                update = { $set: req.body };

            Lease.findByIdAndUpdate(id, update, function (err, lease) {
                if (err) {
                    return next(err);
                }
                if (!lease) {
                    return res.send(HTTPStatus.NOT_FOUND);
                }
                res.json(lease);
            });
        };
    },

    find: function (options) {

        return function find(req, res, next) {
            var Lease = registry.get('models.lease'),
                query = req.body;

            Lease.find(query, function (err, leases) {
                if (err) {
                    return next(err);
                }
                res.json(leases);
            });
        };
    },

    byId: function (options) {

        return function byId(req, res, next) {
            var Lease = registry.get('models.lease'),
                id = req.params.id;

            Lease.byId(id, function (err, lease) {
                if (err) {
                    return next(err);
                }
                if (!lease) {
                    return res.send(HTTPStatus.NOT_FOUND);
                }
                res.json(lease);
            });
        };
    },

    byTenant: function (options) {

        return function byTenant(req, res, next) {
            var Lease = registry.get('models.lease'),
                tenant = req.params.id;

            Lease.find({tenants: { $in: [ tenant] }}, function (err, leases) {
                if (err) {
                    return next(err);
                }
                res.json(leases);
            });
        };
    }
};
