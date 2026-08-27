const { Umzug, SequelizeStorage } = require("umzug");
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
        glob: path.join(__dirname, "./Migrations/*.js"),
        resolve: ({ name, path: migrationPath }) => {
          const migration = require(migrationPath);
          return {
            name,
            up: () => migration.up(this.sequelize.getQueryInterface()),
            down: () => migration.down(this.sequelize.getQueryInterface()),
          };
        },
      },
      context: this.sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize: this.sequelize }),
      logger: this.logger,
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
