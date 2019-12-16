import re
from datetime import datetime

from flask import Flask, render_template
from flask.helpers import send_from_directory, make_response
from flask_static_digest import FlaskStaticDigest
from flask.json import jsonify

import os;

flask_static_digest = FlaskStaticDigest()
app = Flask(__name__, template_folder='views', static_folder='dist')
flask_static_digest.init_app(app)

print('-------- APP RUN ---------------')

@app.route('/static/<path:path>')
def staticFiles(path):
    return send_from_directory('static', path)

@app.route("/", defaults={'path': ''})
@app.route('/<path:path>')
def home(path):
    return render_template('home.html')

app.run(host='0.0.0.0')