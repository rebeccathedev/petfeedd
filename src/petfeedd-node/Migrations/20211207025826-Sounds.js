'use strict';

const { Sequelize, DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable("sounds", {
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
      sound: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      event: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sounds');
  }
};
