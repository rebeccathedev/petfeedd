const database = require("../database");
const Library = require("./Library");
const config = require("../config");

const { Bonjour: BonjourService } = require('bonjour-service');

class Bonjour extends Library {
  constructor(database) {
    super();
    this.database = database;
  }

  async run() {
    this.logger.info("Starting Bonjour/Zeroconf.");

    let port = parseInt(await config.getConfigEntry("web", "bind_port"));
    let name = await config.getConfigEntry("general", "name");
    let bonjour = new BonjourService();
    this.service = bonjour.publish({
      name: name,
      type: 'petfeedd',
      protocol: "tcp",
      port: port
    });

    this.service.start();
  }

  async reload() {
    this.logger.info("Reloading Bonjour/Zeroconf.");
    this.service.stop();
    this.run();
  }
}

module.exports = new Bonjour(database);
