var express = require('express'),
    app = express(),
    util = require('./lib/utility').Utility,
    Root = require('./handler/root').RootHandler,
    Login = require('./handler/login').LoginHandler,
    Events = require('./handler/events').EventsHandler;

var PORT = 9999,
    root = new Root,
    login = new Login,
    events = new Events;

app.configure(function() {
    app.set('port', PORT);
    app.use(express.logger('dev'));
    app.use(express.errorHandler());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(app.router);
});

app.get('/', root.index);
app.get('/login', login.index);
app.get('/oauth2callback', login.oauth2callback);
app.get('/events/list', events.list);

var server = app.listen(PORT);
if (server.address() == null) {
    util.log('There another application using port "' + PORT + '", cannot start up.');
} else {
    util.log('Express server started on port ' + server.address().port);
}