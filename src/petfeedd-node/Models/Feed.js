const { Sequelize, Model } = require("sequelize");

module.exports = function (sequelize) {
  class Feed extends Model {}

  Feed.init({
    time: Sequelize.TIME,
    servo_id: Sequelize.INTEGER,
    name: Sequelize.STRING,
    size: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    feed_count: Sequelize.BIGINT,
    last_feed: Sequelize.DATE,
    next_feed: Sequelize.DATE,
  }, {
    sequelize,
    modelName: "feed",
    tableName: "feed",
    updatedAt: "date_updated",
    createdAt: "date_created"
  });

  return Feed;
}