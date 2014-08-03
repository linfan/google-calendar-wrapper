var fs = require('fs'),
    path = require('path'),
    util = require('../lib/utility').Utility,
    OAuth = require('../lib/gapi').OAuth,
    dateFormat = require('../lib/dateFormat');

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

    var send_event_struct = function(res, calendar) {
        var resDatas = { status: 'OK' };
        var events = [];
        var eventCount = calendar["items"].length;
        for (i=0; i<eventCount; i++) {
            events[i] = { summary: calendar["items"][i]["summary"],
                        organizer: calendar["items"][i]["organizer"]["displayName"],
                        location: calendar["items"][i]["location"],
                        start: calendar["items"][i]["start"]["dateTime"],
                        end: calendar["items"][i]["end"]["dateTime"]
            };
            if (!events[i]["location"]) {
                events[i]["location"] = "N/A";
            }
        }
        resDatas["events"] = events;
        this.lazyData = resDatas;
        res.json(resDatas);
    }

    var get_events_list = function(res, token) {
        OAuth.get_oauth_client(JSON.parse(token), function(client, oauth2Client) {
            var now = new Date();
            var min_time = now.format("isoDateTime") + "+08:00";
            util.log("Min time: " + min_time);
            client.calendar.events.list({
                calendarId: 'primary',
                maxResults: 2,
                timeMin: min_time,
                orderBy: 'startTime',
                singleEvents: true
            })
                .withAuthClient(oauth2Client)
                .execute(function(err, calendar) {
                    if (err) {
                        util.log(err);
                        error_require_login(res);
                    } else {
                        send_event_struct(res, calendar);
                    }
                });
        });
    };

    this.list = function(req, res) {
        uid = req.param('user');
        lazy_mode = req.param('lazy');
        if (lazy_mode && this.lazyData)
        {
            util.log('using lazy mode :P');
            res.json(this.lazyData);
        }
        else if (uid) {
            util.log('using uid: ' + uid);
            fs.readFile(path.resolve(__dirname, '../credentials/' + uid + '.dat'), 'utf8', function (err, token) {
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
