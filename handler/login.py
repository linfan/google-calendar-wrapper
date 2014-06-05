from bottle import route, request, response
from oauth import OAuthHandler

@route('/login')
def login_handler():
    user_id = request.query.user
    print('>> Login using: ' + user_id)
    if user_id:
        credentials = OAuthHandler.ins().get_credentials(user_id)
        if credentials is None or credentials.invalid:
            OAuthHandler.ins().respond_redirect_to_auth_server(response, user_id)
        else:
            return '{<br>status: OK<br>}'
    else:
        return '{<br>status: ERROR<br>detail: User entered URL should look like: http://the-1.info:9999/login?user=fanlin<br>}'

@route('/oauth2callback')
def oauth_callback_handler():
    code = request.query.code
    user_id = request.get_cookie('user_id')
    print('>> User ID from cookie: %s' % user_id)
    OAuthHandler.ins().respond_save_credential(user_id, code)
    return '{<br>action: login<br>status: OK<br>}'
