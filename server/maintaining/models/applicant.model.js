var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var appliedPositionSchema = new Schema({
    positionId: String,
    positionName: String,
    companyId: String,
    submittedAt: String,
    updatedAt: String
});

var familyMemberSchema = new Schema({
    name: String,
    relationship: String,
    phoneNumber: String,
    homeAddress : String,
    address: String,
    /*
        设为紧急联系人
     */
    emergencyFlag : Boolean
});

var threeCategorySchema = new Schema({
    name: String,
    department: String,
    type: String,
    relationship: String,
    employeeNumber: String
});

var educationHistorySchema = new Schema({
    colledgeName: String,
    startedAt: Date,
    endedAt: Date,
    major: String,
    /*
        isGraduated：
        毕业,
        肄业
    */ 
    isGraduated: String,
    degree: String
});

var registeredCompanySchema = new Schema({
    companyName: String,
    companyId: String,
    companyAlias: String,
    registerDate: Date,
    paymentDate: Date
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
    phoneNumber: String,
    resignReason: String,
    guarantorName: String,
    guarantorPhoneNumber: String
});

var applicantSchema = new Schema({
    wechatOpenId: 
    {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    age: Number,
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
    highestDegree : String,//基本信息填入的最高学历
    skill: {
        type: Array,
        default: []
    },//基本洗洗填入的经验技能
    isComplete: {
        type: Boolean,
        default: false
    },
    familyMembers: [familyMemberSchema],
    educationHistories: [educationHistorySchema],
    workExperiences: [workExperienceSchema],
    appliedPositions: [appliedPositionSchema],
    registeredCompanies: [registeredCompanySchema],
    marriageState: String,
    emergencyContactName: String,
    emergencyContactPhoneNumber: String,
    emergencyContactAddress: String,
    emergencycontactrelation : String,
    threeCategoryRelations: [threeCategorySchema],
    completeResumeInvitationList: [String],
    interviewInvitationList: [String],
    feedbackNotificationList: [String]
},{
    collection: 'applicants',
    timestamps: true
});

mongoose.model('Applicant', applicantSchema);