/*jslint node: true */
'use strict';

var mongoose = require('mongoose'),
    Types = mongoose.Schema.Types,

    schema = new mongoose.Schema({
        number:      { type: String },
        description: { type: String, required: true },
        size:        { type: String },
        bedrooms:    { type: Number },
        bathrooms:   { type: Number },
        price:       { type: Number },
        available:   { type: Boolean },
        property:    { type: Types.ObjectId, required: true, ref: 'Property' },
        owner:       { type: Types.ObjectId, required: true, ref: 'User' }
    });

schema.index({
    number : 1,
    property: 1
}, { unique: true });

schema.statics.byProperty = function (property, callback) {
    this.find({property: property}, callback);
};

schema.statics.byId = function (id, callback) {
    this.findById(id).populate('property owner').exec(callback);
};

module.exports = function (options) {
    return mongoose.model('Unit', schema);
};
