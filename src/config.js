const commandLineArgs = require("command-line-args");
const fs = require("fs");
const ini = require("ini");
const log4js = require("log4js");
const { boolean } = require('boolean');

let logger = log4js.getLogger("Config");
logger.level = "debug";

class Config {
  // Define a default config.
  config = {
    general: {
      database: "petfeedd.db",
    },
  };

  loadConfig() {
    // Parse any command line args.
    const args = commandLineArgs([
      { name: "config", alias: "c", type: String },
      { name: "database", alias: "d", type: String }
    ]);

    // Try to load from the environment.
    for (const [key, value] of Object.entries(process.env)) {
      if (key.substr(0, 9) == "petfeedd") {
        var keys = key.split("_", 2);
        keys.shift();
        config[keys[0]][keys[1]] = value;
      }
    }

    // Try to load from config.
    var config_loaded = false;
    if (args.config) {
      if (fs.existsSync(args.config)) {
        this.config = ini.parse(fs.readFileSync(args.config, "utf-8"));
        config_loaded = true;
      }

      // If we weren't given a config, check for some common locations on *NIX
      // systems.
    } else {
      var commonLocations = [
        "./petfeedd.conf",
        "/etc/petfeedd.conf",
        "/usr/local/etc/petfeedd.conf",
      ];

      for (const i in commonLocations) {
        if (commonLocations.hasOwnProperty(i)) {
          const location = commonLocations[i];
          if (fs.existsSync(location)) {
            logger.info("Config file found at " + location);
            logger.info("Parsing configuration.");
            this.config = ini.parse(fs.readFileSync(location, "utf-8"));
            config_loaded = true;
            break;
          }
        }
      }
    }

    // Warn if we don't have a config file.
    if (!config_loaded) {
      logger.info(
        "No config file specified. Proceeding with defaults and environment."
      );
    }

    if (args.database) {
      if (!fs.existsSync(args.database)) {
        logger.warn("Database was specified but does not exist. It may be created.");
      }

      this.config.general.database = args.database;
    }
  }

  initalizeDatabaseConfig(database) {
    this.database = database;
  }

  async getConfigEntries(namespace) {
    let Setting = this.database.modelFactory("Setting");
    let settings = await Setting.findAll({
      where: {
        namespace: namespace
      }
    });

    let retSettings = {};

    for (const setting of settings) {
      switch (setting.type) {
        case "bool":
          retSettings[setting.key] = boolean(setting.value);
          break;

        case "number":
        case "int":
          retSettings[setting.key] = parseInt(setting.value);
          break;

        default:
          retSettings[setting.key] = setting.value;
      }
    }

    return retSettings;
  }

  async getConfigEntry(namespace, key) {
    let Setting = this.database.modelFactory("Setting");
    let setting = await Setting.findOne({
      where: {
        namespace: namespace,
        key: key
      }
    });

    if (setting) {
      return setting.value;
    }

    if (this.config[namespace] && this.config[namespace][key]) {
      return this.config[namespace][key];
    }

    return undefined;
  }

  getConfig() {
    return this.config;
  }
}

module.exports = new Config();
