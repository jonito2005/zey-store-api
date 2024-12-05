const { Sequelize } = require('sequelize');
const { DB_CONFIG } = require('./config');

const sequelize = new Sequelize(
  DB_CONFIG.database,
  DB_CONFIG.username,
  DB_CONFIG.password,
  {
    host: DB_CONFIG.host,
    dialect: 'mysql',
    logging: false,
  }
);

module.exports = sequelize;