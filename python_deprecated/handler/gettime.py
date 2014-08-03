import re
from bottle import route, request, response
from datetime import datetime
from utility import Utility

@route('/time')
def get_current_time():
    cur_time = re.sub(r'\.[0-9]*$', '+08:00', datetime.isoformat(datetime.now()))
    print('>> current-time: %s' % cur_time)

    response.set_header('Cache-Control', 'no-cache')
    response.content_type = 'application/json'
    return { 'status': 'OK', 'time': cur_time }
