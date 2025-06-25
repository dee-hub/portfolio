import os
import sys

# If your app lives in a subdirectory, adjust this:
project_home = os.path.dirname(__file__)
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Import your Flask app as "application" for WSGI
from app import app as application

# (Optional) set environment variables here
# os.environ['FLASK_ENV'] = 'production'
