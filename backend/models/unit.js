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
        ownerId:     { type: Types.ObjectId, required: true }
    });

schema.index({
    number : 1,
    property: 1
}, { unique: true });

schema.statics.byProperty = function (property, callback) {
    this.find({property: property}, callback);
};

schema.statics.byId = function (id, callback) {
    this.findById(id).populate('property').exec(callback);
};

module.exports = function (options) {
    var conn = mongoose.createConnection(options.dbUrl);

    conn.on('error', function (err) {
        if (err) {
            throw new Error('When connecting to the database: ' + err);
        }
    });

    return mongoose.model('Unit', schema);
};
