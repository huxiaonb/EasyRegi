require('./server/maintaining/models/district.model.js');
var  http=require('http');
var  mongoose = require('mongoose');
var District = mongoose.model('District');
var pinyin = require('pinyin')
var _ = require('lodash');
var async = require('async');
var districtObj = require('./maintain/src/components/alloc.js');

// var MONGO_DB,
//     DOCKER_DB = process.env.DB_PORT;

// if(DOCKER_DB){
//     MONGO_DB = DOCKER_DB.replace('tcp', 'mongodb') + '/easyregister';
// } else {
//     MONGO_DB = process.env.MONGODB;
// }
// var mongodb_uri = 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + ':' + (process.env.DB_1_PORT_27017_TCP_PORT || 27017) + '/easyregister';
// console.log(process.env);
// console.log(MONGO_DB);
// console.log(mongodb_uri);
// mongoose.connect(MONGO_DB);
// console.log(process.env.DB_1_PORT_27017_TCP_ADDR, process.env.DB_1_PORT_27017_TCP_PORT);

// var server=http.createServer(function(req,res){
//     console.log("Get A Request...");
//     res.writeHead(200,{
//         "Content-Type":"Text/plain"
//     });
//     res.write("Hello NodeJs");
//     res.end();
// });
// server.listen(80);
// mongoose.connect('mongodb://localhost:27017/mean-dev', function (error) {
//     if (error) console.error('connect mongodb error:', error)
//     else {
//         console.log('connection established');
//         var firstProvince = {
//             label: '广东省',
//             value: '广东省',
//             locationType: 'province'
//         }

//         var districtEntity = new District(firstProvince);
//         districtEntity.save(function(err, data){
//             if(err) console.log(err);
//             else console.log(data);
//             mongoose.disconnect(function(err2){
//                 if(err2) console.log('Error in disconnect');
//                 else console.log('disconnected');
//             })
//         })
//     }
// })

// console.log(districtObj)
// var districts = JSON.parse(districtObj);
// console.log(districtObj['alloc'][0].length);
// console.log('上海')
// console.log(JSON.stringify(districtObj['alloc'][0][4]))
console.log(_.flatten(pinyin('平昌县')).join(''));
console.log(_.flatten(pinyin('平昌县',{style: pinyin.STYLE_NORMAL})).join('')); //this is correct
console.log(pinyin('吴圩机场',{style: pinyin.STYLE_NORMAL, heteronmy: true}));
console.log(pinyin('平昌县',{style: pinyin.STYLE_NORMAL, heteronmy: true, segment: true}));
console.log(pinyin('平昌县',{style: pinyin.STYLE_FIRST_LETTER, heteronmy: true, segment: true}));
console.log(pinyin('平',{style: pinyin.STYLE_FIRST_LETTER, heteronmy: true, segment: true}));

var tasks = [];
tasks.push(startDistrictParser(districtObj));
tasks.push(connectMongodb());
tasks.push(splitProvinces());
tasks.push(disconnectMongodb());

async.waterfall(tasks, function(err1, finalResult){
    if(err1) {
        console.log('error in parse districts', err1)
    } else {
        console.log('execute successfully');
    }
})


function startDistrictParser(districtObj){
    return function(callback){
        var result = {
            districts: _.get(districtObj, ['alloc', '0'], [])
        };
        return callback(null, result);
    }
}

function connectMongodb(){
    return function(result, callback){
        mongoose.connect('mongodb://localhost:27017/mean-dev', function (error) {
            if (error) {
                console.error('connect mongodb error:', error);
                return callback(error, null);
            }
            else {
                console.log('connection established');
                return callback(null, result);
            }
        });
    }
}

function splitProvinces(){
    return function(result, callback){
        var provinces = _.get(result, ['districts'], []);
        var provinceTasks = [];
        _.forEach(provinces, function(pro){
            provinceTasks.push(persistProvince(pro));
        });
        async.parallelLimit(provinceTasks, 10, function(err, persistResult){
            if(err) {
                console.log('error in persist dictricts', err);
                return callback(err, null);
            } else {
                console.log('successfully persisted');
                result.persistResult = persistResult;
                return callback(null, result);
            }
        });
    }
}

function persistProvince(provinceItem){
    return function(callback){
        var cities = _.get(provinceItem, ['children'], []),
            label = _.get(provinceItem, ['label'], '');
        if(!_.isEmpty(label)){
            var chineseCharacter = _.flatten(pinyin(label,{style: pinyin.STYLE_NORMAL, heteronmy: true, segment: true})).join(''),
                acronym = _.flatten(pinyin(label,{style: pinyin.STYLE_FIRST_LETTER, heteronmy: true, segment: true})).join('');
            var provinceObj = {
                label: label,
                locationType: 'province',
                chineseCharacter: chineseCharacter,
                acronym: acronym,
                active: true
            };
            persistDistrctModel(provinceObj)(function(err, data){
                if(err) {
                    console.log('error in saving province', label, err);
                    return callback(err, null)
                } else {
                    var persistCityTasks = [];
                    _.forEach(cities, function(city){
                        persistCityTasks.push(persistCity(city, data._id));
                    });
                    async.parallelLimit(persistCityTasks, 10, function(err1, taskResult){
                        if(err1) {
                            console.log('error in saving cities', err1);
                            return callback(err1, null);
                        } else {
                            return callback(null, taskResult);
                        }
                    });
                }
            });
        } else {
            return callback(null, null);
        }
    }
}

function persistCity(cityItem, parentId) {
    return function(callback){
        var counties = _.get(cityItem, ['children'], []),
            label = _.get(cityItem, ['label'], '');
        if(!_.isEmpty(label)){
            var chineseCharacter = _.flatten(pinyin(label,{style: pinyin.STYLE_NORMAL, heteronmy: true, segment: true})).join(''),
                acronym = _.flatten(pinyin(label,{style: pinyin.STYLE_FIRST_LETTER, heteronmy: true, segment: true})).join('');
            var cityObj = {
                label: label,
                locationType: 'city',
                chineseCharacter: chineseCharacter,
                acronym: acronym,
                parentId: parentId,
                active: true
            };
            persistDistrctModel(cityObj)(function(err, data){
                if(err) {
                    console.log('error in saving city', label, err);
                    return callback(err, null);
                } else {
                    var persistCountyTasks = [];
                    _.forEach(counties, function(county){
                        persistCountyTasks.push(persistCounty(county, data._id));
                    });
                    async.parallelLimit(persistCountyTasks, 10, function(err1, taskResult){
                        if(err1) {
                            console.log('error in saving cities', err1);
                            return callback(err1, null);
                        } else {
                            return callback(null, taskResult);
                        }
                    });

                }
            });
        } else {
            return callback(null, null);
        }
    }
}

function persistCounty(countyItem, parentId){
    return function(callback){
        var label = _.get(countyItem, ['label'], '');
        if(!_.isEmpty(label)){
            var chineseCharacter = _.flatten(pinyin(label,{style: pinyin.STYLE_NORMAL, heteronmy: true, segment: true})).join(''),
                acronym = _.flatten(pinyin(label,{style: pinyin.STYLE_FIRST_LETTER, heteronmy: true, segment: true})).join('');
            var countyObj = {
                label: label,
                locationType: 'county',
                chineseCharacter: chineseCharacter,
                acronym: acronym,
                parentId: parentId,
                active: true
            };
            persistDistrctModel(countyObj)(function(err, data){
                if(err) {
                    console.log('error in saving county', label, err);
                    return callback(err, null);
                } else {
                    return callback(null, data);
                }
            });
        } else {
            return callback(null, null);
        }
    }
}


function persistDistrctModel(districtObj){
    return function(callback){
        var districtEntity = new District(districtObj);
        districtEntity.save(function(err, data){
            if(err) {
                console.log('error in saving district', districtObj, err);
                return callback(err, null);
            } else {
                return callback(null, data);
            }
        })
    }
}

function disconnectMongodb(){
    return function(result, callback){
        mongoose.disconnect(function(err){
            if(err) console.log('Error in disconnect', err);
            else console.log('disconnected');
            return callback(null, null);
        })
    }
}