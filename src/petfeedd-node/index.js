const Database = require("./database");
const Web = require("./web");
const Scheduler = require("./scheduler");
const Feeder = require("./feeder");
const MQTT = require("./mqtt");

console.log("petfeedd is starting up. :)");

// Load our initial config.
var configObj = require("./config");
configObj.loadConfig();

// Run any migration scripts
(async () => {
  await Database.runMigrations();

  let migrations = require("./MigrationScripts");
  migrations.run(configObj.getConfig(), Database);

  // Load the database into the config instance.
  configObj.initalizeDatabaseConfig(Database);

  // Start the web server.
  Web.listen();

  // Start the feed listener.
  Feeder.start();

  // Start the scheduler.
  Scheduler.run();

  MQTT.run();
})();
