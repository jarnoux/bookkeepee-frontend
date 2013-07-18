"use strict";

module.exports = {

    all: function (options) {

        return function all(req, res, next) {
            var Property = req.registry.get('models.property');
            Property.all(function (err, properties) {
                if (err) {
                    return next(err);
                }
                res.json(properties);
            });
        };
    },

    create: function (options) {

        return function create(req, res, next) {
            var Property = req.registry.get('models.property'),
                postData = req.body;

            Property.create(postData, function (err, property) {
                if (err) {
                    next(err);
                }
                res.json(property);
            });
        };
    },

    edit: function (options) {

        return function edit(req, res, next) {
            var Property = req.registry.get('models.property');
            res.json({});
        };
    },

    remove: function (options) {

        return function remove(req, res, next) {
            var Property = req.registry.get('models.property');
            res.json({});
        };
    },

    find: function (options) {

        return function find(req, res, next) {
            var Property = req.registry.get('models.property');
            res.json({});
        };
    },

    byId: function (options) {

        return function byId(req, res, next) {
            var Property = req.registry.get('models.property');
            res.json({});
        };
    },

    byUser: function (options) {

        return function byUser(req, res, next) {
            var Property = req.registry.get('models.property');
            res.json({});
        };
    }
};
