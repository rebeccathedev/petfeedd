const { Sequelize, Model } = require("sequelize");
let sequelize = require('../sequelize');

class Feed extends Model {}

Feed.init({
  time: Sequelize.TIME,
  servo_id: Sequelize.INTEGER,
  name: Sequelize.STRING,
  size: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  feed_count: {
    type: Sequelize.BIGINT,
    defaultValue: 0
  },
  last_feed: Sequelize.DATE,
}, {
  sequelize,
  modelName: "feed",
  tableName: "feed",
  updatedAt: "date_updated",
  createdAt: "date_created"
});

module.exports = Feed;
