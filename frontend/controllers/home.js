/*jslint nomen: true */
var querystring = require('querystring');

module.exports = function () {
    'use strict';
    return function (req, res, done) {
        var unitModel = req.registry.get('models.unit');
        unitModel.find({
            ownerId: req.session.user._id
        }, function (err, result) {
            done(err, {
                units: result
            });
        });
    };
};
