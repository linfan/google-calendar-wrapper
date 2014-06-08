#!/usr/bin/env python

import sys, os
from bottle import run
from utility import Utility

sys.path.append(os.sep.join((os.getcwd(),'handler')))
import root
import login
import event

hostname = Utility.ins().hostname()
if hostname != '':
    run(host=hostname, port=9999, debug=True)
else:
    print(">> ERROR: client_secrets.json file incorrect!")