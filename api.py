#!/usr/bin/env python
import os
import json

import logging
import httplib2
import webapp2
import jinja2
from apiclient import discovery
import StringIO

from apiclient.discovery import build
from google.appengine.api import memcache
from google.appengine.api import users
from oauth2client.client import AccessTokenRefreshError

from oauth import OAuthHandler


class MainHandler(webapp2.RequestHandler):

    def get(self):
        self.response.write('{<br>status: ERROR<br>detail: Invalid request address<br>}')


class LoginHandler(webapp2.RequestHandler):

    def get(self):
        user_id = self.request.get('user')
        logging.debug('>> Login using: ' + user_id)
        if user_id:
            credentials = OAuthHandler.ins().get_credentials(user_id)
            if credentials is None or credentials.invalid:
                OAuthHandler.ins().respond_redirect_to_auth_server(self.response, user_id)
            else:
                self.response.write('{<br>status: OK<br>}')
        else:
            self.response.write('{<br>status: ERROR<br>detail: User entered URL should look like: http://the-1.info:9999/login?user=fanlin<br>}')


class EventListHanlder(webapp2.RequestHandler):

    def get_calendar_data(self, credentials):
        """Given the credentials, returns calendar data."""
        output = StringIO.StringIO()
        http = httplib2.Http()
        http = credentials.authorize(http)
        service = build('calendar', 'v3', http=http)
        request = service.events().list(calendarId='primary')
        while request is not None:
            response = request.execute()
            for event in response.get('items', []):
                output.write(repr(event.get('summary', 'NO SUMMARY')) + '\n')
            request = service.events().list_next(request, response)
        return output.getvalue()

    def respond_calendar_data(self, response, text):
        """Responds to the current request by writing calendar data to stream."""
        response.status_int = 200
        response.headers.add('Cache-Control', 'no-cache')
        response.headers.add('Content-type', 'text/plain')
        response.write(text)

    def get(self):
        user_id = self.request.get('user')
        credentials = OAuthHandler.ins().get_credentials(user_id)
        if credentials is None or credentials.invalid:
            OAuthHandler.ins().respond_redirect_to_auth_server(self.response, user_id)
        try:
            calendar_output = self.get_calendar_data(credentials)
            self.respond_calendar_data(self.response, calendar_output)
        except AccessTokenRefreshError:
            self.respond_redirect_to_auth_server(self.response, user_id)


class OAuthCallbackHandler(webapp2.RequestHandler):

    def get_fake_user_from_cookie(self, request):
        """Get the user_id from cookies."""
        user_id = request.cookies.get('user_id')
        logging.debug('>> User ID from cookie: %s' % user_id)
        return user_id

    def get(self):
        code = self.request.get('code')
        user_id = self.get_fake_user_from_cookie(self.request)
        OAuthHandler.ins().respond_save_credential(user_id, code)

