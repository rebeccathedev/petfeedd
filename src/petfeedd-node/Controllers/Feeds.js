const REST = require("./REST");
const bus = require("../event-bus");
const scheduler = require("../Core/Scheduler");

class Feeds extends REST {
  model = "Feed";

  getAdditionalRoutes() {
    return [
      {
        method: "get",
        path: "/:" + this.primaryKey + "/feed",
        callback: "feed",
      },
    ];
  }

  async create(request, response) {
    response = await super.create(request, response);

    scheduler.reload();

    return response;
  }

  async update(request, response) {
    response = await super.update(request, response);

    scheduler.reload();

    return response;
  }

  async feed(request, response) {
    let Feed = this.database.modelFactory(this.model);
    let Servo = this.database.modelFactory("Servo");
    var feed = await Feed.findByPk(request.params[this.primaryKey]);
    var servo = await Servo.findByPk(feed.servo_id);

    bus.emit("feed", {
      pin: feed.pin,
      time: servo.feed_time,
      size: feed.size,
      feed: feed,
      onDemand: true,
    });

    return response.send(feed);
  }
}

module.exports = Feeds;
