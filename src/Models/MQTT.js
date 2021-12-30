const { Sequelize, Model } = require("sequelize");
let sequelize = require('../sequelize');

class MQTT extends Model {}

MQTT.init({
  event: Sequelize.STRING,
  servo_id: Sequelize.INTEGER,
  default_feed_size: Sequelize.INTEGER
}, {
  sequelize,
  modelName: "mqtt",
  tableName: "mqtt",
  updatedAt: "date_updated",
  createdAt: "date_created"
});

module.exports = MQTT;
