'use strict';

var o2x = require('object-to-xml');
var ObjectId = require('mongodb').ObjectID;

module.exports = function(services) { return {

    create: function(req, res) {
        services.eventService.retrieveEvent(req.query.url, function (err, eventdetails) {
            if (err) {
                console.log(err);
                res.status(500).send("error retrieving event: " + err);
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
        services.eventService.retrieveEvent(req.query.url, function (err, eventdetails) {
            if (err) {
                console.log(err);
                res.status(500).send("error retrieving event: " + err);
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
        services.eventService.retrieveEvent(req.query.url, function (err, eventdetails) {
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
        services.eventService.retrieveEvent(req.query.url, function (err, eventdetails) {
            console.log("eventdetails = %j", eventdetails);
            respond(res, 'true', null, '', null);
        });
    }};
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

