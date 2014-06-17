function EventsHandler() {

    this.list = function(req, res) {
        uid = req.param('user');
        if (uid) {
            console.log('using uid: ' + uid);
            fs.readFile(path.resolve(__dirname, 'credentials-' + uid + '.dat'), 'utf8', function (err, token) {
                if (err) {
                    OAuth.get_oauth_url(function(oauth_rul) {
                        res.json({
                            status: 'REDIRECT',
                            redirect: oauth_rul
                        });
                    });
                } else {
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
                                console.log(err);
                                OAuth.get_oauth_url(function(oauth_rul) {
                                    res.json({
                                        status: 'REDIRECT',
                                        redirect: oauth_rul
                                    });
                                });
                            } else {
                                res.json(calendar);
                            }
                        });
                    });
                }
            });
        } else {
            res.json({
                status: 'ERROR',
                detail: 'Missing user-id in request URL, should specify as events/list?user=<id>'
            });
        }
    }

}

exports.EventsHandler = EventsHandler;