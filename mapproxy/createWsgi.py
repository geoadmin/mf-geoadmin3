# -*- coding: utf-8 -*-

import sys
import os.path
import glob
import grp

WRAPPER_TEMPLATE = """\
# This is a generated file. It will be overwritten by the next buildout command.

import sys
import os.path

syspaths = [
       %(syspath)s,
]

for path in reversed(syspaths):
   if path not in sys.path:
         sys.path[0:0]=[path]


from paste.deploy import loadapp
from webob import Request

class NoContentMiddleware(object):
    "Turns 'The requested tile is outside the bounding box of the tile map' error into no 204 No Content"
    def __init__(self, app):
        self.app = app
    def __call__(self, environ, start_response):
        req = Request(environ)
        resp = req.get_response(self.app)
        if resp.status_code == 400 and resp.content_type == 'text/xml':
            resp.status = 204  # No content

        return resp(environ, start_response)



# If you want to debug, uncomment the following lines
#from paste.script.util.logging_config import fileConfig
#fileConfig(r'%(log_config)s', {'here': os.path.dirname(__file__)})


from mapproxy.wsgiapp import make_wsgi_app
configfile="%(config)s"
application = make_wsgi_app(configfile)

# Comment, if you want to deactivate the NoContentMiddleware
application = NoContentMiddleware(application)

"""


__here__ = os.path.abspath(os.path.dirname(__file__))
buildout_dir = os.path.dirname(__here__)
eggs_dir = os.path.join(buildout_dir, 'buildout/eggs')

syspaths = [eggs_dir]
syspaths.extend(glob.glob(eggs_dir + '/*.egg'))

output = WRAPPER_TEMPLATE % dict(
    config=os.path.join(buildout_dir, 'mapproxy/mapproxy.yaml'),
    syspath=",\n    ".join((repr(p) for p in syspaths)),
    log_config=os.path.join(buildout_dir, 'mapproxy/log.ini')
)

location = os.path.abspath(os.path.join(buildout_dir, 'buildout/parts/mapproxy'))

if not os.path.exists(location):
    os.mkdir(location)
target = os.path.join(location, "wsgi")
print target
try:
    f = open(target, "wt")
    f.write(output)
    f.close()
    os.chmod(target, 0o755)
except:
    pass
