/*jslint node: true */
'use strict';

var mongoose = require('mongoose'),
    Types = mongoose.Schema.Types,

    schema = new mongoose.Schema({
        name:        { type: String },
        description: { type: String },
        address:     { type: String, required: true },
        city:        { type: String, required: true },
        state:       { type: String, required: true },
        zip:         { type: String, required: true },
        country:     { type: String, required: true },
        loc:         { type: Array }
    });

schema.index({
    address : 1,
    zip: 1
}, { unique: true });

module.exports = function (options) {
    return mongoose.model('Property', schema);
};
