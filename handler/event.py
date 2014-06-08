import json
import StringIO
import httplib2
import re
from bottle import route, request, response
from oauth2client.client import AccessTokenRefreshError
from apiclient.discovery import build
from oauth import OAuthHandler
from datetime import datetime
from utility import Utility

def get_calendar_data(credentials):
    """Given the credentials, returns calendar data."""
    output = StringIO.StringIO()
    http = httplib2.Http()
    http = credentials.authorize(http)
    service = build('calendar', 'v3', http=http)
    min_time = re.sub(r'\.[0-9]*$', '+08:00', datetime.isoformat(datetime.now()))
    print('>> Min-time: %s' % min_time)
    http_request = service.events().list(calendarId='primary', timeMin=min_time, orderBy="startTime", singleEvents=True)

    while http_request is not None:
        http_response = http_request.execute()
        for event in http_response.get('items', []):
            output.write(repr(event['start']) + '\n')
            output.write(repr(event['summary']) + '\n')
            print event['start']
            print event['summary']
        http_request = service.events().list_next(http_request, http_response)

    return output.getvalue()

@route('/event/list')
def event_list_handler():
    user_id = request.query.user
    credentials = OAuthHandler.ins().get_credentials(user_id)
    if credentials is None or credentials.invalid:
        return {
            'status': 'ERROR',
            'detail': 'User id not exist, URL should look like: http://%s:%s/event/list?user=123'
                      % (Utility.ins().hostname(), Utility.ins().port())
        }
    try:
        calendar_output = get_calendar_data(credentials)
        response.set_header('Cache-Control', 'no-cache')
        response.set_header('Content-type', 'text/plain')
        return calendar_output
    except AccessTokenRefreshError:
        response.content_type = 'text/plain'
        return {
            'status': 'ERROR',
            'detail': 'Credential expired, please re-login'
        }
