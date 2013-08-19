/*jslint node: true, nomen:true*/

"use strict";

var _ = require('underscore'),
    registry = require('rig').registry,
    HTTPStatus = require('../lib/http-status');



module.exports = {

    byProperty: function (options) {

        return function byProperty(req, res, next) {
            var Unit = registry.get('models.unit'),
                property = req.params.id;

            Unit.byProperty(property, function (err, units) {
                if (err) {
                    return next(err);
                }
                Unit.populate(units, options.populate, function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    res.json(result);
                });
            });
        };
    },

    create: function (options) {

        return function create(req, res, next) {
            var Unit = registry.get('models.unit'),
                postData = _.clone(req.body);

            postData.property = req.params.id;

            Unit.create(postData, function (err, unit) {
                if (err) {
                    return next(err);
                }
                Unit.populate(unit, options.populate, function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    res.json(result);
                });
            });
        };
    },

    remove: function (options) {

        return function remove(req, res, next) {
            var Unit = registry.get('models.unit'),

                unitId = req.params.id;

            Unit.findByIdAndRemove(unitId, function (err, unit) {
                if (err) {
                    return next(err);
                }
                if (!unit) {
                    return res.send(HTTPStatus.NOT_FOUND);
                }
                res.send(HTTPStatus.NO_CONTENT);
            });
        };
    },

    edit: function (options) {

        return function edit(req, res, next) {
            var Unit = registry.get('models.unit'),
                id = req.params.id,
                update = { $set: req.body };

            Unit.findByIdAndUpdate(id, update, function (err, unit) {
                if (err) {
                    return next(err);
                }
                if (!unit) {
                    return res.send(HTTPStatus.NOT_FOUND);
                }
                Unit.populate(unit, options.populate, function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    res.json(result);
                });
            });
        };
    },

    find: function (options) {

        return function find(req, res, next) {
            var Unit = registry.get('models.unit'),
                query = req.body;

            Unit.find(query, function (err, units) {
                if (err) {
                    return next(err);
                }
                Unit.populate(units, options.populate, function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    res.json(result);
                });
            });
        };
    },

    byId: function (options) {

        return function byId(req, res, next) {
            var Unit = registry.get('models.unit'),
                id = req.params.id;

            Unit.byId(id, function (err, unit) {
                if (err) {
                    return next(err);
                }
                if (!unit) {
                    return res.send(HTTPStatus.NOT_FOUND);
                }
                Unit.populate(unit, options.populate, function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    res.json(result);
                });
            });
        };
    },

    byOwner: function (options) {

        return function byOwner(req, res, next) {
            var Unit = registry.get('models.unit'),
                owner = req.params.id;

            Unit.find({owner: owner}, function (err, units) {
                if (err) {
                    return next(err);
                }
                Unit.populate(units, options.populate, function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    res.json(result);
                });
            });
        };
    }
};
