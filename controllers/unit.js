/*jslint node: true, nomen: true */
var Rig = require('rig'),
    registry = Rig.registry;

module.exports = function () {
    'use strict';
    return function (req, res, next) {
        registry.get('models.unit').byId(req.params.id, function (err, unit) {
            if (err) {
                return next(err);
            }
            unit.editable = req.session.user && (req.session.user._id === unit.owner._id);
            unit.visits.forEach(function (visit) {
                visit.spotsLeft = visit.spots - visit.visitors.length;
                visit.rsvped = visit.visitors.some(function (visitorId) {
                    return visitorId === req.session.user._id;
                });
            });
            next(null, {
                unit: unit
            });
        });
    };
};
