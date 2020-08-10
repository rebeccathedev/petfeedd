class MigrationScript {
  constructor(config, database) {
    this.config = config;
    this.database = database;
  }

  migrate() {
    console.log("Create servo");
  }
}

module.exports = MigrationScript;
