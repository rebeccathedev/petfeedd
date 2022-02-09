const MigrationScript = require("./MigrationScript");

class CreateDefaultSettings extends MigrationScript {
  async migrate() {
    let Setting = this.database.modelFactory("Setting");
    this.logger.info("Checking that database configuration is up to date.");
    let settings = require('../Data/Settings');

    for (const namespace in settings) {
      if (Object.hasOwnProperty.call(settings, namespace)) {
        const keyVals = settings[namespace];

        for (const key in keyVals) {
          if (Object.hasOwnProperty.call(keyVals, key)) {
            const setting = keyVals[key];

            var found = await Setting.findAll({
              where: {
                namespace: namespace,
                key: key
              }
            });

            if (found.length == 0) {
              let newSetting = JSON.parse(JSON.stringify(setting));
              newSetting.key = key;
              newSetting.namespace = namespace;

              await Setting.create(newSetting);
            }
          }
        }
      }
    }
  }
}

module.exports = CreateDefaultSettings;
