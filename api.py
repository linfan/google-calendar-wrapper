#!/usr/bin/env python

import httplib2
import logging
import os

from apiclient import discovery
from oauth2client import appengine
from oauth2client import client
from google.appengine.api import memcache

import webapp2
import jinja2

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
    template = JINJA_ENVIRONMENT.get_template('main.html')
    self.response.write(template.render(variables))
