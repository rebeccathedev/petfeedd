import sqlite3
import time
import threading
import queue

class FeedWorker(threading.Thread):
    def __init__(self, feed_queue, *args, **kwargs):
        self.feed_queue = feed_queue
        super().__init__(*args, **kwargs)

    def run(self):
        print("Starting feed worker.")
        
        while True:
            try:
                feed_event = self.feed_queue.get(timeout=3)
                print(feed_event)
                self.feed_queue.task_done()
            except queue.Empty:
                pass

            time.sleep(1)
