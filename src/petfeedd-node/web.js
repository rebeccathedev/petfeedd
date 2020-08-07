const express = require('express');

class Web {
  constructor(database) {
    this.database = database;
    this.app = express();

    this.app.get('/api/events', (...args) => this.getEvents(...args));
  }

  listen() {
    this.app.listen(8080, () => {
      console.log(`petfeedd listening at http://localhost:8080`);
    });
  }

  async getEvents(request, response) {
    let FeedEvent = this.database.modelFactory("FeedEvent");
    const events = await FeedEvent.findAll();
    response.send(events);
  }
}

module.exports = Web;
