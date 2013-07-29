
'use strict';

var mongoose = require('mongoose'),
    Types = mongoose.Schema.Types,

    schema = new mongoose.Schema({
        number:      { type: String, required: true },
        description: { type: String },
        size:        { type: String },
        bedrooms:    { type: Number },
        bathrooms:   { type: Number },
        price:       { type: Number },
        available:   { type: Boolean },
        propertyId:  { type: Types.ObjectId, required: true }
    });

schema.index({
    number : 1,
    propertyId: 1
}, { unique: true });

schema.statics.byProperty = function (propertyId, callback) {
    this.find({propertyId: propertyId}, callback);
};

module.exports = function (options) {
    var conn = mongoose.createConnection(options.dbUrl);

    conn.on('error', function (err) {
        if (err) {
            throw new Error('When connecting to the database: ' + err);
        }
    });

    return conn.model('Unit', schema);
};
