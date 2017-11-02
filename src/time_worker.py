import time
import queue
import datetime

from worker import Worker
from models.Feed import Feed
from models.FeedEvent import FeedEvent

class TimeWorker(Worker):
    def __init__(self, feed_queue, *args, **kwargs):
        self.feed_queue = feed_queue
        super().__init__(*args, **kwargs)

    def run(self):
        print("Starting time worker.")

        while True:
            if self.stopped():
                print("Stopping time worker.")
                return

            time_query = time.strftime("%H:%M:%S")
            for feed in Feed.select().where(Feed.time==time_query):
                print("Found feed " + feed.name + " at " + time_query)
                feed_event = FeedEvent.create(size=feed.size, name=feed.name)
                self.feed_queue.put(feed_event)

                feed.last_feed = feed_event.date_updated
                feed.feed_count = feed.feed_count + 1
                feed.save()

            time.sleep(1)
