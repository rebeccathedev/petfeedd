const Sequelize = require("sequelize");

module.exports = function(sequelize) {
  return sequelize.define('servo', {
    name: Sequelize.STRING,
    pin: Sequelize.INTEGER,
    size: {
      type: Sequelize.DOUBLE,
      defaultValue: 0
    }
  });
}
