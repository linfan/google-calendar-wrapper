import os

from oauth2client import appengine

CLIENT_SECRETS = os.path.join(os.path.dirname(__file__), 'client_secrets.json')
MISSING_CLIENT_SECRETS_MESSAGE = "<h1>Error: Please configure OAuth 2.0</h1>"

decorator = appengine.oauth2decorator_from_clientsecrets(
    CLIENT_SECRETS,
    scope=['https://www.googleapis.com/auth/calendar.readonly'],
    message=MISSING_CLIENT_SECRETS_MESSAGE)
