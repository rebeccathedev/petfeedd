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
    this.logger.info("Starting up.");
    this.config = await config.getConfigEntries("twitter");
    this.feeder_name = await config.getConfigEntry("general", "name");

    if (
      this.config.enable &&
      this.config.consumer_key &&
      this.config.consumer_secret &&
      this.config.access_token_key &&
      this.config.access_token_secret
    ) {
      this.client = new TwitterAPI({
        consumer_key: this.config.consumer_key,
        consumer_secret: this.config.consumer_secret,
        access_token_key: this.config.access_token_key,
        access_token_secret: this.config.access_token_secret,
      });

      this.feedCompleteCall = async (feedEvent) => {
        this.sendTweet(feedEvent);
      }

      bus.on("feed.completed", this.feedCompleteCall);
    }
  }

  async sendTweet(feedEvent) {
    var message = this.config.message_format;

    for (const key in feedEvent.dataValues) {
      if (Object.hasOwnProperty.call(feedEvent.dataValues, key)) {
        const value = feedEvent.dataValues[key];
        message = message.replace("{feed_event." + key + "}", value);
      }
    }

    message = message.replace("{feeder_name}", this.config.feeder_name);

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

  async shutdown() {
    this.logger.info("Shutting down.");
    if (this.feedCompleteCall) {
      bus.removeListener("feed.completed", this.feedCompleteCall);
    }
  }
}

module.exports = new Twitter(database);
