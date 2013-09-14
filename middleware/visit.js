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
            registry.get('models.visit').create(req.body, function (err, result) {
                res.redirect(req.headers.referer);
            });
        };
    },
    edit: function () {
        return function (req, res, next) {
            registry.get('models.visit').edit(req.params.id, req.body, simpleResponse.bind(null, res, next));
        };
    },
    delete: function () {
        return function (req, res, next) {
            registry.get('models.visit').edit(req.params.id, simpleResponse.bind(null, res, next));
        };
    }
};
