
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Types = Schema.Types,

    LeaseSchema = new Schema({
        unitId:      { type: Types.ObjectId, required: true },
        startDate:   { type: Date, required: true },
        endDate:     { type: Date },
        term:        { type: String, required: true },
        rent:        { type: Number },
        tenants:     [ Types.ObjectId ]
    });

LeaseSchema.index({
    unitId : 1
});

module.exports = function (options) {
    var conn = mongoose.createConnection(options.dbUrl);

    conn.on('error', function (err) {
        if (err) {
            throw new Error('When connecting to the database: ' + err);
        }
    });

    return conn.model('Lease', LeaseSchema);
};
