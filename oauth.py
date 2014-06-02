import os
import json
import logging

from oauth2client import appengine
from oauth2client.client import AccessTokenRefreshError
from oauth2client.client import OAuth2WebServerFlow
from oauth2client.file import Storage

class OAuthHandler:

    def __init__(self):
        client_info = self.get_client_info()
        self.flow = OAuth2WebServerFlow(client_info['client_id'],
                                 client_info['client_secret'],
                                 'https://www.googleapis.com/auth/calendar',
                                 redirect_uri=client_info['redirect_uris'][0])

    @classmethod
    def ins(cls):
        if not hasattr(cls, '_instance'):
            cls._instance = cls()
        return cls._instance

    def get_client_info(self):
        client_info_file = os.path.join(os.path.dirname(__file__), 'client_secrets.json')
        with open(client_info_file, 'r') as f:
            client_info = json.loads(f.read())
            return client_info['web']

    def get_credentials(self, user_id):
        """Using the user id as a key, retrieve the credentials."""
        storage = Storage('credentials-%s.dat' % (user_id))
        return storage.get()

    def respond_redirect_to_auth_server(self, response, user_id):
        """Respond to the current request by redirecting to the auth server."""
        uri = self.flow.step1_get_authorize_url()

        logging.debug('>> Redirecting to %s' % uri)
        response.status_int = 301
        response.headers.add('Cache-Control', 'no-cache')
        response.headers.add('Location', uri)
        response.set_cookie('user_id', user_id)

    def save_credentials(self, user_id, credentials):
        """Using the fake user name as a key, save the credentials."""
        storage = Storage('credentials-%s.dat' % (user_id))
        logging.debug('>> Credentials: %s' % credentials)
        storage.put(credentials)

    def respond_save_credential(self, user_id, code):
        """Respond to the return code of first step OAuth authorisation"""
        credentials = self.flow.step2_exchange(code)
        self.save_credentials(user_id, credentials)

