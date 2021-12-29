'use strict';

const { Sequelize, DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable("buttons", {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      date_created: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      date_updated: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      pin: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      servo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      default_feed_size: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('buttons');
  }
};
