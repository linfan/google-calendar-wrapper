from bottle import route, request, response
from utility import Utility

@route('/')
def main_handler():
    response.content_type = 'text/plain'
    return {
        'status': 'OK',
        'detail': 'Nothing to show on this page, try http://%s:%s/login'
                      % (Utility.ins().hostname(), Utility.ins().port())
    }