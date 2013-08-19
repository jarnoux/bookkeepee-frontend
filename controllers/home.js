/*jslint nomen: true */
var querystring = require('querystring'),
	Rig = require('rig');

module.exports = function () {
    'use strict';
    return function (req, res, done) {
        var unitModel = Rig.registry.get('models.unit');
        unitModel.byOwner(req.session.user._id, function (err, result) {
            done(err, {
                units: result
            });
        });
    };
};
