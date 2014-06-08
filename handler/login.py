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
            return '''{
    status: OK,
    detail: Already login
}'''
    else:
        response.content_type = 'text/plain'
        return '''{
    status: ERROR,
    detail: User entered URL should look like: http://%s:9999/login?user=123
}''' % Utility.ins().hostname()

@route('/oauth2callback')
def oauth_callback_handler():
    code = request.query.code
    OAuthHandler.ins().respond_save_credential(code)
    response.content_type = 'text/plain'
    return '''{
    status: OK
    detail:
}'''
