#!/usr/bin/env python

import re
import sys, os
from bottle import run
from oauth import OAuthHandler

sys.path.append(os.sep.join((os.getcwd(),'handler')))
import root
import login
import event

client_info = OAuthHandler.ins().get_client_info()
hostname = re.match('http[s]?://([^:/]+)[:/].*', client_info['redirect_uris'][0]).group(1)
if hostname:
    run(host=hostname, port=9999, debug=True)
else:
    print(">> ERROR: client_secrets.json file incorrect!")