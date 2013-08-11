
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Types = Schema.Types,

    ApptSchema = new Schema({
        user: { type: Types.ObjectId },
        time: { type: Date }
    }),

    schema = new Schema({
        unit:         { type: Types.ObjectId, required: true, ref: 'Unit' },
        startDate:    { type: Date, required: true },
        endDate:      { type: Date, required: true },
        places:       { type: Number },
        appointments: [ ApptSchema ]
    });

schema.index({
    unit : 1,
    starDate: 1,
    endDate: 1
}, { unique: true });

schema.statics.byUnit = function (unit, callback) {
    this.find({unit: unit}, callback);
};

schema.statics.byId = function (id, callback) {
    this.findById(id, callback);
};

module.exports = function (options) {
    return mongoose.model('Visit', schema);
};
