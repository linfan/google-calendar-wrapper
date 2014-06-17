var fs = require('fs'),
    path = require('path'),
    util = require('../lib/utility').Utility,
    OAuth = require('../lib/gapi').OAuth;

function EventsHandler() {

    var error_require_login = function(res) {
        res.json({
            status: 'ERROR',
            detail: 'User id specified already expired, please re-login.'
        });
    };

    var error_missing_uid = function(res) {
        res.json({
            status: 'ERROR',
            detail: 'Missing user-id in request URL, should specify as events/list?user=<id>'
        });
    };

    var get_events_list = function(res, token) {
        OAuth.get_oauth_client(JSON.parse(token), function(client, oauth2Client) {
            client.calendar.events.list({
                calendarId: 'primary',
                maxResults: 5,
                //timeMin: min_time,
                orderBy: 'startTime',
                singleEvents: true
            })
                .withAuthClient(oauth2Client)
                .execute(function(err, calendar) {
                    if (err) {
                        util.log(err);
                        error_require_login(res);
                    } else {
                        res.json(calendar);
                    }
                });
        });
    };

    this.list = function(req, res) {
        uid = req.param('user');
        if (uid) {
            util.log('using uid: ' + uid);
            fs.readFile(path.resolve(__dirname, 'credentials-' + uid + '.dat'), 'utf8', function (err, token) {
                if (err) {
                    error_require_login(res);
                } else {
                    get_events_list(res, token);
                }
            });
        } else {
            error_missing_uid(res);
        }
    };

}

exports.EventsHandler = EventsHandler;