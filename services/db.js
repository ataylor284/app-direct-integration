'use strict';

var MongoClient = require('mongodb').MongoClient;

module.exports = function(services) { 
    MongoClient.connect(process.env.DATABASE_URL, function(err, db) {
        if (err) {
            console.log("mongo error: " + err);
        } else {
            console.log("connected to mongo");
            services.db = db;
        }
        return undefined;
    });
}
