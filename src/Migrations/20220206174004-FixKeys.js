'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex("setting", ["key"]);
    await queryInterface.addIndex("setting", ["namespace", "key"], {
      unique: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex("setting", ["namespace_key"]);
    await queryInterface.addIndex("setting", ["key"], {
      unique: true
    });
  }
};
