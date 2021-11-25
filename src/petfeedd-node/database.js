const Umzug = require("umzug");
const path = require("path");

class Database {
  constructor(database) {
    console.log("Initializing database.");

    // Initalize ORM.
    this.sequelize = require("./sequelize");

    this.models = {
      "Feed": require("./Models/Feed"),
      "FeedEvent": require("./Models/FeedEvent"),
      "Setting": require("./Models/Setting"),
      "Servo": require("./Models/Servo"),
      "MQTT": require("./Models/MQTT"),
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

    console.log("Running migrations.");
    await umzug.up();
    console.log("All migrations performed successfully");
  }

  modelFactory(model) {
    return this.models[model];
  }
}

module.exports = new Database
