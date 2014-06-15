var express = require('express'),
    app = express(),
    http = require('http'),
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
    
});

app.get('/login', function(req, res) {
    OAuth.get_oauth_url(function(oauth_rul) {
      var locals = {
            title: 'This is my sample app',
            url: oauth_rul
        };
        res.render('index.jade', locals);
    });
});

app.get('/oauth2callback', function(req, res) {
    var code = req.query.code;
    console.log('oauth code: ' + code);
    OAuth.get_oauth_token(code, function(err, tokens){
        console.log(tokens);
        var locals = {
            title: 'What are you doing with yours?'
        };
        res.render('index.jade', locals);
    });
});

var server = app.listen(9999);

console.log('Express server started on port %s', server.address().port);