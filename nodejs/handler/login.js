var fs = require('fs'),
    path = require('path'),
    util = require('../lib/utility').Utility,
    OAuth = require('../lib/gapi').OAuth;

function LoginHandler() {

    var redirect_oauth_url = function(res) {
        OAuth.get_oauth_url(function(oauth_rul) {
            res.json({
                status: 'REDIRECT',
                redirect: oauth_rul
            });
        });
    };

    var login_succeed = function(res, info) {
        res.json({
            status: 'OK',
            detail: info
        });
    };

    var login_failed = function(res, info) {
        res.json({
            status: 'ERROR',
            detail: info
        });
    };

    var error_missing_uid = function(res) {
        res.json({
            status: 'ERROR',
            detail: 'Missing user-id in request URL, should specify as login?user=<id>'
        });
    };

    this.index = function(req, res) {
        uid = req.param('user');
        if (uid) {
            util.log('using uid: ' + uid);
            fs.readFile(path.resolve(__dirname, 'credentials-' + uid + '.dat'), 'utf8', function (err, data) {
                if (err) {
                    res.cookie('user_id', uid);
                    redirect_oauth_url(res);
                } else {
                    login_succeed(res, 'Already logined');
                }
            });
        } else {
            error_missing_uid(res);
        }
    };

    this.oauth2callback = function(req, res) {
        var code = req.query.code;
        util.log('oauth code: ' + code);
        OAuth.get_oauth_token(code, function(err, tokens){
            if (err) {
                login_failed(res, err)
            } else {
                util.log('Cookies: ');
                util.log(req.cookies);
                var uid = req.cookies.user_id;
                if (uid) {
                    fs.writeFile(path.resolve(__dirname, 'credentials-' + uid + '.dat'), JSON.stringify(tokens), 'utf8',
                        function (err, data) {
                            if (err) {
                                login_failed(res, err)
                            } else {
                                util.log(tokens);
                                login_succeed(res, 'Login succeed');
                            }
                        });
                } else {
                    login_failed(res, 'This page should be redirect from /login url')
                }
            }
        });
    };
}

exports.LoginHandler = LoginHandler;