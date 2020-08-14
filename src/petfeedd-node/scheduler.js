const moment = require('moment');
const schedule = require('node-schedule');
const bus = require('./event-bus');

class Scheduler {
  constructor(database) {
    this.database = database;
    this.jobs = [];
  }

  async run() {
    let Feed = this.database.modelFactory("Feed");
    let feeds = await Feed.findAll();

    for (const i in feeds) {
      if (feeds.hasOwnProperty(i)) {
        const feed = feeds[i];

        // If we don't have a next feed, we need to schedule one.
        var currentDate = moment().format("YYYY-MM-DD");
        var currentDateTime = moment();
        var nextTime = moment(currentDate + " " + feed.time);

        // If the next time is after the same time today, add a day.
        if (currentDateTime.isAfter(nextTime)) {
          nextTime.add(1, 'days');
        }

        feed.next_feed = nextTime;
        feed.save();

        // Schedule the job.
        this.schedule(feed);
      }
    }
  }

  async schedule(feed) {
    console.log("Scheduling a feed for " + feed.next_feed);

    var job = schedule.scheduleJob(moment(feed.next_feed).toDate(), () => {
      this.feed(feed, job);
    });

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

    let nextFeed = moment(feed.next_feed).add(1, "days");
    feed.next_feed = nextFeed;
    feed.save();

    this.jobs = this.jobs.filter(job => !job);
    this.schedule(feed);
  }
}

module.exports = Scheduler;
