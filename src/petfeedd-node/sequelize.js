const { Sequelize } = require("sequelize");
const config = require("./config").getConfig();

module.exports = new Sequelize("petfeedd", null, null, {
  host: "localhost",
  dialect: "sqlite",

  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },

  storage: config.general.database,
});
