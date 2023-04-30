// PG database client/connection setup
const { Pool } = require("pg");

const dbParams = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

const database = new Pool(dbParams);

// db.connect();

const getUsers = () => {
  return database.query("SELECT * FROM users;").then((data) => {
    return data.rows;
  });
};

module.exports = { database, getUsers };
