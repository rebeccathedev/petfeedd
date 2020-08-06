const Sequelize = require("sequelize");

module.exports = function(sequelize) {
  return sequelize.define('feed_event', {
    name: Sequelize.STRING,
    size: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  });
}
