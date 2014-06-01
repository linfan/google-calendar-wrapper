#!/usr/bin/env python
import os
import json

import logging
import httplib2
import webapp2
import jinja2
from apiclient import discovery
from google.appengine.api import memcache
from google.appengine.api import users

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

class LoginRedirectHandler(webapp2.RequestHandler):
#  @oauth.decorator.oauth_aware
  def get(self):
#    if oauth.decorator.has_credentials():
#        self.response.write('{<br>status: ok<br>}')
#    else:
#        logging.debug('>> Authorize URL: ' + oauth.decorator.authorize_url())
#        self.response.write('{<br>url: ' + oauth.decorator.authorize_url() + '<br>}')
    user = users.get_current_user()
    if user:
        greeting = ('Welcome, %s! (<a href="%s">sign out</a>)' % (user.nickname(), users.create_logout_url('/')))
    else:
        greeting = ('<a href="%s">Sign in or register</a>.' % users.create_login_url('/'))
    self.response.out.write('<html><body>%s</body></html>' % greeting)

class LoginHandler(webapp2.RequestHandler):
    def get(self):
        user = users.User("linfan.china@gmail.com")
        logging.debug('>> Auto-login..')
        self.redirect('/login_redirect')

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
