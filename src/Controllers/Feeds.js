const REST = require("./REST");
const bus = require("../event-bus");
const feeder = require("../Core/Feeder");

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

    bus.emit("scheduler.reload");

    return response;
  }

  async update(request, response) {
    response = await super.update(request, response);

    bus.emit("scheduler.reload");

    return response;
  }

  async bulkUpdate(request, response) {
    response = await super.bulkUpdate(request, response);

    bus.emit("scheduler.reload");

    return response;
  }

  async feed(request, response) {
    let Feed = this.database.modelFactory(this.model);
    let Servo = this.database.modelFactory("Servo");
    var feed = await Feed.findByPk(request.params[this.primaryKey]);
    if (!feed) {
      return response.status(404).send({ error: "Feed not found" });
    }

    var servo = await Servo.findByPk(feed.servo_id);
    if (!servo) {
      return response.status(422).send({ error: "The feed has no valid servo" });
    }

    const result = await feeder.feed({
      pin: servo.pin,
      time: servo.feed_time,
      size: feed.size,
      feed: feed,
      onDemand: true,
    });

    if (result.reason === "paused") {
      return response.status(409).send({ error: "Feeding is paused" });
    }

    if (!result.successful) {
      return response.status(503).send({
        error: "The feeder could not activate the configured GPIO pin",
        event: result.feedEvent,
      });
    }

    return response.send(result.feedEvent);
  }
}

module.exports = Feeds;
