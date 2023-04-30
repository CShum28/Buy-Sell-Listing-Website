// PG database client/connection setup
const { Pool } = require("pg");
require("dotenv").config();
const dbParams = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  database: process.env.DB_NAME,
};

const database = new Pool(dbParams);

module.exports = { database };
