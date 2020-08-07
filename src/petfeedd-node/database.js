const Sequelize = require("sequelize");
const Umzug = require("umzug");
const path = require("path");

class Database {
  constructor(database) {
    console.log("Initializing database.");

    // Initalize ORM.
    this.sequelize = new Sequelize("petfeedd", null, null, {
      host: "localhost",
      dialect: "sqlite",

      pool: {
        max: 5,
        min: 0,
        idle: 10000,
      },

      storage: database,
    });

    this.models = {
      "Feed": require("./Models/Feed")(this.sequelize),
      "FeedEvent": require("./Models/FeedEvent")(this.sequelize),
      "Setting": require("./Models/Setting")(this.sequelize),
      "Servo": require("./Models/Servo")(this.sequelize)
    }
  }

  runMigrations() {
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

    (async () => {
      console.log("Running migrations.");
      await umzug.up();
      console.log("All migrations performed successfully");
    })();
  }

  modelFactory(model) {
    return this.models[model];
  }
}

module.exports = Database
