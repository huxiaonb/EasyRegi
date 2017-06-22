var  http=require('http');
var  mongoose = require('mongoose');

var MONGO_DB,
    DOCKER_DB = process.env.DB_PORT;

if(DOCKER_DB){
    MONGO_DB = DOCKER_DB.replace('tcp', 'mongodb') + '/easyregister';
} else {
    MONGO_DB = process.env.MONGODB;
}
var mongodb_uri = 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + ':' + (process.env.DB_1_PORT_27017_TCP_PORT || 27017) + '/easyregister';
console.log(process.env);
console.log(MONGO_DB);
console.log(mongodb_uri);
mongoose.connect(MONGO_DB);
console.log(process.env.DB_1_PORT_27017_TCP_ADDR, process.env.DB_1_PORT_27017_TCP_PORT);

var server=http.createServer(function(req,res){
    console.log("Get A Request...");
    res.writeHead(200,{
        "Content-Type":"Text/plain"
    });
    res.write("Hello NodeJs");
    res.end();
});
server.listen(80);
