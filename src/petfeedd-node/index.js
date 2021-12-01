console.log("petfeedd is starting up. :)");

const glob = require("glob");
const Database = require("./database");
const bus = require('./event-bus');

// Load our initial config.
var configObj = require("./config");
configObj.loadConfig();

(async () => {
  // Run any migrations
  await Database.runMigrations();

  // Run any migration scripts.
  let migrations = require("./MigrationScripts");
  migrations.run(configObj.getConfig(), Database);

  // Load the database into the config instance.
  configObj.initalizeDatabaseConfig(Database);

  // Loop and load all the core libraries.
  glob(__dirname + "/Core/**.js", null, (er, files) => {
    files.forEach(async file => {
      // Create name from file.
      let name = file.split(/[\\/]/).pop().replace(".js", "").toLowerCase();

      let enabled = await configObj.getConfigEntry(name, "enable") ?? true;
      let instance = require(file);
      if (enabled && instance.run) {

        // Start core lib.
        instance.run();

        // Add event bus entries for these.
        bus.on(name + ".reload", () => instance.reload());
        bus.on(name + ".shutdown", () => instance.shutdown());
      }
    });
  });
})();
