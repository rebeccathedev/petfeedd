const MigrationScript = require("./MigrationScript");

class CreateDefaultSettings extends MigrationScript {
  async migrate() {
    let Setting = this.database.modelFactory("Setting");
    this.logger.info("Checking that database configuration is up to date.");
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
      },
      {
        namespace: "twitter",
        key: "enable",
        type: "bool",
        value: 0
      },
      {
        namespace: "twitter",
        key: "consumer_key",
        type: "string",
        value: ""
      },
      {
        namespace: "twitter",
        key: "consumer_secret",
        type: "string",
        value: ""
      },
      {
        namespace: "twitter",
        key: "access_token_key",
        type: "string",
        value: ""
      },
      {
        namespace: "twitter",
        key: "access_token_secret",
        type: "string",
        value: ""
      },
      {
        namespace: "twitter",
        key: "message_format",
        type: "string",
        value: "{feeder_name} dispensed {feed_event.size} feeds at {feed_event.date_created}"
      },
      {
        namespace: "email",
        key: "enable",
        type: "bool",
        value: 0
      },
      {
        namespace: "email",
        key: "secure",
        type: "bool",
        value: 1
      },
      {
        namespace: "email",
        key: "from",
        type: "string",
        value: ""
      },
      {
        namespace: "email",
        key: "from_address",
        type: "string",
        value: ""
      },
      {
        namespace: "email",
        key: "subject",
        type: "string",
        value: ""
      },
      {
        namespace: "email",
        key: "to",
        type: "string",
        value: ""
      },
      {
        namespace: "email",
        key: "server",
        type: "string",
        value: ""
      },
      {
        namespace: "email",
        key: "port",
        type: "number",
        value: 25
      },
      {
        namespace: "email",
        key: "username",
        type: "string",
        value: ""
      },
      {
        namespace: "email",
        key: "password",
        type: "string",
        value: ""
      },
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
