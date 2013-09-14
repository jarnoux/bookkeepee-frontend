/*jslint nomen: true, node: true */
'use strict';
var Rig = require('rig'),
    registry = Rig.registry;

module.exports = {
    create: function () {
        return function (req, res, next) {
            var propertyModel = registry.get('models.property'),
                unitModel     = registry.get('models.unit'),
                createNewUnit = function (property) {
                    req.body.owner = req.session.user._id;
                    unitModel.create(property._id, req.body, function (err, result) {
                        if (err) {
                            return next(err);
                        }
                        res.redirect('/home');
                    });
                },
                propertyValues = {
                    address: req.body.address,
                    city   : req.body.city,
                    state  : req.body.state,
                    zip    : req.body.zip,
                    country: req.body.country
                };

            propertyModel.find(propertyValues, function (err, property) {
                if (err) {
                    return next(err);
                }
                if (!property.length) {
                    propertyModel.create(propertyValues, function (err, newProperty) {
                        if (err) {
                            return next(err);
                        }
                        createNewUnit(newProperty);
                    });
                } else {
                    createNewUnit(property[0]);
                }
            });
        };
    },
    edit: function () {
        return function (req, res, next) {
            registry.get('models.unit').edit(req.params.id, req.body, function (err, result) {
                if (err) {
                    return next(err);
                }
                res.redirect('/units/' + req.params.id);
            });
        };
    },
    checkOwner: function () {
        return function (req, res, next) {
            registry.get('models.unit').byId(req.body.unitId, function (err, result) {
                if (err) {
                    return next(err);
                }
                if (result && result.owner._id === req.session.user._id) {
                    next();
                } else {
                    next(new Error('User must be the owner of this unit.'));
                }
            });
        };
    }
};
