const MigrationScript = require("./MigrationScript");

class CreateDefaultSettings extends MigrationScript {
  async migrate() {
    let Setting = this.database.modelFactory("Setting");
    console.log("Checking that database configuration is up to date.");
    let settings = [
      {
        namespace: "general",
        key: "name",
        type: "string",
        value: "petfeedd"
      },
      {
        namespace: "general",
        key: "paused",
        type: "bool",
        value: 0
      },
      {
        namespace: "bonjour",
        key: "enable",
        type: "bool",
        value: 1
      },
      {
        namespace: "mqtt",
        key: "enable",
        type: "bool",
        value: 0
      },
      {
        namespace: "mqtt",
        key: "server",
        type: "string",
        value: ""
      },
      {
        namespace: "mqtt",
        key: "broadcast_event",
        type: "string",
        value: ""
      }
    ];

    for (const setting of settings) {
      var found = await Setting.findAll({
        where: {
          namespace: setting.namespace,
          key: setting.key
        }
      });

      if (found.length == 0) {
        Setting.create(setting);
      }
    }
  }
}

module.exports = CreateDefaultSettings;
