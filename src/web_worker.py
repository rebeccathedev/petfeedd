from flask import Flask
from flask import render_template

app = Flask(__name__)

def web_worker():
    @app.route('/')
    def index():
        return render_template('index.html')

    app.run("localhost", 8080)
