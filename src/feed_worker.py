import time
import threading
import queue

from gpiozero import Servo

class FeedWorker(threading.Thread):
    def __init__(self, feed_queue, config, *args, **kwargs):
        self.feed_queue = feed_queue
        self.config = config
        super().__init__(*args, **kwargs)

    def run(self):
        print("Starting feed worker.")

        while True:
            try:
                feed_event = self.feed_queue.get(timeout=3)
                if feed_event:
                    print("Found a feed event. Dispensing " + str(feed_event.size) + " feeds.")
                    self.feed(feed_event.size)

                self.feed_queue.task_done()
            except queue.Empty:
                pass

            time.sleep(1)

    def feed(self, feed_size):
        feed_size_time = float(self.config["gpio"]["servo_feed_time"] * feed_size)
        servo = Servo(self.config["gpio"]["servo_pin"])
        servo.max()
        time.sleep(feed_size_time)
        servo.detach()
