
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Types = Schema.Types,

    VisitSchema = new Schema({
        unit:         { type: Types.ObjectId, required: true, ref: 'Unit' },
        startDate:    { type: Date, required: true },
        endDate:      { type: Date, required: true },
        type:         { type: String },
        spots:        { type: Number },
        visitors:     [{ type: Types.ObjectId, ref: 'User' }]
    });

VisitSchema.index({
    unit : 1,
    starDate: 1,
    endDate: 1
}, { unique: true });

VisitSchema.statics.byUnit = function (unit, callback) {
    this.find({unit: unit}, callback);
};

VisitSchema.statics.byId = function (id, callback) {
    this.findById(id, callback);
};

module.exports = function (options) {
    return mongoose.model('Visit', VisitSchema);
};
