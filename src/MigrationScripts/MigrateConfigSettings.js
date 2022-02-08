const MigrationScript = require("./MigrationScript");
const defaultSettings = require('../Data/Settings');

class MigrateConfigSettings extends MigrationScript {
  async migrate() {
    // Migrate the servo first if we have it.
    let Servo = this.database.modelFactory("Servo");
    if (await Servo.count() == 0 && this.config.gpio) {
      this.logger.info("Migrating from config to database servo control.");
      Servo.create({
        name: "Default",
        pin: this.config.gpio.servo_pin,
        feed_time: this.config.gpio.servo_feed_time
      });
    }

    // Map old config format to new database format.
    const migrationMap = {
      discovery: {
        namespace: 'bonjour',
        keys: {
          enabled: 'enable'
        }
      },
      emailnotifications: {
        namespace: 'email',
        keys: {
          enabled: 'enable',
          from: 'from',
          from_address: 'from_address',
          to: 'to',
          subject: 'subject',
          server: 'server',
          port: 'port',
          username: 'username',
          password: 'password'
        }
      },
      general: {
        namespace: 'general',
        keys: {
          name: 'name'
        }
      },
      twitternotifications: {
        namespace: 'twitter',
        keys: {
          enabled: 'enable',
          consumer_key: 'consumer_key',
          consumer_secret: 'consumer_secret',
          access_key: 'access_token_key',
          access_secret: 'access_token_secret'
        }
      },
      web: {
        namespace: 'web',
        keys: {
          bind_address: 'address',
          bind_port: 'port'
        }
      }
    }

    let Setting = this.database.modelFactory("Setting");
    for (const namespace in migrationMap) {
      if (Object.hasOwnProperty.call(migrationMap, namespace)) {
        const migrationPlan = migrationMap[namespace];
        const newNamespace = migrationPlan.namespace;

        for (const oldKey in migrationPlan.keys) {
          if (Object.hasOwnProperty.call(migrationPlan.keys, oldKey)) {
            const newKey = migrationPlan.keys[oldKey];

            let existingVal = await Setting.findAll({
              where: {
                namespace: newNamespace,
                key: newKey
              }
            });

            if (!existingVal.length && this.config[namespace] && this.config[namespace][oldKey]) {
              this.logger.info(`Migrating old ${namespace}.${oldKey} to new ${newNamespace}.${newKey}.`);

              var setting = JSON.parse(JSON.stringify(defaultSettings[newNamespace][newKey]));
              setting.key = newKey;
              setting.namespace = newNamespace;
              setting.value = this.config[namespace][oldKey];
              await Setting.create(setting);
            }
          }
        }
      }
    }
  }
}

module.exports = MigrateConfigSettings;
