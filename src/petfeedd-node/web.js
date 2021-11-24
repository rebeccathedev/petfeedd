const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const bus = require("./event-bus");
const scheduler = require("./scheduler");
const database = require("./database");

class Web {
  constructor(database) {
    this.database = database;
    this.app = express();
    this.app.use(bodyParser.json());

    this.app.use(function(err, req, res, next) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      res.status(err.statusCode).json({
        status: false,
        error: err.message
      });
    });

    this.app.use('/', express.static(path.join(__dirname, 'public')));

    var apiRouter = express.Router();
    this.app.use('/api', apiRouter);

    apiRouter.get("/feeds", this.wrapper(this.getFeeds));
    apiRouter.post("/feeds", this.wrapper(this.postFeed));
    apiRouter.put("/feeds/:feedId", this.wrapper(this.putFeed));
    //apiRouter.delete("/feeds/:feedId", this.wrapper(this.deleteFeed));
    apiRouter.delete("/feeds/:feedId", this.wrapper(this.deleteFeed));
    apiRouter.get("/feeds/:feedId/feed", this.wrapper(this.onDemandFeed));

    apiRouter.get("/events", this.wrapper(this.getEvents));

    apiRouter.get("/servos", this.wrapper(this.getServos));
    apiRouter.post("/servos", this.wrapper(this.postServos));
    apiRouter.get("/servos/:servoId", this.wrapper(this.getServo));
    apiRouter.put("/servos/:servoId", this.wrapper(this.putServo));
    apiRouter.delete("/servos/:servoId", this.wrapper(this.deleteServo));
  }

  listen() {
    this.app.listen(8080, () => {
      console.log(`petfeedd listening at http://localhost:8080`);
    });
  }

  wrapper(fn) {
    return async (request, response, next) => {
      try {
        // run controllers logic

        let f = fn.bind(this);
        await f(request, response);
      } catch (e) {
        // if an exception is raised, do not send any response
        // just continue performing the middleware chain
        next(e)
      }
    }
  }

  async getFeeds(request, response) {
    let Feed = this.database.modelFactory("Feed");
    let feeds = await Feed.findAll();
    response.send(feeds);
  }

  async postFeed(request, response) {
    let Feed = this.database.modelFactory("Feed");
    let newFeed = Feed.create({
      time: request.body.time,
      servo_id: request.body.servo_id,
      name: request.body.name,
      size: request.body.size,
      feed_count: 0
    });

    scheduler.rescheduleAllJobs();

    response.send(newFeed);
  }

  async putFeed(request, response) {
    let Feed = this.database.modelFactory("Feed");
    var updateFeed = await Feed.findByPk(request.params.feedId);
    if (!updateFeed) {
      return response.status(404).send();
    }

    updateFeed.time = request.body.time;
    updateFeed.servo_id = request.body.servo_id;
    updateFeed.name = request.body.name;
    updateFeed.size = request.body.size;
    updateFeed.save();

    scheduler.rescheduleAllJobs();

    response.send(updateFeed);
  }

  async deleteFeed(request, response) {
    let Feed = this.database.modelFactory("Feed");
    var updateFeed = await Feed.findByPk(request.params.feedId);
    if (!updateFeed) {
      return response.status(404).send();
    }

    updateFeed.destroy();
    scheduler.rescheduleAllJobs();
    return response.send(updateFeed);
  }

  async onDemandFeed(request, response) {
    let Feed = this.database.modelFactory("Feed");
    let Servo = this.database.modelFactory("Servo");
    var feed = await Feed.findByPk(request.params.feedId);
    var servo = await Servo.findByPk(feed.servo_id);

    bus.emit("feed", {
      pin: feed.pin,
      time: servo.feed_time * feed.size,
      feed: feed,
      onDemand: true,
    });

    response.send(feed);
  }

  async getEvents(request, response) {
    let FeedEvent = this.database.modelFactory("FeedEvent");
    const events = await FeedEvent.findAll();
    response.send(events);
  }

  async getServos(request, response) {
    let Servo = this.database.modelFactory("Servo");
    const servos = await Servo.findAll();
    response.send(servos);
  }

  async postServos(request, response) {
    let Servo = this.database.modelFactory("Servo");
    const servos = await Servo.findAll();
    response.send(servos);
  }

  async deleteServo(request, response) {
    let Servo = this.database.modelFactory("Servo");
    var updateServo = await Servo.findByPk(request.params.servoId);
    if (updateServo) {
      updateServo.destroy();
    }

    response.send(updateServo);
  }
}

module.exports = new Web(database);
