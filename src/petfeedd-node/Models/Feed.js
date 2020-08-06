const Sequelize = require("sequelize");

module.exports = function(sequelize) {
  return sequelize.define('feed', {
    time: Sequelize.TIME,
    servoId: Sequelize.INTEGER,
    name: Sequelize.STRING,
    size: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    feed_count: Sequelize.BIGINT,
    last_feed: Sequelize.DATE
  });
}
