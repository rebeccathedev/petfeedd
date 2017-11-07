import os
import time
import queue

from worker import Worker
from events.Notification import Notification

# Let's try to identify what hardware we're on.
is_gpio_capable = False
if os.path.isfile("/sys/firmware/devicetree/base/model"):
    with open("/sys/firmware/devicetree/base/model", 'r') as stat_file:
        data=stat_file.read()
        if data[0:9] == "Raspberry":
            is_gpio_capable = True

else:
    if not os.environ.get('PIGPIO_ADDR') == None:
        is_gpio_capable = True

if not is_gpio_capable:
    print("This is not a Raspberry Pi and PIGPIO_ADDR for remote GPIO has not \
been defined. Disabling GPIO.")

# If this device is not GPIO capable, we need to just disable it all. We'll
# simulate feeds.
if is_gpio_capable:
    from gpiozero import Servo

class FeedWorker(Worker):
    def __init__(self, feed_queue, config, notification_queue, *args, **kwargs):
        self.feed_queue = feed_queue
        self.config = config
        self.notification_queue = notification_queue
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

                    note = Notification()
                    note.text = "test"
                    self.notification_queue.put(note)

                self.feed_queue.task_done()
            except queue.Empty:
                pass

    def feed(self, feed_size):
        if not is_gpio_capable:
            print("This device is not GPIO capable. Simulating a feed.")
            return

        feed_size_time = float(self.config["gpio"]["servo_feed_time"]) * float(feed_size)
        servo = Servo(int(self.config["gpio"]["servo_pin"]))
        servo.max()
        time.sleep(feed_size_time)
        servo.detach()
