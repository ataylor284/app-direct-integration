'use strict';

module.exports = function(services) { return {

    authenticate: function(req) {
        req.session.authenticated = true;
    },

    allowRequest: function(req) {
        var controller = req.params && req.params[0].split('/')[0];
        if (process.env.DISABLE_SSO || controller == 'auth' || controller == 'subscriptionApi') {
            return true;
        } else {
            return req.session.authenticated;
        }
    }};

}
