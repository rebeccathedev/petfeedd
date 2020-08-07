"use strict";
const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable(
      "setting",
      {
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
        key: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        value: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        indexes: [
          {
            unique: true,
            fields: ["key"],
          },
        ],
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropTable("setting");
  },
};
