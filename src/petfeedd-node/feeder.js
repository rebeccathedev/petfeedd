const bus = require('./event-bus');
const Gpio = require('pigpio').Gpio;
const mqtt = require('./mqtt');

class Feeder {
  constructor(database) {
    this.database = require("./database");
  }

  start() {
    console.log("Listening for feeds.");
    bus.on('feed', (...args) => this.feed(...args));
  }

  async feed(feedData) {
    try {
      let motor = new Gpio(feedData.pin, {
        mode: Gpio.OUTPUT
      });

      motor.servoWrite(2500);
      await sleep(feedData.time * feedData.size * 1000);
      motor.servoWrite(0);

      mqtt.publish(feedData.size);

    } catch (error) {
      console.log("Could not enable GPIO.")
      console.log(error);
    }

    var feedName = feedData.name || "Received";
    if (feedData.feed) {
      var feed = feedData.feed;
      feed.feed_count++;
      feed.last_feed = new Date();
      feed.save();

      feedName = feed.name;
    }

    let FeedEvent = this.database.modelFactory("FeedEvent");
    if (feedData.onDemand) {
      feedName += " (On Demand)";
    }

    FeedEvent.create({
      name: feedName,
      size: feedData.size
    });
  }
}

module.exports = new Feeder;
