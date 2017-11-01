import threading
import configparser

from peewee import *
from playhouse.sqlite_ext import SqliteExtDatabase

from feed_worker import feed_worker
from web_worker import web_worker
from models.Setting import Setting
from models.Feed import Feed

db = SqliteExtDatabase('petfeedd.db')
db.connect()
db.create_tables([Setting, Feed], safe=True)

web_worker_thread = threading.Thread(target=web_worker)
web_worker_thread.start()

feed_worker_thread = threading.Thread(target=feed_worker)
feed_worker_thread.start()
