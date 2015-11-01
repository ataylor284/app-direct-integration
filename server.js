'use strict';

var env = require('node-env-file');
var express = require('express');
var fs = require('fs');
var request = require('request');
var xml2js = require('xml2js');

// load configuration from environment
env(__dirname + '/.env', {verbose: true, raise: false});

var services = {};

// load services
fs.readdirSync(__dirname + '/services').forEach(function(filename) {
    if (filename.indexOf('.js', filename.length - 3) == -1) {
        return;
    }
    var name = filename.substring(0, filename.length - 3);
    console.log('loading service ' + name);
    services[name] = require('./services/' + name)(services);
});

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

var server = app.listen(process.env.PORT || 8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("app listening at http://%s:%s", host, port)
});
