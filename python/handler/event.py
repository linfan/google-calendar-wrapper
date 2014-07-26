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
    http = httplib2.Http()
    http = credentials.authorize(http)
    service = build('calendar', 'v3', http=http)
    min_time = re.sub(r'\.[0-9]*$', '+08:00', datetime.isoformat(datetime.now()))
    print('>> Min-time: %s' % min_time)
    http_request = service.events().list(
            calendarId='primary',
            maxResults=2,
            timeMin=min_time,
            orderBy='startTime',
            singleEvents=True)

    res = { 'status': 'OK', 'events': [] }

    http_response = http_request.execute()
    for event in http_response.get('items', []):
        item = {
                'summary': event['summary'],
                'organizer': event['organizer']['displayName'],
                'location': 'location' in event and event['location'] or 'N/A',
                'start': 'dateTime' in event['start'] and event['start']['dateTime'] or event['start']['date']+'T00:00:00+08:00',
                'end': 'dateTime' in event['end'] and event['end']['dateTime'] or event['end']['date']+'T23:59:59+08:00'
            }
        res['events'].append(item)

    return res

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
        response.set_header('Content-type', 'application/json')
        return calendar_output
    except AccessTokenRefreshError:
        response.content_type = 'application/json'
        return {
            'status': 'ERROR',
            'detail': 'Credential expired, please re-login'
        }
