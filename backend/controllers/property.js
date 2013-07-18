
"use strict";

var HTTPStatus = {
    NO_CONTENT: 204,
    NOT_FOUND:  400
};

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
                    return next(err);
                }
                res.json(property);
            });
        };
    },

    remove: function (options) {

        return function remove(req, res, next) {
            var Property = req.registry.get('models.property'),
                id = req.params.id;

            Property.findByIdAndRemove(id, function (err, property) {
                if (err) {
                    return next(err);
                }
                res.send(HTTPStatus.NO_CONTENT);
            });
        };
    },

    edit: function (options) {

        return function edit(req, res, next) {
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
            var Property = req.registry.get('models.property'),
                // id = req.params.id;
                id = '51e7ae0b713955b0bc000002';

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
    },

    byUser: function (options) {

        return function byUser(req, res, next) {
            var Property = req.registry.get('models.property');
            res.json({});
        };
    }
};
