var express = require('express'),
    app = express();

var PORT = 9999;
app.configure(function() {
    app.set('port', PORT);
    app.use(express.logger('dev'));
    app.use(express.errorHandler());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(app.router);
});

// -- Add more handler here -->

var root = require('./modules/root/handler/get').RootHandler;
app.get('/', root.index);

var time_get = require('./modules/time/handler/get').TimeHandler;
app.get('/time/get', time_get.index);

var google_calendar_login = require('./modules/google_calendar/handler/login').LoginHandler,
    google_calendar_events = require('./modules/google_calendar/handler/events').EventsHandler;
app.get('/google_calendar/login', google_calendar_login.index);
app.get('/google_calendar/oauth2callback', google_calendar_login.oauth2callback);
app.get('/google_calendar/event_list', google_calendar_events.list);

// <-- Add more handler here --

var server = app.listen(PORT);
var util = require('./modules/public/lib/utility').Utility;
if (server.address() == null) {
    util.log('There another application using port "' + PORT + '", cannot start up.');
} else {
    util.log('Express server started on port ' + server.address().port);
}
