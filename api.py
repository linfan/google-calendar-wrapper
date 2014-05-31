#!/usr/bin/env python
import os
import json

import httplib2
import webapp2
import jinja2
from apiclient import discovery
from google.appengine.api import memcache

import oauth

http = httplib2.Http(memcache)
service = discovery.build('calendar', 'v3', http=http)

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    autoescape=True,
    extensions=['jinja2.ext.autoescape'])
class MainHandler(webapp2.RequestHandler):
  @oauth.decorator.oauth_aware
  def get(self):
    variables = {
        'url': oauth.decorator.authorize_url(),
        'has_credentials': oauth.decorator.has_credentials()
        }
    template = JINJA_ENVIRONMENT.get_template('main.html')
    self.response.write(template.render(variables))

class LoginHandler(webapp2.RequestHandler):
  @oauth.decorator.oauth_aware
  def get(self):
    if oauth.decorator.has_credentials():
        self.response.write('{<br>status: ok<br>}')
    else:
    print('Authorize_url: ' + oauth.decorator.authorize_url())
    self.response.write('{<br>url: ' + oauth.decorator.authorize_url() + '<br>}')

class EventListHanlder(webapp2.RequestHandler):
    def get(self):
        page_token = None
        res = 'Event list:<br>'
        while True:
            events = service.events().list(calendarId='primary', pageToken=page_token).execute()
            for event in events['items']:
                res += (event['summary'] + '<br>')
            page_token = events.get('nextPageToken')
            if not page_token:
                self.response.write(res)
                break
