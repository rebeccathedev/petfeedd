"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.addColumn("feed", "servo_id", {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
      after: "id",
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropColumn("feed", "servo_id");
  },
};
