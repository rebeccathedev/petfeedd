const log4js = require("log4js");

class Library {
  constructor() {
    this.logger = log4js.getLogger(this.constructor.name);
    this.logger.level = "debug";
  }

  async run() {}

  async reload() {
    this.logger.info("Reloading.");
    await this.shutdown();
    await this.run();
  }

  async shutdown() {}
}

module.exports = Library;
