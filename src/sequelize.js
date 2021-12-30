const { Sequelize } = require("sequelize");
const config = require("./config").getConfig();
const log4js = require("log4js");

let logger = log4js.getLogger("Database");
logger.level = "debug";

module.exports = new Sequelize("petfeedd", null, null, {
  host: "localhost",
  dialect: "sqlite",

  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },

  logging: (msg) => {
    logger.debug(msg);
  },

  storage: config.general.database,
});
