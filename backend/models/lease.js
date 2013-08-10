
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Types = Schema.Types,

    schema = new Schema({
        unit:        { type: Types.ObjectId, required: true, ref: 'Unit' },
        startDate:   { type: Date, required: true },
        endDate:     { type: Date, required: true },
        term:        { type: String },
        rent:        { type: Number },
        tenants:     [{ type: Types.ObjectId, required: true, ref: 'User' }]
    });

schema.index({
    unit : 1,
    startDate: 1,
    endDate: 1
}, { unique: true });

schema.statics.byUnit = function (unit, callback) {
    this.find({unit: unit}, callback);
};

schema.statics.byId = function (id, callback) {
    this.findById(id).populate('unit tenants').exec(callback);
};

module.exports = function (options) {
    return mongoose.model('Lease', schema);
};
