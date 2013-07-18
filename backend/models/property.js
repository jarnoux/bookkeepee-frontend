var mongoose = require('mongoose'),
    Types = mongoose.Schema.Types,
    schema = new mongoose.Schema({
        name:     { type: String },
        address:  { type: String, required: true },
        city:     { type: String, required: true },
        state:    { type: String, required: true },
        zip:      { type: String, required: true },
        country:  { type: Number, required: true },
        userId: { type: Types.ObjectId }
    });

schema.index({
    lastName : 1,
    firstName: 1
}, { unique: true });

module.exports = function (options) {
    'use strict';
    mongoose = mongoose.connect(options.dbUrl, function (err) {
        if (err) {
            throw new Error('When connecting to the database: ' + err);
        }
    });
    return mongoose.model('User', schema);
};