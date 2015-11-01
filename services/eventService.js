'use strict';

var request = require('request');
var xml2js = require('xml2js');

module.exports = function(services) { return {

    retrieveEvent: function(url, callback) {
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
    }};

}




