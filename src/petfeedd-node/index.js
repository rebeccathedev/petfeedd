const Database = require("./database");
const Web = require("./web");
const Scheduler = require("./scheduler");
const Feeder = require("./feeder");

console.log("petfeedd is starting up. :)");

// Load our initial config.
var configObj = require("./config");
configObj.loadConfig();

// Run any migration scripts
(async () => {
  await Database.runMigrations();

  let migrations = require("./MigrationScripts");
  migrations.run(configObj.getConfig(), Database);

  // Start the web server.
  Web.listen();

  // Start the feed listener.
  Feeder.start();

  // Start the scheduler.
  Scheduler.run();
})();
