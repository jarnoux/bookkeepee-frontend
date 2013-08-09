/*jslint nomen: true */
module.exports = {
    create: function () {
        'use strict';
        return function (req, res, next) {
            var propertyModel = req.registry.get('models.property'),
                unitModel     = req.registry.get('models.unit'),
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
    }
};
