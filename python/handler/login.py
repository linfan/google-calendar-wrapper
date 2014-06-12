from bottle import route, request, response
from oauth import OAuthHandler
from utility import Utility

@route('/login')
def login_handler():
    user_id = request.query.user
    print('>> Login using: ' + user_id)
    if user_id:
        credentials = OAuthHandler.ins().get_credentials(user_id)
        if credentials is None or credentials.invalid:
            OAuthHandler.ins().respond_redirect_to_auth_server(response, user_id)
        else:
            response.content_type = 'text/plain'
            return {
                'status': 'OK',
                'detail': 'Already logined'
            }
    else:
        response.content_type = 'text/plain'
        return {
            'status': 'ERROR',
            'detail': 'Missing user id, URL should look like: http://%s:%s/login?user=123'
                      % (Utility.ins().hostname(), Utility.ins().port())
        }

@route('/oauth2callback')
def oauth_callback_handler():
    code = request.query.code
    OAuthHandler.ins().respond_save_credential(request, code)
    response.content_type = 'text/plain'
    return {
        'status': 'OK',
        'detail': 'Login succeed'
    }
