
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Types = Schema.Types,

    ContactSchema = new Schema({
        name:  {type: String, required: true },
        phone: {type: String, required: true }
    }),

    TenantSchema = new Schema({
        firstname:   { type: String, required: true },
        lastname:    { type: String, required: true },
        dateOfBirth: { type: Date, required: true },
        email:       { type: String },
        phone:       { type: String, index: true },
        references:  [ ContactSchema ],
        unitId:      { type: Types.ObjectId, required: true },
        current:     { type: Boolean },
        startDate:   { type: Date, required: true },
        endDate:     { type: Date },
        leaseTerm:   { type: String, required: true }
    });

TenantSchema.index({
    firstname : 1,
    lastname: 1,
    dateOfBirth: 1
}, { unique: true });


module.exports = function (options) {
    var conn = mongoose.createConnection(options.dbUrl);

    conn.on('error', function (err) {
        if (err) {
            throw new Error('When connecting to the database: ' + err);
        }
    });

    return conn.model('Tenant', TenantSchema);
};
