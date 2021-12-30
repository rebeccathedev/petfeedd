const Umzug = require("umzug");
const path = require("path");
const log4js = require("log4js");

class Database {
  constructor(database) {
    // Load logger
    this.logger = log4js.getLogger("Database");
    this.logger.level = "debug";

    this.logger.info("Initializing database.");

    // Initalize ORM.
    this.sequelize = require("./sequelize");

    this.models = {
      "Feed": require("./Models/Feed"),
      "FeedEvent": require("./Models/FeedEvent"),
      "Setting": require("./Models/Setting"),
      "Servo": require("./Models/Servo"),
      "MQTT": require("./Models/MQTT"),
      "Button": require("./Models/Button"),
      "Sound": require("./Models/Sound"),
    }
  }

  async runMigrations() {
    // Do any migrations.
    const umzug = new Umzug({
      migrations: {
        path: path.join(__dirname, "./Migrations"),
        params: [this.sequelize.getQueryInterface()],
      },
      storage: "sequelize",
      storageOptions: {
        sequelize: this.sequelize,
      },
    });

    this.logger.info("Running migrations.");
    await umzug.up();
    this.logger.info("All migrations performed successfully");
  }

  modelFactory(model) {
    return this.models[model];
  }

  async shutdown() {
    this.logger.info("Shutting down.");
    await this.sequelize.close();
  }
}

module.exports = new Database
