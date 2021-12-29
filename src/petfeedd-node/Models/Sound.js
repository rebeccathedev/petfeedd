const { Sequelize, Model } = require("sequelize");
let sequelize = require('../sequelize');

class Sound extends Model {}

Sound.init({
  sound: Sequelize.STRING,
  event: Sequelize.STRING,
}, {
  sequelize,
  modelName: "sound",
  tableName: "sounds",
  updatedAt: "date_updated",
  createdAt: "date_created"
});

module.exports = Sound;
