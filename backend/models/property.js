
'use strict';

var mongoose = require('mongoose'),
    Types = mongoose.Schema.Types,

    schema = new mongoose.Schema({
        name:     { type: String },
        description: { type: String },
        address:  { type: String, required: true },
        city:     { type: String, required: true },
        state:    { type: String, required: true },
        zip:      { type: String, required: true },
        country:  { type: String, required: true },
        units:    { type: Number },
        loc:      { type: Array },
        userId: { type: Types.ObjectId }
    });

schema.index({
    address : 1,
    zip: 1
}, { unique: true });

schema.statics.all = function (callback) {
    this.find({}, callback);
};

module.exports = function (options) {
    mongoose = mongoose.connect(options.dbUrl, function (err) {
        if (err) {
            throw new Error('When connecting to the database: ' + err);
        }
    });
    return mongoose.model('Property', schema);
};
