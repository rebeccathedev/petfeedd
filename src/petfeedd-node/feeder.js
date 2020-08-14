const bus = require('./event-bus');
const Gpio = require('pigpio').Gpio;

class Feeder {
  constructor(database) {
    this.database = database;
  }

  start() {
    bus.on('feed', (...args) => this.feed(...args));
  }

  async feed(feedData) {
    try {
      let motor = new Gpio(feedData.pin, {
        mode: Gpio.OUTPUT
      });
    } catch (error) {
      console.log("Could not enable GPIO.")
      console.log(error);
      return;
    }

    motor.servoWrite(1000);

    setInterval(() => {
      motor.servoWrite(0);

      if (feedData.feed) {
        var feed = feedData.feed;
        feed.feed_count++;
        feed.last_feed = new Date();
        feed.save();

        let FeedEvent = this.database.modelFactory("FeedEvent");
        var feedName = feed.name;
        if (feedData.onDemand) {
          feedName = " (On Demand)";
        }

        FeedEvent.create({
          name: feedName,
          size: feed.size
        })
      }
    }, feed.time * 1000);
  }
}

module.exports = Feeder;
