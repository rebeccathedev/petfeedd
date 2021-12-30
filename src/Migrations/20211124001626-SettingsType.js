'use strict';

const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.addColumn("setting", "type", {
      type: DataTypes.STRING,
      allowNull: false,
      after: "namespace",
      defaultValue: 'string'
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropColumn("setting", "type");
  }
};
