/*jslint node: true, nomen:true*/

"use strict";

var _ = require('underscore'),
    HTTPStatus = require('../lib/http-status');

module.exports = {

    byProperty: function (options) {

        return function byProperty(req, res, next) {
            var Unit = req.registry.get('models.unit'),
                property = req.params.id;

            Unit.byProperty(property, function (err, units) {
                if (err) {
                    return next(err);
                }
                res.json(units);
            });
        };
    },

    create: function (options) {

        return function create(req, res, next) {
            var Unit = req.registry.get('models.unit'),
                postData = _.clone(req.body);

            postData.property = req.params.id;

            Unit.create(postData, function (err, unit) {
                if (err) {
                    return next(err);
                }
                res.json(unit);
            });
        };
    },

    remove: function (options) {

        return function remove(req, res, next) {
            var registry = req.registry,
                Unit = registry.get('models.unit'),

                unitId = req.params.id;

            Unit.findByIdAndRemove(unitId, function (err, unit) {
                if (err) {
                    return next(err);
                }
                res.send(HTTPStatus.NO_CONTENT);
            });
        };
    },

    edit: function (options) {

        return function edit(req, res, next) {
            var Unit = req.registry.get('models.unit'),
                id = req.params.id,
                update = { $set: req.body };

            Unit.findByIdAndUpdate(id, update, function (err, unit) {
                if (err) {
                    return next(err);
                }
                res.json(unit);
            });
        };
    },

    find: function (options) {

        return function find(req, res, next) {
            var Unit = req.registry.get('models.unit'),
                query = req.body;

            Unit.find(query, function (err, units) {
                if (err) {
                    return next(err);
                }
                res.json(units);
            });
        };
    },

    byId: function (options) {

        return function byId(req, res, next) {
            var Unit = req.registry.get('models.unit'),
                id = req.params.id;

            Unit.byId(id, function (err, unit) {
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
