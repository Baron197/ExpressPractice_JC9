var { MongoClient, ObjectID, url } = require('./mongoDB')
var db = require('./mysqlDB')

module.exports = {
    mongodb: { MongoClient, ObjectID, url },
    mysql: { db }
}
