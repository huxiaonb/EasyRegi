/**
 * Created by HUGO on 5/16/2016.
 */
'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var welfareSchema = new Schema({

});

var PositionSchema = new Schema({
    name: {
        type: String,
        default: '',
        trim: true
    },
    companyId: String,
    phoneNumber: String,
    totalRecruiters: {
        type: String,
        default: ''
    },
    salary: {
        type: String,
        default: ''
    },
    welfares: {
        type: Array, 
        default: []
    },
    positionDesc: {
        type: String,
        default:''
    },
    jobRequire:{
        type: String,
        default:''
    },
    luckyFlag: {
        type: Boolean,
        default: false,
    },
    salaryStart: String,
    salaryEnd: String,
    contactPerson: String,
    ageRangeStart: String,
    ageRangeEnd: String
},{
    collection: 'positions',
    timestamps: true
});

mongoose.model('Position', PositionSchema);
