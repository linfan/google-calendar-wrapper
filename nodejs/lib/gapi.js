var fs = require('fs'),
    path = require('path'),
    googleapis = require('googleapis');
    util = require('./utility');

function OAuthHandler() {

    var OAuth2Client = googleapis.OAuth2Client;
    var self = this;

    fs.readFile(path.resolve(__dirname, '..', 'client_secrets.json'), 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        var client_info = JSON.parse(data)['web'],
            client_id = client_info['client_id'],
            client_secret = client_info['client_secret'],
            redirect_uri = client_info['redirect_uris'][0];
        console.log('client_id: ' + client_id);
        console.log('client_secret: ' + client_secret);
        console.log('redirect_uri: ' + redirect_uri);

        self.oauth2Client = new OAuth2Client(client_id, client_secret, redirect_uri);
        console.log('oath2_client: ' + self.oauth2Client);
    });

    var get_oauth_client = function () {
        return self.oauth2Client;
    }

    this.get_oauth_url = function (callback) {
        util.waitUntilAvailable(get_oauth_client, function() {
            calendar_auth_url = self.oauth2Client.generateAuthUrl({
                access_type: 'offline',
            //  scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar'
                scope: 'https://www.googleapis.com/auth/calendar.readonly'
            });
            console.log('calendar_auth_url: ' + calendar_auth_url);
            callback(calendar_auth_url);
        });
    }

    this.get_oauth_token = function (code, callback) {
        util.waitUntilAvailable(get_oauth_client, function() {
            self.oauth2Client.getToken(code, callback);
        });
    }
}

var OAuth = new OAuthHandler;
exports.OAuth = OAuth;