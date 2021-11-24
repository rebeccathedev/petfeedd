const moment = require('moment');
const schedule = require('node-schedule');
const bus = require('./event-bus');
const database = require("./database");

class Scheduler {
  constructor(database) {
    this.database = database;
    this.jobs = [];
  }

  async run() {
    console.log("Scheduling jobs.");
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

    console.log("Scheduled a feed for " + feed.time + " daily. Next feed: " + job.nextInvocation());

    job.feed = feed;

    this.jobs.push(job);
  }

  async feed(feed, job) {
    let Servo = this.database.modelFactory("Servo");
    let servo = await Servo.findByPk(feed.servo_id);

    // do the feed!
    console.log("Running a feed.");
    bus.emit('feed', {
      pin: servo.pin,
      time: servo.feed_time * feed.size
    });
  }

  async cancelAllJobs() {
    this.jobs.forEach(job => {
      console.log("Cancelling job scheduled for " + job.nextInvocation());
      schedule.cancelJob(job);
    });

    this.jobs = [];
  }

  async rescheduleAllJobs() {
    this.cancelAllJobs();
    this.run();
  }
}

module.exports = new Scheduler(database);
