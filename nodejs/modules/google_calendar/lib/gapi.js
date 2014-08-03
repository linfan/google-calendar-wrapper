var fs = require('fs'),
    path = require('path'),
    googleapis = require('googleapis'),
    util = require('../../public/lib/utility').Utility;

function OAuthHelper() {

    var OAuth2Client = googleapis.OAuth2Client;
    var self = this;

    fs.readFile(path.resolve(__dirname, '..', 'client_secrets.json'), 'utf8', function (err,data) {
        if (err) {
            return util.log(err);
        }
        var client_info = JSON.parse(data)['web'],
            client_id = client_info['client_id'],
            client_secret = client_info['client_secret'],
            redirect_uri = client_info['redirect_uris'][0];
        util.log('client_id: ' + client_id);
        util.log('client_secret: ' + client_secret);
        util.log('redirect_uri: ' + redirect_uri);

        self.oauth2Client = new OAuth2Client(client_id, client_secret, redirect_uri);
        util.log('oath2_client: ' + self.oauth2Client);
    });

    var internal_oauth_client = function () {
        return self.oauth2Client;
    };

    this.get_oauth_url = function (callback) {
        util.waitUntilAvailable(internal_oauth_client, function() {
            calendar_auth_url = self.oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: 'https://www.googleapis.com/auth/calendar'
            });
            util.log('calendar_auth_url: ' + calendar_auth_url);
            callback(calendar_auth_url);
        });
    };

    this.get_oauth_token = function (code, callback) {
        util.waitUntilAvailable(internal_oauth_client, function() {
            self.oauth2Client.getToken(code, callback);
        });
    };

    this.get_oauth_client = function (token, callback) {
        googleapis
        .discover('calendar', 'v3')
        .execute(function(err, client){
            if(!err) {
                self.oauth2Client.setCredentials(token);
                callback(client, self.oauth2Client);
            }
        });
    }
}

var OAuth = new OAuthHelper;
exports.OAuth = OAuth;
