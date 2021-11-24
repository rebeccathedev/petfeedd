'use strict';

const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.addColumn("setting", "namespace", {
      type: DataTypes.STRING,
      allowNull: false,
      after: "id",
      defaultValue: 'general'
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropColumn("setting", "namespace");
  }
};
