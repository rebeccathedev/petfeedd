const { Sequelize, Model } = require("sequelize");

module.exports = function(sequelize) {
  class Servo extends Model {}

  Servo.init({
    name: Sequelize.STRING,
    pin: Sequelize.INTEGER,
    size: {
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

  return Servo;
}
