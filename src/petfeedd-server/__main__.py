# Imports from the standard library.
import threading
import logging
import configparser
import argparse
import signal
import queue
import sys
import os

# Import Peewee ORM so that we an build the tables.
from peewee import *
from playhouse.sqlite_ext import SqliteExtDatabase

# Makes config parsing a bit easier
from distutils.util import strtobool

# Import all the worker threads.
from time_worker import TimeWorker
from discovery_worker import DiscoveryWorker
from web_worker import WebWorker
from notification_worker import NotificationWorker
from feed_worker import FeedWorker

# Import all the models.
from models.Setting import Setting
from models.Feed import Feed
from models.FeedEvent import FeedEvent

import petfeedd

# Configure argument parsing and parse arguments.
parser = argparse.ArgumentParser(description='A daemon that feeds your pets.')
parser.add_argument('-c', '--config', help='The config file location.')
args = parser.parse_args()

# Define a default configuration.
config = configparser.ConfigParser()
config["logging"] = {
    "logging_enabled": 1,
    "logging_method": "stdout",
}

config["general"] = {
    "database": "petfeedd.db",
    "name": "petfeedd"
}

config["discovery"] = {
    "enabled": 1
}

config["web"] = {
    "enabled": 1,
    "bind_address": "0.0.0.0",
    "bind_port": 8080
}

config["gpio"] = {
    "servo_pin": 17,
    "servo_feed_time": 0.25
}

config["logging"] = {
    "enabled": 1,
    "method": "stdout"
}

# Try to read from the environment. We look for variables beginning with
# "petfeedd_", with the keys mapping to the identical keys in the petfeedd.conf
# file, with underscores denoting sections.
for k in os.environ:
    if k[0:9] == "petfeedd_":
        keys = k.split('_', 2)
        keys.pop(0)
        value = os.environ[k]
        config[keys[0]][keys[1]] = value

# If we were specified a config file. read that now.
config_loaded = False
if args.config:
    if not os.path.exists(os.path.realpath(args.config)):
        print("Config file not found.")
        sys.exit(1)

    print("Parsing configuration.")
    config.read(os.path.realpath(args.config))
    config_loaded = True

# If we weren't specified a config file, check in some common locations on *NIX
# systems.
else:
    common_locations = [
        "./petfeedd.conf",
        "/etc/petfeedd.conf",
        "/usr/local/etc/petfeedd.conf"
    ]

    for location in common_locations:
        if os.path.exists(location):
            print("Config file found at " + location)
            print("Parsing configuration.")
            config.read(location)
            config_loaded = True

# If we got here without finding a config file, just roll with it.
if not config_loaded:
    print("No config file specified. Proceeding with defaults and environment.")

# Setup logging)
logger = logging.getLogger('petfeedd')
logger.setLevel(logging.DEBUG)
if strtobool(config["logging"]["enabled"]) == 0:
    logger.addHandler(logging.NullHandler())
else:
    handler = logging.NullHandler()
    formatter = logging.Formatter('petfeedd %(asctime)s (%(levelname)s): %(message)s')

    if config["logging"]["method"] == "stdout":
        handler = logging.StreamHandler(sys.stdout)
    elif config["logging"]["method"] == "syslog":
        handler = logging.handlers.SysLogHandler(address=config["logging"]["address"])
    elif config["logging"]["method"] == "file":
        handler = logging.FileHandler(config["logging"]["file"])

    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.info("Logging enabled.")

# Make a DB connection and create the tables if they need to be created.
db = SqliteExtDatabase(config["general"]["database"])
db.connect()
db.create_tables([Setting, Feed, FeedEvent], safe=True)

# Create a sharted feeding queue that will be used by several workers. Create
# a notification queue for sending status notifications
feed_queue = queue.Queue()
notification_queue = queue.Queue()

# Our semaphore for feeding and pausing.
petfeedd.feeding_semaphore = True

# Holds our thread pool.
thread_pool = []

# Start the web worker if requested.
if strtobool(config["web"]["enabled"]) == 1:
    thread_pool.append(WebWorker(feed_queue, config).begin())

# Start the workers. These workers should always run.
thread_pool.append(TimeWorker(feed_queue).begin())
thread_pool.append(NotificationWorker(notification_queue, config).begin())
thread_pool.append(FeedWorker(feed_queue, config, notification_queue).begin())

# Start the auto discovery worker if requested.
if strtobool(config["discovery"]["enabled"]) == 1:
    thread_pool.append(DiscoveryWorker(config).begin())

# Shutdown handling when we receive SIGINT, end all the threads gracefully.
def sigint_signal(signal, frame):
    print("Received shutdown signal. Shutting down.")
    logging.shutdown()
    for thread in thread_pool:
        thread.end()

# Trap the SIGINT signal.
signal.signal(signal.SIGINT, sigint_signal)
signal.signal(signal.SIGTERM, sigint_signal)

# Join all the threads.
for thread in thread_pool:
    thread.join(timeout=3)
