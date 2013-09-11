/*jslint nomen: true, node: true */
'use strict';
var async = require('async'),
    Rig = require('rig'),
    registry = Rig.registry,
    simpleResponse = function (res, next, err, result) {
        if (err) {
            return next(err);
        }
        res.send(result);
    };

module.exports = {
    create: function () {
        return function (req, res, next) {
            registry.get('models.visit').create(req.body, simpleResponse.bind(null, res, next));
        };
    },
    edit: function () {
        return function (req, res, next) {
            registry.get('models.visit').edit(req.body.unitId, req.body, simpleResponse.bind(null, res, next));
        };
    },
    delete: function () {
        return function (req, res, next) {
            registry.get('models.visit').edit(req.body.unitId, simpleResponse.bind(null, res, next));
        };
    }
};