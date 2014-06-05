#!/usr/bin/env python
import os
import json

import StringIO
from bottle import route, request, response
import httplib2
from oauth2client.client import AccessTokenRefreshError

from apiclient.discovery import build

from oauth import OAuthHandler

@route('/')
def main_handler():
    return '{<br>status: ERROR<br>detail: Invalid request address<br>}'

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

@route('/event/list')
def event_list_handler():
    user_id = request.query.user
    credentials = OAuthHandler.ins().get_credentials(user_id)
    if credentials is None or credentials.invalid:
        OAuthHandler.ins().respond_redirect_to_auth_server(response, user_id)
    try:
        calendar_output = get_calendar_data(credentials)
        response.set_header('Cache-Control', 'no-cache')
        response.set_header('Content-type', 'text/plain')
        return calendar_output
    except AccessTokenRefreshError:
        OAuthHandler.ins().respond_redirect_to_auth_server(response, user_id)

def get_calendar_data(credentials):
    """Given the credentials, returns calendar data."""
    output = StringIO.StringIO()
    http = httplib2.Http()
    http = credentials.authorize(http)
    service = build('calendar', 'v3', http=http)
    http_request = service.events().list(calendarId='primary')
    while http_request is not None:
        http_response = http_request.execute()
        for event in http_response.get('items', []):
            output.write(repr(event.get('summary', 'NO SUMMARY')) + '\n')
        http_request = service.events().list_next(http_request, http_response)
    return output.getvalue()
