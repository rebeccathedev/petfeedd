const { Sequelize, Model } = require("sequelize");
let sequelize = require('../sequelize');

class Button extends Model {}

Button.init({
  pin: Sequelize.INTEGER,
  servo_id: Sequelize.INTEGER,
  default_feed_size: Sequelize.INTEGER
}, {
  sequelize,
  modelName: "button",
  tableName: "buttons",
  updatedAt: "date_updated",
  createdAt: "date_created"
});

module.exports = Button;
