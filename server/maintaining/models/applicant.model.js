var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var appliedPositionSchema = new Schema({
    positionId: String,
    positionName: String,
    submittedAt: String,
    updatedAt: String
});

var familyMemberSchema = new Schema({
    name: String,
    relationship: String,
    phoneNumber: String,
    /*
        设为紧急联系人
     */
    emergencyFlag : Boolean
});

var educationHistorySchema = new Schema({
    colledgeName: String,
    startedAt: Date,
    endedAt: Date,
    major: String,
    /*
        isGraduated：
        '0' --- 毕业,
        '1' --- 肄业
    */ 
    isGraduated: String,
    degree: String
});

var registeredCompanySchema = new Schema({
    companyName: String,
    companyId: String,
    companyAlias: String,
    registerDate: Date
});

var workExperienceSchema = new Schema({
    companyName: String,
    startedAt: Date,
    endedAt: Date,
    title: String,
    /*
        salaryRange：
        '0' --- 2000以下
        '1' --- 2000~3000
        '2' --- 3000~4000
        '3' --- 4000~5000
        '4' --- 5000~10000
        '5' --- 10000以上
    */
    salaryRange: String,
    contactPersonName: String,
    phoneNumber: String
});

var applicantSchema = new Schema({
    wechatOpenId: 
    {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    gender: String,
    folk: String,
    birthDate: Date,
    healthState: String,
    idCardNumber: String,
    homeAddress: String,
    currentAddress: String,
    mobile: String,
    tele: String,
    email: String,
    qqNumber: String,
    photoName: String,
    idCardFrontPhotoName: String,
    idCardBackPhotoName: String,
    otherCredentialPhotoName: String,
    validFrom: Date,
    validTo: Date,
    issuingAuthority: String,
    nativePlace: String,
    familyMembers: [familyMemberSchema],
    educationHistories: [educationHistorySchema],
    workExperiences: [workExperienceSchema],
    appliedPositions: [appliedPositionSchema],
    registeredCompanies: [registeredCompanySchema]
},{
    collection: 'applicants',
    timestamps: true
});

mongoose.model('Applicant', applicantSchema);