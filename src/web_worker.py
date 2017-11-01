import json
import datetime
from time import mktime

from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify

from models.Setting import Setting
from models.Feed import Feed

# Because we're using vue.js on the front end and vue uses {{}} for it's
# templating, we need to create a custom Flask object that overrides jinja's
# use of {{}} with something else.
class CustomFlask(Flask):
    jinja_options = Flask.jinja_options.copy()
    jinja_options.update(dict(
        block_start_string='(%',
        block_end_string='%)',
        variable_start_string='((',
        variable_end_string='))',
        comment_start_string='(#',
        comment_end_string='#)',
    ))

# This is a custom JSON encoder that fixes Python's issue with encoding time
# objects.
class MyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.time):
            return obj.isoformat()

        return json.JSONEncoder.default(self, obj)

app = CustomFlask(__name__)

def web_worker():
    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/api/settings', methods=['GET', 'POST'])
    def settings():
        if request.method == 'GET':
            return get_settings()
        else:
            return post_settings()

    @app.route('/api/feeds', methods=['GET', 'POST'])
    def feeds():
        if request.method == 'GET':
            return get_feeds()
        else:
            return post_feeds()

    @app.route('/api/feeds/<int:feed_id>', methods=['GET', 'POST', 'DELETE'])
    def feed(feed_id):
        if request.method == 'GET':
            pass
        elif request.method == 'DELETE':
            return delete_feed(feed_id)
        else:
            return post_feed()

    app.run("127.0.0.1", 8080)

def get_settings():
    settings = {}
    for setting in Setting.select():
        settings[setting.key] = setting.value

    return jsonify(settings)

def post_settings():
    print(request.get_json())
    return get_settings()

def get_feeds():
    feeds = []
    for feed in Feed.select().dicts():
        feeds.append(feed)

    return json.dumps(feeds, cls=MyEncoder)

def post_feeds():
    data = request.get_json(force=True)
    Feed.create(time=data["time"], name=data["name"], size=data["size"], last_feed=data["last_feed"], feed_count=data["feed_count"])
    return get_feeds()

def get_feed():
    pass

def post_feed():
    data = request.get_json(force=True)
    feed = Feed.select().where(Feed.id == data["id"]).get()
    print(json.dumps(feed.dict(), cls=MyEncoder))
    if feed:
        feed.time = data["time"];
        feed.name = data["name"];
        feed.size = data["size"];
        feed.last_feed = data["last_feed"];
        feed.feed_count = data["feed_count"];
        feed.save()

    return json.dumps(feed.dict(), cls=MyEncoder)

def delete_feed(feed_id):
    feed = Feed.select().where(Feed.id == feed_id).get()
    if feed:
        feed.delete_instance()

    return get_feeds()
