#!/usr/bin/env python

import httplib2
import webapp2

from apiclient import discovery
from google.appengine.api import memcache

import oauth

http = httplib2.Http(memcache)
service = discovery.build('calendar', 'v3', http=http)

class MainHandler(webapp2.RequestHandler):

  @oauth.decorator.oauth_aware
  def get(self):
    variables = {
        'url': oauth.decorator.authorize_url(),
        'has_credentials': oauth.decorator.has_credentials()
        }
    template = oauth.JINJA_ENVIRONMENT.get_template('main.html')
    self.response.write(template.render(variables))
