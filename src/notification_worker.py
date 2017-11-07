import queue
import smtplib
import emails

from worker import Worker
from pushbullet import Pushbullet
from distutils.util import strtobool

class NotificationWorker(Worker):
    def __init__(self, notification_queue, config, *args, **kwargs):
        self.notification_queue = notification_queue
        self.config = config
        super().__init__(*args, **kwargs)

    def run(self):
        print("Starting notification worker.")

        while True:
            if self.stopped():
                print("Stopping notification worker.")
                return

            try:
                notification_event = self.notification_queue.get(timeout=1)
                if notification_event:
                    print("Found a notification event.")
                    self.send_email(notification_event.text)
                    self.send_pushbullet(notification_event.text)

                self.notification_queue.task_done()
            except queue.Empty:
                pass

    def send_email(self, message):

        if strtobool(self.config["email_notifications"]["enabled"]) == 0:
            return

        smtp = {
            "host": self.config["email_notifications"]["server"],
            "port": self.config["email_notifications"]["port"],
            "user": self.config["email_notifications"]["username"],
            "password": self.config["email_notifications"]["password"]
        }

        m = emails.Message(text=message,
                            subject=self.config["email_notifications"]["subject"],
                            mail_from=(self.config["email_notifications"]["from"], self.config["email_notifications"]["from_address"]))

        response = m.send(to=self.config["email_notifications"]["to"],
                            smtp=smtp);

    def send_pushbullet(self, message):

        if strtobool(self.config["pushbullet_notifications"]["enabled"]) == 0:
            return

        pb = Pushbullet(self.config["pushbullet_notifications"]["api_key"])
        push = pb.push_note(self.config["pushbullet_notifications"]["subject"], message)
