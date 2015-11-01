'use strict';

var ObjectId = require('mongodb').ObjectID;

module.exports = function(services) { return {

    create: function(attributes, plan) {
        attributes.plan = plan;
        services.db.collection('users').save(attributes, function(err, records) {
            if (err) {
                console.log(err);
                return null;
            } else {
                console.log("records = %j", records)
                return null;
            }
        });
    }};

}



