const express = require('express');
const bodyParser = require('body-parser')

class Web {
  constructor(database) {
    this.database = database;
    this.app = express();
    this.app.use(bodyParser.json())

    this.app.get('/api/feeds', (...args) => this.getFeeds(...args));
    this.app.post('/api/feeds', (...args) => this.postFeeds(...args));
    this.app.put('/api/feeds/:feedId', (...args) => this.putFeeds(...args));
    this.app.delete('/api/feeds/:feedId', (...args) => this.deleteFeeds(...args));

    this.app.get('/api/events', (...args) => this.getEvents(...args));

    this.app.get('/api/servos', (...args) => this.getServos(...args));
    this.app.post('/api/servos', (...args) => this.postServos(...args));
  }

  listen() {
    this.app.listen(8080, () => {
      console.log(`petfeedd listening at http://localhost:8080`);
    });
  }

  async getFeeds(request, response) {
    let Feed = this.database.modelFactory("Feed");
    let feeds = await Feed.findAll();
    response.send(feeds);
  }

  async postFeeds(request, response) {
    let Feed = this.database.modelFactory("Feed");
    let newFeed = Feed.create({
      time: request.body.time,
      servo_id: request.body.servo_id,
      name: request.body.name,
      size: request.body.size
    });

    response.send(newFeed);
  }

  async putFeeds(request, response) {
    let Feed = this.database.modelFactory("Feed");
    var updateFeed = await Feed.findByPk(request.params.feedId);
    updateFeed.time = request.body.time;
    updateFeed.servo_id = request.body.servo_id;
    updateFeed.name = request.body.name;
    updateFeed.size = request.body.size;
    updateFeed.save();

    response.send(updateFeed);
  }

  async deleteFeeds(request, response) {
    let Feed = this.database.modelFactory("Feed");
    var updateFeed = await Feed.findByPk(request.params.feedId);
    updateFeed.destroy();

    response.send(updateFeed);
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
}

module.exports = Web;
