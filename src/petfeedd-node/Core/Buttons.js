const database = require("../database");
const Library = require("./Library");
const Gpio = require('pigpio').Gpio;

class Buttons extends Library {
  constructor(database) {
    super();
    this.database = database;
    this.buttons = [];
  }

  async run() {
    this.logger.info("Starting Buttons.");

    let Button = this.database.modelFactory("Button");
    let Servo = this.database.modelFactory("Servo");
    let buttons = await Button.findAll();

    for (const i in buttons) {
      if (Object.hasOwnProperty.call(buttons, i)) {
        const button = buttons[i];
        try {
          const gpioObj = new Gpio(button.pin, {
            mode: Gpio.INPUT,
            pullUpDown: Gpio.PUD_DOWN,
            edge: Gpio.EITHER_EDGE
          });

          gpioObj.on("interrupt", async level => {
            let servo = await Servo.findByPk(listener.servo_id);

            bus.emit("feed", {
              pin: servo.pin,
              time: servo.feed_time,
              size: button.default_feed_size,
              name: "Button",
              onDemand: true,
            });
          });

          button.gpio = gpioObj.off

          this.buttons.push(button);
        } catch (error) {
          this.logger.error("Could not initialize GPIO.");
        }
      }
    }
  }

  async reload() {
    this.logger.info("Reloading Buttons.");
    for (const button of this.buttons) {
      button.gpio.off("interrupt");
    }
    this.run();
  }
}

module.exports = new Buttons(database);
