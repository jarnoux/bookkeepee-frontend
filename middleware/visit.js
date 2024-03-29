/*jslint nomen: true, node: true */
'use strict';
var async = require('async'),
    Rig = require('rig'),
    registry = Rig.registry;

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
            registry.get('models.visit').edit(req.params.id, req.body, function (err, result) {
                res.json(result);
            });
        };
    },
    rsvp: function () {
        return function (req, res, next) {
            registry.get('models.visit').rsvp(req.params.id, {
                userId: req.session.user._id
            }, function (err, result) {
                res.json(result);
            });
        };
    },
    unrsvp: function () {
        return function (req, res, next) {
            registry.get('models.visit').unrsvp(req.params.id, {
                userId: req.session.user._id
            }, function (err, result) {
                res.json(result);
            });
        };
    },
    delete: function () {
        return function (req, res, next) {
            registry.get('models.visit').delete(req.params.id, function (err, result) {
                res.json(result.toString);
            });
        };
    }
};
