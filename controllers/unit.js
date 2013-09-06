/*jslint node: true, nomen: true */
var Rig = require('rig');

module.exports = function () {
    'use strict';
    return function (req, res, next) {
        Rig.registry.get('models.unit').byId(req.params.id, function (err, result) {
            if (err) {
                return next(err);
            }
            result.editable = req.session.user && (req.session.user._id === result.owner._id);
            next(null, {
                unit: result
            });
        });
    };
};