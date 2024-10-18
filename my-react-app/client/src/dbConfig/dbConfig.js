// src/config/dbConfig.js
const oracledb = require('oracledb');

const dbConfig = {
  user: 'Cevin',
  password: '213233963Y',
  connectString: 'localhost:1521/XE',
};

const getConnection = async () => {
  try {
    return await oracledb.getConnection(dbConfig);
  } catch (err) {
    console.error('Error connecting to the database:', err);
    throw err;
  }
};

module.exports = { getConnection };
