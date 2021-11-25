const mqtt = require("mqtt");
const database = require("./database");
const bus = require("./event-bus");

class MQTT {
  async run() {
    const Setting = database.modelFactory("Setting");
    const MQTTModel = database.modelFactory("MQTT");
    const Servo = database.modelFactory("Servo");

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
              console.log("Received MQTT message. Dispensing feed.");
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

  reconfigure() {
    this.client.end();
    this.run();
  }
}

module.exports = new MQTT();
