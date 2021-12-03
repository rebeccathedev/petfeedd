const database = require("../database");
const Library = require("./Library");
const config = require("../config");
const TwitterAPI = require("twitter");
const bus = require("../event-bus");

class Twitter extends Library {
  constructor(database) {
    super();
    this.database = database;
  }

  async run() {
    this.consumer_key = await config.getConfigEntry("twitter", "consumer_key");
    this.consumer_secret = await config.getConfigEntry(
      "twitter",
      "consumer_secret"
    );
    this.access_token_key = await config.getConfigEntry(
      "twitter",
      "access_token_key"
    );
    this.access_token_secret = await config.getConfigEntry(
      "twitter",
      "access_token_secret"
    );
    this.enable = await config.getConfigEntry("twitter", "enable");
    this.message_format = await config.getConfigEntry(
      "twitter",
      "message_format"
    );

    this.feeder_name = await config.getConfigEntry("general", "name");

    if (
      this.enable &&
      this.consumer_key &&
      this.consumer_secret &&
      this.access_token_key &&
      this.access_token_secret
    ) {
      this.client = new TwitterAPI({
        consumer_key: this.consumer_key,
        consumer_secret: this.consumer_secret,
        access_token_key: this.access_token_key,
        access_token_secret: this.access_token_secret,
      });

      this.feedCompleteCall = async (feedEvent) => {
        this.sendTweet(feedEvent);
      }

      bus.on("feed.completed", this.feedCompleteCall);
    }
  }

  async sendTweet(feedEvent) {
    var message = this.message_format;

    for (const key in feedEvent.dataValues) {
      if (Object.hasOwnProperty.call(feedEvent.dataValues, key)) {
        const value = feedEvent.dataValues[key];
        message = message.replace("{feed_event." + key + "}", value);
      }
    }

    message = message.replace("{feeder_name}", this.feeder_name);

    this.logger.info("Sending tweet: " + message);

    this.client.post(
      "statuses/update",
      { status: message },
      function (error, tweet, response) {
        if (error) {
          this.logger.error("Send Tweet Failed: ", JSON.stringify(error));
        }
      }
    );
  }

  async reload() {
    this.logger.info("Reloading");
    bus.removeListener("feed.completed", this.feedCompleteCall);
    this.run();
  }

  async shutdown() {
    this.logger.info("Shutting down.");
    bus.removeListener("feed.completed", this.feedCompleteCall);
  }
}

module.exports = new Twitter(database);
