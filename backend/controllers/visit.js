/*jslint nomen:true, node: true*/

"use strict";

var _ = require('underscore'),
    registry = require('rig').registry,
    HTTPStatus = require('../lib/http-status');

module.exports = {

    byUnit: function (options) {

        return function byUnit(req, res, next) {
            var Visit = registry.get('models.visit'),
                unit = req.params.id;

            Visit.byUnit(unit, function (err, visits) {
                if (err) {
                    return next(err);
                }
                res.json(visits);
            });
        };
    },

    create: function (options) {

        return function create(req, res, next) {
            var Visit = registry.get('models.visit'),
                postData = _.clone(req.body);

            postData.unit = req.params.id;

            Visit.create(postData, function (err, visit) {
                if (err) {
                    return next(err);
                }
                res.json(visit);
            });
        };
    },

    remove: function (options) {

        return function remove(req, res, next) {
            var Visit = registry.get('models.visit'),
                id = req.params.id;

            Visit.findByIdAndRemove(id, function (err, visit) {
                if (err) {
                    return next(err);
                }
                if (!visit) {
                    return res.send(HTTPStatus.NOT_FOUND);
                }
                res.send(HTTPStatus.NO_CONTENT);
            });
        };
    },

    edit: function (options) {

        return function edit(req, res, next) {
            var Visit = registry.get('models.visit'),
                id = req.params.id,
                update = { $set: req.body };

            Visit.findByIdAndUpdate(id, update, function (err, visit) {
                if (err) {
                    return next(err);
                }
                if (!visit) {
                    return res.send(HTTPStatus.NOT_FOUND);
                }
                res.json(visit);
            });
        };
    },

    find: function (options) {

        return function find(req, res, next) {
            var Visit = registry.get('models.visit'),
                query = req.body;

            Visit.find(query, function (err, visits) {
                if (err) {
                    return next(err);
                }
                res.json(visits);
            });
        };
    },

    byId: function (options) {

        return function byId(req, res, next) {
            var Visit = registry.get('models.visit'),
                id = req.params.id;

            Visit.byId(id, function (err, visit) {
                if (err) {
                    return next(err);
                }
                if (!visit) {
                    return res.send(HTTPStatus.NOT_FOUND);
                }
                res.json(visit);
            });
        };
    }
};
