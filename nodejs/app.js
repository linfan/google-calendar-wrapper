var express = require('express'),
    app = express(),
    util = require('./lib/utility').Utility,
    root = new require('./handler/root').RootHandler,
    login = new require('./handler/login').LoginHandler,
    events = new require('./handler/events').EventsHandler;

process.env.PORT = 9999;

app.configure('development', function() {
    app.use(express.errorHandler());
});
app.configure(function() {
    app.set('port', process.env.PORT);
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(app.router);
});

app.get('/', root.index);
app.get('/login', login.index);
app.get('/oauth2callback', login.oauth2callback);
app.get('/events/list', events.list);

var server = app.listen(process.env.PORT);
util.log('Express server started on port %s', server.address().port);
