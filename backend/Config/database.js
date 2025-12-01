const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false, // Set to console.log to see SQL queries
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(' PostgreSQL Database Connected Successfully');
    
    // Sync all models with database
    await sequelize.sync({ alter: true });
    console.log(' Database tables synchronized');
  } catch (error) {
    console.error(' Database Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
