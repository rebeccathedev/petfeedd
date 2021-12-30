var player = require('play-sound')(opts = {})
const database = require("../database");
const Library = require("./Library");
const config = require("../config");
const bus = require("../event-bus");

class Sounds extends Library {
  constructor(database) {
    super();
    this.database = database;
  }

  async run() {
    this.calls = [];

    this.logger.info("Starting up.");
    let Sound = this.database.modelFactory("Sound");
    let sounds = await Sound.findAll();

    for (const sound of sounds) {
      let f = async (feed_event) => {
        this.playSound(sound);
      };

      this.calls[sound.event] ??= [];
      this.calls[sound.event].push(f);
      bus.on(sound.event, f);
    }
  }

  async playSound(sound) {
    player.play('./uploads/' + sound.sound);
  }

  async shutdown() {
    this.logger.info("Shutting down.");

    for (const event in this.calls) {
      if (Object.hasOwnProperty.call(this.calls, event)) {
        const functions = this.calls[event];
        for (const f of functions) {
          bus.removeListener(event, f);
        }
      }
    }
  }
}

module.exports = new Sounds(database);
