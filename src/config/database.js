const { Sequelize } = require("sequelize");
const dbConfig = require("./db.config");

const environment = process.env.NODE_ENV || "development";

const config = dbConfig[environment];

if (!config) {
  throw new Error(`Invalid database environment: ${environment}`);
}

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,

    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

module.exports = sequelize;
