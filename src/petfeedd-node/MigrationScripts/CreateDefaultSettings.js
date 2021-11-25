const MigrationScript = require("./MigrationScript");

class CreateDefaultSettings extends MigrationScript {
  async migrate() {
    let Setting = this.database.modelFactory("Setting");
    if (await Setting.count() == 0) {
      console.log("Installing default database settings configuration.");
      let settings = [
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

      settings.forEach(setting => {
        console.log(setting);
        Setting.create(setting);
      });
    }
  }
}

module.exports = CreateDefaultSettings;
