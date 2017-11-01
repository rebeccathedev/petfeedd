import json
import datetime
from time import mktime

from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify

from models.Setting import Setting
from models.Feed import Feed
from models.FeedEvent import FeedEvent

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
        elif isinstance(obj, datetime.datetime):
            return obj.isoformat()

        return json.JSONEncoder.default(self, obj)

# Create an instance of our custom Flask object.
app = CustomFlask(__name__)

# Define the web worker. This is the function that is passed to the thread to
# start Flask.
def web_worker(feed_queue, config):

    print("Starting web worker.")

    # The main route returns the index page. Everything else is handled by the
    # API and Vue.js.
    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/api/events', methods=['GET'])
    def events():
        return get_events()

    # A route that gets or updates settings.
    @app.route('/api/settings', methods=['GET', 'POST'])
    def settings():
        if request.method == 'GET':
            return get_settings()
        else:
            return post_settings()

    # A route that gets all feeds. In RESTful fashion, posting to this endpoint
    # creates a new feed entry.
    @app.route('/api/feeds', methods=['GET', 'POST'])
    def feeds():
        if request.method == 'GET':
            return get_feeds()
        else:
            return post_feeds()

    # A route that gets/updates/deletes feeds.
    @app.route('/api/feeds/<int:feed_id>', methods=['GET', 'POST', 'DELETE'])
    def feed(feed_id):
        if request.method == 'GET':
            return get_feed(feed_id)
        elif request.method == 'DELETE':
            return delete_feed(feed_id)
        else:
            return post_feed(feed_id)

    # A route that pushes an immediate feed into the stack.
    @app.route('/api/feed', methods=['POST'])
    def feed_now():
        feed_event = FeedEvent.create(size=1, name="On Demand")
        feed_queue.put(feed_event)
        return jsonify(True)

    # Start the built-in Flask server.
    app.run(config["web"]["bind_address"], config["web"]["bind_port"])


# Gets feed events.
def get_events():
    feed_events = []
    for feed_event in FeedEvent.select().order_by(FeedEvent.date_created.desc()).limit(50).dicts():
        feed_events.append(feed_event)

    return json.dumps(feed_events, cls=MyEncoder)

# This function gets all settings.
def get_settings():
    settings = {}
    for setting in Setting.select():
        settings[setting.key] = setting.value

    return jsonify(settings)

# This function updates settings.
def post_settings():
    print(request.get_json())
    return get_settings()

# This function gets all feeds.
def get_feeds():
    feeds = []
    for feed in Feed.select().dicts():
        feeds.append(feed)

    return json.dumps(feeds, cls=MyEncoder)

# This function creates a new feed.
def post_feeds():
    data = request.get_json(force=True)
    Feed.create(time=data["time"], name=data["name"], size=data["size"], last_feed=data["last_feed"], feed_count=data["feed_count"])
    return get_feeds()

# This function gets a specific feed.
def get_feed(feed_id):
    feed = Feed.select().where(Feed.id == feed_id).get()
    if feed:
        return json.dumps(feed.dict(), cls=MyEncoder)

    return "{}"

# This function updates a specific feed.
def post_feed(feed_id):
    data = request.get_json(force=True)
    feed = Feed.select().where(Feed.id == data["id"]).get()
    if feed:
        feed.time = data["time"];
        feed.name = data["name"];
        feed.size = data["size"];
        feed.last_feed = data["last_feed"];
        feed.feed_count = data["feed_count"];
        feed.save()

    return json.dumps(feed.dict(), cls=MyEncoder)

# This function deletes a specific feed.
def delete_feed(feed_id):
    feed = Feed.select().where(Feed.id == feed_id).get()
    if feed:
        feed.delete_instance()

    return get_feeds()
