const mqtt = require("mqtt");
const database = require("../database");
const bus = require("../event-bus");

const Library = require("./Library");

class MQTT extends Library {
  constructor(database) {
    super();
    this.database = database;
  }

  async run() {
    this.logger.info("Starting up.");
    const Setting = this.database.modelFactory("Setting");
    const MQTTModel = this.database.modelFactory("MQTT");
    const Servo = this.database.modelFactory("Servo");

    let settings = await Setting.findAll({
      where: {
        namespace: "mqtt",
      },
    });

    this.settingsObj = {};

    for (const i in settings) {
      if (Object.hasOwnProperty.call(settings, i)) {
        const setting = settings[i];
        this.settingsObj[setting.key] = setting.value;
      }
    }

    if (this.settingsObj.enable && this.settingsObj.server) {
      this.client = mqtt.connect(this.settingsObj.server);

      this.client.on("connect", async () => {
        let listeners = await MQTTModel.findAll();

        listeners.forEach((listener) => {
          this.client.subscribe(listener.event, (err) => {
            this.client.on("message", async (topic, message) => {
              this.logger.info("Received MQTT message. Dispensing feed.");
              let servo = await Servo.findByPk(listener.servo_id);

              bus.emit("feed", {
                pin: servo.pin,
                time: servo.feed_time,
                size: listener.default_feed_size,
                name: "MQTT",
                onDemand: true,
              });
            });
          });
        });
      });
    }
  }

  publish(size) {
    if (
      this.settingsObj.enable &&
      this.settingsObj.feed_event_name &&
      this.client
    ) {
      if (typeof size != "string") {
        size = size.toString();
      }

      this.client.publish(this.settingsObj.feed_event_name, size);
    }
  }

  async shutdown() {
    this.logger.info("Shutting down.");
    if (this.client) {
      await this.client.end();
    }
  }
}

module.exports = new MQTT(database);
