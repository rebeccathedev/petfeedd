const { Sequelize, Model } = require("sequelize");

module.exports = function(sequelize) {
  class Setting extends Model {}

  Setting.init({
    key: Sequelize.STRING,
    value: Sequelize.STRING,
  }, {
    sequelize,
    modelName: "setting",
    tableName: "setting",
    updatedAt: "date_updated",
    createdAt: "date_created"
  });

  return Setting
}
