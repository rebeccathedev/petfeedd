const Sequelize = require("sequelize");

module.exports = function(sequelize) {
  return sequelize.define('settings', {
    key: Sequelize.STRING,
    value: Sequelize.STRING,
  });
}
