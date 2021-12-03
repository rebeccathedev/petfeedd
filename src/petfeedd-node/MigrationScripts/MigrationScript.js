const log4js = require("log4js");

class MigrationScript {
  constructor(config, database) {
    this.config = config;
    this.database = database;
    this.logger = log4js.getLogger("Migration:" + this.constructor.name);
    this.logger.level = "debug";
  }

  migrate() {
    this.logger.warning("Migration script implementation missing.");
  }
}

module.exports = MigrationScript;
