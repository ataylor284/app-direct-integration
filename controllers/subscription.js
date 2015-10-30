'use strict';

var o2x = require('object-to-xml');
var request = require('request');
var xml2js = require('xml2js');
var ObjectId = require('mongodb').ObjectID;

module.exports = function(services) { return {

    create: function(req, res) {
        getEventDetails(req.query.url, function (err, eventdetails) {
            if (err) {
                console.log(err);
            } else {
                eventdetails.event.creator.plan = eventdetails.event.payload.order.editionCode;
                services.db.collection('users').save(eventdetails.event.creator, function(err, records) {
                    if (err) {
                        console.log(err);
                        respond(res, 'false', null, 'Account creation failed', 'UNKNOWN_ERROR');
                    } else {
                        respond(res, 'true', eventdetails.event.creator._id, 'Account creation successful', null);
                    }
                });
            }
        });
    },

    cancel: function(req, res) {
        getEventDetails(req.query.url, function (err, eventdetails) {
            if (err) {
                console.log(err);
            } else {
                services.db.collection('users').findOne({_id: ObjectId(eventdetails.event.payload.account.accountIdentifier)}, function(err, user) {
                    if (err) {
                        console.log(err);
                        respond(res, 'false', null, 'Account cancellation failed', 'UNKNOWN_ERROR');
                    } else {
                        console.log("cancelling %j", user);
                        respond(res, 'true', null, 'Account cancelled', null);
                    }
                });
            }
        });
    },

    change: function(req, res) {
        getEventDetails(req.query.url, function (err, eventdetails) {
            if (err) {
                console.log(err);
            } else {
                services.db.collection('users').findOne({_id: ObjectId(eventdetails.event.payload.account.accountIdentifier)}, function(err, user) {
                    if (err) {
                        console.log(err);
                        respond(res, 'false', null, 'Account change failed', 'UNKNOWN_ERROR');
                    } else {
                        user.plan = eventdetails.event.payload.order.editionCode;
                        services.db.collection('users').save(user, function(err, records) {
                            if (err) {
                                console.log(err);
                                respond(res, 'false', null, 'Account change failed', 'UNKNOWN_ERROR');
                            } else {
                                respond(res, 'true', eventdetails.event.creator._id, 'Account change successful', null);
                            }
                        });
                    }
                });
            }
        });
    },

    status: function(req, res) {
        getEventDetails(req.query.url, function (err, eventdetails) {
            console.log("eventdetails = %j", eventdetails);
            respond(res, 'true', null, '', null);
        });
    }};
}

function getEventDetails(url, callback) {
    var oauth = { consumer_key: process.env.APPDIRECT_CONSUMER_KEY, consumer_secret: process.env.APPDIRECT_CONSUMER_SECRET };
    request({url: url, oauth: oauth}, function(error, result, body) {
        if (error) {
            callback(error, null);
        } else {
            xml2js.parseString(body, {attrkey: '@', explicitArray: false}, function (err, eventdetails) {
                callback(err, eventdetails);
            });
        }
    });
}

function respond(res, success, accountIdentifier, message, errorCode) {
    var result = o2x({'?xml version="1.0" encoding="utf-8"?' : null, result: {
        'success': success,
        'message': message,
        'accountIdentifier': accountIdentifier && accountIdentifier.toHexString(),
        'errorCode': errorCode
    }});
    res.setHeader('Content-Type', 'text/xml');
    res.send(result);
}

