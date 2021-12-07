const moment = require('moment');
const schedule = require('node-schedule');
const bus = require('../event-bus');
const database = require("../database");

const Library = require("./Library");

class Scheduler extends Library {
  constructor(database) {
    super();
    this.database = database;
    this.jobs = [];
  }

  async run() {
    this.logger.info("Starting up.");
    let Feed = this.database.modelFactory("Feed");
    let feeds = await Feed.findAll();

    for (const i in feeds) {
      if (feeds.hasOwnProperty(i)) {
        const feed = feeds[i];

        // Schedule the job.
        this.schedule(feed);
      }
    }
  }

  async schedule(feed) {
    let rule = new schedule.RecurrenceRule();
    rule.hour = feed.time.split(":")[0];
    rule.minute = feed.time.split(":")[1];

    var job = schedule.scheduleJob(rule, () => {
      this.feed(feed, job);
    });

    this.logger.info("Scheduled a feed for " + feed.time + " daily. Next feed: " + job.nextInvocation());

    job.feed = feed;

    this.jobs.push(job);
  }

  async feed(feed, job) {
    let Servo = this.database.modelFactory("Servo");
    let servo = await Servo.findByPk(feed.servo_id);

    // do the feed!
    this.logger.info("Running a feed: " + feed.name);
    bus.emit('feed', {
      pin: servo.pin,
      time: servo.feed_time,
      size: feed.size,
      name: feed.name
    });

    this.logger.info("Next time feed " + feed.name + ": " + job.nextInvocation());
  }

  async cancelAllJobs() {
    this.jobs.forEach(job => {
      this.logger.info("Cancelling job scheduled for " + job.nextInvocation());
      schedule.cancelJob(job);
    });

    this.jobs = [];
  }

  async reload() {
    this.logger.info("Reloading.");
    this.shutdown();
    this.run();
  }

  async shutdown() {
    this.logger.info("Shutting down.");
    this.cancelAllJobs();
  }
}

module.exports = new Scheduler(database);
