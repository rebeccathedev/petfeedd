import threading

from feed_worker import feed_worker
from web_worker import web_worker

web_worker_thread = threading.Thread(target=web_worker)
web_worker_thread.start()

feed_worker_thread = threading.Thread(target=feed_worker)
feed_worker_thread.start()
