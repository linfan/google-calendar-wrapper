var express = require('express'),
    app = express(),
    http = require('http'),
    fs = require('fs'),
    path = require('path'),
    OAuth = require('./lib/gapi').OAuth;

app.configure('development', function() {
    app.use(express.errorHandler());
});
app.configure(function() {
    app.set('port', process.env.PORT || 9999);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(app.router);
});

app.get('/', function(req, res) {
    res.json({
        status: 'OK',
        detail: 'Nothing to show on this page'
    });
});

app.get('/login', function(req, res) {
    uid = req.param('user');
    if (uid) {
        console.log('using uid: ' + uid);
        fs.readFile(path.resolve(__dirname, 'credentials-' + uid + '.dat'), 'utf8', function (err, data) {
            if (err) {
                OAuth.get_oauth_url(function(oauth_rul) {
                    res.json({
                        status: 'REDIRECT',
                        redirect: oauth_rul
                    });
                });
            } else {
                res.json({
                    status: 'OK',
                    detail: 'Already logined'
                });
            }
        });
    } else {
        res.json({
            status: 'ERROR',
            detail: 'Missing user-id in request URL, should specify as login?user=<id>'
        });
    }
});

app.get('/oauth2callback', function(req, res) {
    var code = req.query.code;
    console.log('oauth code: ' + code);
    OAuth.get_oauth_token(code, function(err, tokens){
        if (err) {
            res.json({
                status: 'ERROR',
                detail: JSON.stringify(err)
            });
        } else {
            fs.writeFile(path.resolve(__dirname, 'credentials-' + uid + '.dat'), JSON.stringify(tokens), 'utf8', function (err, data) {
                console.log(tokens);
                res.json({
                    status: 'OK',
                    detail: 'Login succeed'
                });       
            });
        }
    });
});

app.get('/events/list', function(req, res) {
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
});

var server = app.listen(9999);

console.log('Express server started on port %s', server.address().port);

