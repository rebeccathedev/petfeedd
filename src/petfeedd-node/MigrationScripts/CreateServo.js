const MigrationScript = require("./MigrationScript");

class CreateServo extends MigrationScript {
  async migrate() {
    let Servo = this.database.modelFactory("Servo");
    if (await Servo.count() == 0) {
      console.log("Migrating from config to database servo control.");
      Servo.create({
        name: "Default",
        pin: this.config.gpio.servo_pin,
        feed_time: this.config.gpio.servo_feed_time
      });
    }
  }
}

module.exports = CreateServo;
