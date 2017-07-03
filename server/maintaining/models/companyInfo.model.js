/**
 * Created by HUGO on 5/16/2016.
 */


'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PositionSchema = new Schema({
    positionId: String,
    positionName: String
})

var CompanySchema = new Schema({
    password: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        default: '',
        trim: true,
        required: 'Title cannot be blank'
    },
    alias: String,
    companyAddress: String,
    companyType: String,
    companyScale: String,
    phoneNumber: String,
    contactPersonName: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    positions: [PositionSchema]
},{
    collection: 'companies',
    timestamps: true
});

mongoose.model('Company', CompanySchema);
