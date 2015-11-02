'use strict';

var ObjectId = require('mongodb').ObjectID;

module.exports = function(services) { return {
    GET: function(req, res) {
        var id = req.params && req.params[0].split('/')[1];
        if (id) {
            var users = services.db.collection('users').findOne({_id: ObjectId(id)}, function(err, user) {
                if (err) {
                    console.log(err);
                    res.sendStatus(404);
                } else {
                    res.send(user);
                }
            });
        } else {
            var users = services.db.collection('users').find().toArray(function(err, docs) {
                if (err) {
                    console.log(err);
                }
                res.send(docs);
            });
        }
    },

    DELETE: function(req, res) {
        var id = req.params && req.params[0].split('/')[1];
        if (id) {
            var users = services.db.collection('users').remove({_id: ObjectId(id)}, function(err, user) {
                if (err) {
                    console.log(err);
                    res.sendStatus(404);
                } else {
                    res.sendStatus(200);
                }
            });
        } else {
            res.sendStatus(400);
        }
    }};
}
