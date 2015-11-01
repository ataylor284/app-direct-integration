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

    testCreate: function(test) {
        var subscriptionApiController = require('../controllers/subscriptionApi')(services);
        services.eventService = {
            retrieveEvent: function(url, callback) {
                callback(null, {
                    event: {
                        creator: { email: 'ataylor@redtoad.ca' },
                        payload: {
                            order: { editionCode: 'FREE'}
                        }
                    }
                });
            }
        }

        subscriptionApiController.create({query: {url: 'http://www.example.com'}}, {
            setHeader: function(header, value) {
                test.equal(header, 'Content-Type');
                test.equal(value, 'text/xml');
            },
            send: function(value) {
                test.ok(value.indexOf('success') != -1)
                test.done();
            }
        });

    }

};
