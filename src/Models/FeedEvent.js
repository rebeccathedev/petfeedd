const { Sequelize, Model } = require("sequelize");
let sequelize = require('../sequelize');

class FeedEvent extends Model {}

FeedEvent.init(
  {
    name: Sequelize.STRING,
    size: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "feed_event",
    tableName: "feedevent",
    updatedAt: "date_updated",
    createdAt: "date_created",
  }
);

module.exports = FeedEvent;
