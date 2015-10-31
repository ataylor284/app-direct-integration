'use strict';

var MongoClient = require('mongodb').MongoClient;

var services = {};

module.exports = {
    setUp: function (done) {
        MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
            if (err) {
                console.log("mongo error: " + err);
            } else {
                services.db = db;
            }
            done();
        });
    },

    tearDown: function (done) {
        services.db.collection('users').remove();
        services.db.close();
        done();
    },

    testGetAll: function(test) {
        var userController = require('../controllers/user')(services);
        var testUser = { "email" : "ataylor@redtoad.ca", "firstName" : "Andrew", "lastName" : "Taylor" };
        services.db.collection('users').save(testUser, function(err, records) {
            if (err) {
                console.log(err);
            }

            userController.GET({params: null}, {
                send: function(value) {
                    test.equal(value.length, 1);
                    test.equal(value[0].email, "ataylor@redtoad.ca");
                    test.done();
                }
            });
        });

    },

    testGetById: function(test) {
        var userController = require('../controllers/user')(services);
        var testUser = { "email" : "ataylor@redtoad.ca", "firstName" : "Andrew", "lastName" : "Taylor" };
        services.db.collection('users').save(testUser, function(err, records) {
            if (err) {
                console.log(err);
            }
            userController.GET({params: ['/' + testUser._id.toHexString()]}, {
                status: function(value) {
                    return this;
                },
                send: function(value) {
                    test.equal(value.email, "ataylor@redtoad.ca");
                    test.done();
                }
            });
        });

    },

    testGetById_badId: function(test) {
        var userController = require('../controllers/user')(services);

        userController.GET({params: ['/000000000000000000000000']}, {
            status: function(value) {
                test.equal(value, 404);
                return this;
            },
            send: function(value) {
                test.deepEqual(value, null);
                test.done();
            }
        });
    }

};
