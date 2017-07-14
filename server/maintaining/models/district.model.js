var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var districtSchema = new Schema({
    label: {
        type: String,
        default: ''
    },
    locationType: {
        type: String, //province, city, county, township, town, village
        default: ''
    },
    parentId: {
        type: String,
        default: ''
    },
    chineseCharacter: {
        type: String,
        default: ''
    },
    acronym: {
        type: String,
        default: ''
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    collection: 'districts',
    timestamps: true
});

districtSchema.index({'label': 1, 'locationType': 1});
districtSchema.index({'parentId': 1});

mongoose.model('District', districtSchema);
