const { Sequelize, Model } = require("sequelize");
let sequelize = require('../sequelize');

class Servo extends Model {}

Servo.init({
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
