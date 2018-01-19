import queue
import smtplib
import emails
import twitter
import logging

from worker import Worker
from pushbullet import Pushbullet
from distutils.util import strtobool

class NotificationWorker(Worker):
    def __init__(self, notification_queue, config, *args, **kwargs):
        self.notification_queue = notification_queue
        self.config = config
        super().__init__(*args, **kwargs)

    def run(self):
        logging.getLogger('petfeedd').info("Starting notification worker.")

        while True:
            if self.stopped():
                logging.getLogger('petfeedd').info("Stopping notification worker.")
                return

            try:
                notification_event = self.notification_queue.get(timeout=1)
                if notification_event:
                    logging.getLogger('petfeedd').info("Found a notification event.")
                    self.send_email(notification_event.text)
                    self.send_pushbullet(notification_event.text)
                    self.send_twitter(notification_event.text)

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

    def send_twitter(self, message):

        if strtobool(self.config["twitter_notifications"]["enabled"]) == 0:
            return

        api = twitter.Api(consumer_key=self.config["twitter_notifications"]["consumer_key"],
                  consumer_secret=self.config["twitter_notifications"]["consumer_secret"],
                  access_token_key=self.config["twitter_notifications"]["access_key"],
                  access_token_secret=self.config["twitter_notifications"]["access_secret"])

        try:
            status = api.PostUpdate(message)
        except twitter.error.TwitterError as err:
            for i in err.message:
                logging.getLogger('petfeedd').error(i)
