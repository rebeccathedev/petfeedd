import threading
import configparser

from peewee import *
from playhouse.sqlite_ext import SqliteExtDatabase
import queue

from feed_worker import FeedWorker
from time_worker import TimeWorker
from web_worker import web_worker

from models.Setting import Setting
from models.Feed import Feed
from models.FeedEvent import FeedEvent

db = SqliteExtDatabase('petfeedd.db')
db.connect()
db.create_tables([Setting, Feed, FeedEvent], safe=True)

feed_queue = queue.Queue()

web_worker_thread = threading.Thread(target=web_worker, args=(feed_queue,))
web_worker_thread.start()

FeedWorker(feed_queue).start()
TimeWorker(feed_queue).start()
# feed_worker_thread.start()
