'use strict';

var env = require('node-env-file');
var express = require('express');
var fs = require('fs');
var request = require('request');
var xml2js = require('xml2js');
var MongoClient = require('mongodb').MongoClient;

// load configuration from environment
env(__dirname + '/.env', {verbose: true, raise: false});

// services to inject
var services = {};
MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
    if (err) {
        console.log("mongo error: " + err);
    } else {
        console.log("connected to mongo");
        services.db = db;
    }
})
//services.userService = require('./services/userService')(services);

var app = express();
app.use(express.static('static'));

// load controllers
fs.readdirSync(__dirname + '/controllers').forEach(function(filename) {
    if (filename.indexOf('.js', filename.length - 3) == -1) {
        return;
    }
    var name = filename.substring(0, filename.length - 3);
    console.log('loading controller ' + name);
    var controller = require('./controllers/' + name)(services);
    for (var method in controller) {
        console.log('  method ' + method);
        if (['GET', 'POST', 'PUT', 'DELETE'].indexOf(method) == 0) {
            app[method.toLowerCase()]('/' + name + '*', controller[method]);
        } else {
            app.get('/' + name + '/' + method, controller[method]);
        }
    }
});

var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("app listening at http://%s:%s", host, port)
});
