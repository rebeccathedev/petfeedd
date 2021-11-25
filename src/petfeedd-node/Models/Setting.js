const { Sequelize, Model } = require("sequelize");
let sequelize = require('../sequelize');

class Setting extends Model {}

Setting.init({
  key: Sequelize.STRING,
  value: Sequelize.STRING,
  namespace: Sequelize.STRING,
  type: Sequelize.STRING
}, {
  sequelize,
  modelName: "setting",
  tableName: "setting",
  updatedAt: "date_updated",
  createdAt: "date_created"
});

module.exports = Setting;
