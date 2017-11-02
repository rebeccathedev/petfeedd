# Imports from the standard library.
import threading
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
from feed_worker import FeedWorker
from time_worker import TimeWorker
from discovery_worker import DiscoveryWorker
from web_worker import WebWorker

# Import all the models.
from models.Setting import Setting
from models.Feed import Feed
from models.FeedEvent import FeedEvent

# Configure argument parsing and parse arguments.
parser = argparse.ArgumentParser(description='A daemon that feeds your pets.')
parser.add_argument('-c', '--config', help='The config file location.')
args = parser.parse_args()

# Define a default configuration.
config = configparser.ConfigParser()
config["general"] = {
    "discovery_enabled": 1,
    "database": "petfeedd.db"
}

config["web"] = {
    "web_enabled": 1,
    "bind_address": "127.0.0.1",
    "bind_port": 8080
}

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
    print("No config file specified. Proceeding with defaults.")

# Make a DB connection and create the tables if they need to be created.
db = SqliteExtDatabase(config["general"]["database"])
db.connect()
db.create_tables([Setting, Feed, FeedEvent], safe=True)

# Create a sharted feeding queue that will be used by several workers.
feed_queue = queue.Queue()

# Holds our thread pool.
thread_pool = []

# Start the web worker if requested.
if strtobool(config["web"]["web_enabled"]) == 1:
    thread_pool.append(WebWorker(feed_queue, config).begin())

# Start the workers. These workers should always run.
thread_pool.append(FeedWorker(feed_queue, config).begin())
thread_pool.append(TimeWorker(feed_queue).begin())

# Start the auto discovery worker if requested.
if strtobool(config["general"]["discovery_enabled"]) == 1:
    thread_pool.append(DiscoveryWorker(config).begin())

# Shutdown handling when we receive SIGINT, end all the threads gracefully.
def sigint_signal(signal, frame):
    print("Received shutdown signal. Shutting down.")
    for thread in thread_pool:
        thread.end()

# Trap the SIGINT signal.
signal.signal(signal.SIGINT, sigint_signal)
signal.signal(signal.SIGTERM, sigint_signal)

# Join all the threads.
for thread in thread_pool:
    thread.join(timeout=3)
