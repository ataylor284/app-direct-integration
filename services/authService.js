'use strict';

module.exports = function(services) { return {

    authenticate: function(req) {
        req.session.authenticated = true;
    },

    allowRequest: function(req) {
        var controller = req.params && req.params[0].split('/')[0];
        if (controller == 'auth') {
            return true;
        } else {
            return req.session.authenticated;
        }
    }};

}