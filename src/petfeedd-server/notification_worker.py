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

        if strtobool(self.config["emailnotifications"]["enabled"]) == 0:
            return

        smtp = {
            "host": self.config["emailnotifications"]["server"],
            "port": self.config["emailnotifications"]["port"],
            "user": self.config["emailnotifications"]["username"],
            "password": self.config["emailnotifications"]["password"]
        }

        m = emails.Message(text=message,
                            subject=self.config["emailnotifications"]["subject"],
                            mail_from=(self.config["emailnotifications"]["from"], self.config["emailnotifications"]["from_address"]))

        response = m.send(to=self.config["emailnotifications"]["to"],
                            smtp=smtp);

    def send_pushbullet(self, message):

        if strtobool(self.config["pushbulletnotifications"]["enabled"]) == 0:
            return

        pb = Pushbullet(self.config["pushbulletnotifications"]["api_key"])
        push = pb.push_note(self.config["pushbulletnotifications"]["subject"], message)

    def send_twitter(self, message):

        if strtobool(self.config["twitternotifications"]["enabled"]) == 0:
            return

        api = twitter.Api(consumer_key=self.config["twitternotifications"]["consumer_key"],
                  consumer_secret=self.config["twitternotifications"]["consumer_secret"],
                  access_token_key=self.config["twitternotifications"]["access_key"],
                  access_token_secret=self.config["twitternotifications"]["access_secret"])

        try:
            status = api.PostUpdate(message)
        except twitter.error.TwitterError as err:
            for i in err.message:
                logging.getLogger('petfeedd').error(i)
