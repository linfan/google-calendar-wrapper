var googleapis = require('googleapis'),
    OAuth2Client = googleapis.OAuth2Client,
    client = '580910211082-snltggnikbs6hh7b0m9qh0naog1kfq7c.apps.googleusercontent.com',
    secret = 'dUHmcEDepG68iTJT3YRbLddy',
    redirect = 'http://localhost:3001/oauth2callback',
    calendar_auth_url = '',
    oauth2Client = new OAuth2Client(client, secret, redirect);

exports.ping = function() {
    console.log('pong');
};