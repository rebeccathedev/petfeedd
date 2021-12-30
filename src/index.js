// Basic includes.
const process = require('process');
const log4js = require("log4js");
const glob = require("glob");
let logger = log4js.getLogger("petfeedd");
logger.level = "debug";

logger.info("petfeedd is starting up. :)");

// Load in some of the basic pieces.
const Database = require("./database");
const bus = require("./event-bus");

// Load our initial config.
var configObj = require("./config");
configObj.loadConfig();

// Start stdin so we can trap signals.
process.stdin.resume();

// Main run function.
(async () => {
  // Run any migrations
  await Database.runMigrations();

  // Run any migration scripts.
  let migrations = require("./MigrationScripts");
  migrations.run(configObj.getConfig(), Database);

  // Load the database into the config instance.
  configObj.initalizeDatabaseConfig(Database);

  // Holds all our core instances.
  let instances = [];

  // Push database in here so that it has a clean shutdown.
  instances.push(Database);

  // Loop and load all the core libraries.
  glob(__dirname + "/Core/**.js", null, (er, files) => {
    files.forEach(async (file) => {
      // Create name from file.
      let name = file.split(/[\\/]/).pop().replace(".js", "").toLowerCase();

      let instance = require(file);
      if (instance.run) {
        // Start core lib.
        instance.run();

        // Add event bus entries for these.
        bus.on(name + ".reload", () => instance.reload());
        bus.on(name + ".shutdown", () => instance.shutdown());

        // Add it to the instances.
        instances.push(instance);
      }
    });
  });

  // This handles gracefully shutting down.
  async function shutdown(signal) {
    logger.info(`Shutting down.`);
    for (const instance of instances) {
      await instance.shutdown();
    }

    logger.info("Goodbye!");
    process.exit(0);
  }

  // This handles reloading the running config.
  async function reload(signal) {
    logger.info(`Received ${signal}. Reloading.`);
    for (const instance of instances) {
      if (instance.reload) {
        await instance.reload();
      }
    }
  }

  // Check signals for shutdown and reload.
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  process.on('SIGHUP', reload);

  // Check bus for shutdown and reload.
  bus.on("reload", reload);
  bus.on("shutdown", shutdown);
})();
