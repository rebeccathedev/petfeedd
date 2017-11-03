import time
import queue

from worker import Worker
from gpiozero import Servo

class FeedWorker(Worker):
    def __init__(self, feed_queue, config, *args, **kwargs):
        self.feed_queue = feed_queue
        self.config = config
        super().__init__(*args, **kwargs)

    def run(self):
        print("Starting feed worker.")

        while True:
            if self.stopped():
                print("Stopping feed worker.")
                return

            try:
                feed_event = self.feed_queue.get(timeout=1)
                if feed_event:
                    print("Found a feed event. Dispensing " + str(feed_event.size) + " feeds.")
                    self.feed(feed_event.size)

                self.feed_queue.task_done()
            except queue.Empty:
                pass

    def feed(self, feed_size):
        feed_size_time = float(self.config["gpio"]["servo_feed_time"]) * float(feed_size)
        servo = Servo(int(self.config["gpio"]["servo_pin"]))
        servo.max()
        time.sleep(feed_size_time)
        servo.detach()
