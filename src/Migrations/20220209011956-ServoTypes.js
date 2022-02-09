'use strict';

const { Sequelize, DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.addColumn("servo", "type", {
      type: DataTypes.STRING,
      defaultValue: "default",
      allowNull: false,
      after: "id",
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropColumn("servo", "type");
  }
};
