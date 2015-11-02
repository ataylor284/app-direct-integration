'use strict';

var openid = require('openid');

var relyingParty = new openid.RelyingParty(
    process.env.OPENID_VERIFY_URL,
    process.env.APP_URL,
    false,
    false,
    []);

module.exports = function(services) { return {

    openid: function(req, res) {
        var identifier = req.query.openid_identifier;

        // Resolve identifier, associate, and build authentication URL
        relyingParty.authenticate(identifier, false, function(error, authUrl) {
            console.log("authenticate: " + error + " " + authUrl);
            if (error) {
                res.send('Authentication failed: ' + error.message);
            }
            else if (!authUrl) {
                res.send('Authentication failed');
            } else {
                res.redirect(authUrl);
            }
        });
    },

    verify: function(req, res) {
        relyingParty.verifyAssertion(req, function(err, result) {
            if (err || !result.authenticated) {
                console.log("authentication error " + error);
                res.status(500).send("authentication error");
            } else {
                services.authService.authenticate(req);
                res.redirect(process.env.APP_URL);
            }
        });
    }};

}
