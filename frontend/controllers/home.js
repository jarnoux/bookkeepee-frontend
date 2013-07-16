/*jslint nomen: true */
var querystring = require('querystring');

module.exports = function () {
    'use strict';
    return function (req, res, done) {
        var backend = req.registry.get('models.backend'),
            parameters = {
                viewerid: req.session.user._id,
                ownerid: req.session.user._id
            };
        backend.request({
            path: '/property/view?' + querystring.stringify(parameters)
        }, function (err, result) {
            done(err, {
                properties: result
            });
        });
    };
};
