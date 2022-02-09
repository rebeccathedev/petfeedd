const { Sequelize, Model } = require("sequelize");
let sequelize = require('../sequelize');

class Servo extends Model {
  startSpin(gpio) {
    switch (this.type) {
      case 'raw':
        gpio.digitalWrite(true);
        break;

      default:
        gpio.servoWrite(2500);
        break;
    }
  }

  stopSpin(gpio) {
    switch (this.type) {
      case 'raw':
        gpio.digitalWrite(false);
        break;

      default:
        gpio.servoWrite(0);
        break;
    }
  }
}

Servo.init({
  type:  Sequelize.STRING,
  name: Sequelize.STRING,
  pin: Sequelize.INTEGER,
  feed_time: {
    type: Sequelize.DOUBLE,
    defaultValue: 0
  }
}, {
  sequelize,
  modelName: "servo",
  tableName: "servo",
  updatedAt: "date_updated",
  createdAt: "date_created"
});

module.exports = Servo;
