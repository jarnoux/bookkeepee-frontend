/*jslint node: true */
"use strict";

var registry = require('rig').registry,
    HTTPStatus = require('../lib/http-status'),

    Property = registry.get('models.property');

module.exports = {

    create: function (options) {

        return function create(req, res, next) {
            Property.create(req.body, function (err, property) {
                if (err) {
                    return next(err);
                }
                res.json(property);
            });
        };
    },

    remove: function (options) {

        return function remove(req, res, next) {
            var id = req.params.id;

            Property.findByIdAndRemove(id, function (err, property) {
                if (err) {
                    return next(err);
                }
                if (!property) {
                    return res.send(HTTPStatus.NOT_FOUND);
                }
                res.send(HTTPStatus.NO_CONTENT);
            });
        };
    },

    edit: function (options) {

        return function edit(req, res, next) {
            var id = req.params.id,
                update = { $set: req.body };

            Property.findByIdAndUpdate(id, update, function (err, property) {
                if (err) {
                    return next(err);
                }
                if (!property) {
                    return res.send(HTTPStatus.NOT_FOUND);
                }
                res.json(property);
            });
        };
    },

    find: function (options) {

        return function find(req, res, next) {
            var query = req.body;

            Property.find(query, function (err, properties) {
                if (err) {
                    return next(err);
                }
                res.json(properties);
            });
        };
    },

    byId: function (options) {

        return function byId(req, res, next) {
            var id = req.params.id;

            Property.findById(id, function (err, property) {
                if (err) {
                    return next(err);
                }
                if (!property) {
                    return res.send(HTTPStatus.NOT_FOUND);
                }
                res.json(property);
            });
        };
    }
};
