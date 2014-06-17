function LoginHandler() {

    this.index = function(req, res) {
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
    }

    this.oauth2callback = function(req, res) {
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
    }
}

exports.LoginHandler = LoginHandler;