import json
import datetime
import urllib.request
import petfeedd
import logging
from time import mktime

from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify

from worker import Worker
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

# Create our web worker class.
class WebWorker(Worker):

    # Initializes the class.
    def __init__(self, feed_queue, config, *args, **kwargs):
        self.app = CustomFlask(__name__)
        self.feed_queue = feed_queue
        self.config = config
        super().__init__(*args, **kwargs)

    # Run when the thread is started.
    def run(self):
        logging.getLogger('petfeedd').info("Starting web worker.")

        # The main route returns the index page. Everything else is handled by the
        # API and Vue.js.
        @self.app.route('/')
        def index():
            return render_template('index.html')

        @self.app.route('/api/events', methods=['GET'])
        def events():
            return self.get_events()

        # A route that gets or updates settings.
        @self.app.route('/api/settings', methods=['GET', 'POST'])
        def settings():
            if request.method == 'GET':
                return self.get_settings()
            else:
                return self.post_settings()

        # A route that gets all feeds. In RESTful fashion, posting to this endpoint
        # creates a new feed entry.
        @self.app.route('/api/feeds', methods=['GET', 'POST'])
        def feeds():
            if request.method == 'GET':
                return self.get_feeds()
            else:
                return self.post_feeds()

        # A route that gets/updates/deletes feeds.
        @self.app.route('/api/feeds/<int:feed_id>', methods=['GET', 'POST', 'DELETE'])
        def feed(feed_id):
            if request.method == 'GET':
                return self.get_feed(feed_id)
            elif request.method == 'DELETE':
                return self.delete_feed(feed_id)
            else:
                return self.post_feed(feed_id)

        # A route that pushes an immediate feed into the stack.
        @self.app.route('/api/feed', methods=['POST'])
        def feed_now():
            feed_event = FeedEvent.create(size=1, name="On Demand")
            self.feed_queue.put(feed_event)
            return jsonify(True)

        # A route that pauses feeding.
        @self.app.route('/api/pause', methods=['POST'])
        def pause():
            logging.getLogger('petfeedd').info("Pausing feeding.")
            petfeedd.feeding_semaphore = False
            return jsonify(True)

        # A route that starts feeding.
        @self.app.route('/api/start', methods=['POST'])
        def start():
            logging.getLogger('petfeedd').info("Starting feeding.")
            petfeedd.feeding_semaphore = True
            return jsonify(True)

        # A route to get status.
        @self.app.route('/api/status', methods=['GET'])
        def status():
            return self.get_status()

        # A special endpoint that shuts down the server
        @self.app.route('/api/shutdown')
        def shutdown():
            # Only process this if it originated from us.
            if request.environ["REMOTE_ADDR"] == "127.0.0.1":
                logging.getLogger('petfeedd').info("Stopping web worker.")
                func = request.environ.get('werkzeug.server.shutdown')
                func()

            return jsonify(True)

        # Start the built-in Flask server.
        self.app.run(self.config["web"]["bind_address"], self.config["web"]["bind_port"])

    # Overrides the end method to shut down the thread gracefully.
    def end(self):
        # HAX.
        urllib.request.urlopen("http://" + self.config["web"]["bind_address"] + ":" + self.config["web"]["bind_port"] + "/api/shutdown").read()
        return super(WebWorker, self).end()

    # Gets feed events.
    def get_events(self):
        feed_events = []
        for feed_event in FeedEvent.select().order_by(FeedEvent.date_created.desc()).limit(50).dicts():
            feed_events.append(feed_event)

        return json.dumps(feed_events, cls=MyEncoder)

    # This function gets all settings.
    def get_settings(self):
        settings = {}
        for setting in Setting.select():
            settings[setting.key] = setting.value

        return jsonify(settings)

    # This function updates settings.
    def post_settings(self):
        return self.get_settings()

    # This function gets all feeds.
    def get_feeds(self):
        feeds = []
        for feed in Feed.select().dicts():
            feeds.append(feed)

        return json.dumps(feeds, cls=MyEncoder)

    # This function creates a new feed.
    def post_feeds(self):
        data = request.get_json(force=True)
        Feed.create(time=data["time"], name=data["name"], size=data["size"], last_feed=data["last_feed"], feed_count=data["feed_count"])
        return self.get_feeds()

    # This function gets a specific feed.
    def get_feed(self, feed_id):
        feed = Feed.select().where(Feed.id == feed_id).get()
        if feed:
            return json.dumps(feed.dict(), cls=MyEncoder)

        return "{}"

    # This function updates a specific feed.
    def post_feed(self, feed_id):
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
    def delete_feed(self, feed_id):
        feed = Feed.select().where(Feed.id == feed_id).get()
        if feed:
            feed.delete_instance()

        return self.get_feeds()

    # This function returns the status of the feeder.
    def get_status(self):
        settings = {
            'feeding': petfeedd.feeding_semaphore,
            'name': self.config["general"]["name"]
        }

        return json.dumps(settings)
