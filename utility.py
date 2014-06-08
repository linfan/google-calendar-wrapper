import re
from oauth import OAuthHandler


class Utility:

    def __init__(self):
        client_info = OAuthHandler.ins().get_client_info()
        self._hostname = re.match('http[s]?://([^:/]+)[:/].*', client_info['redirect_uris'][0]).group(1)
        self._port = re.match('http[s]?://[^:/]+:([0-9]+)/.*', client_info['redirect_uris'][0]).group(1)
        if not self._port:
            self._port = '80'

    @classmethod
    def ins(cls):
        if not hasattr(cls, '_instance'):
            cls._instance = cls()
        return cls._instance

    def hostname(self):
        return self._hostname

    def port(self):
        return self._port