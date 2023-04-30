const { Pool } = require("pg");
const database = require("./db/connection");

//Get user by username
const getUserByUsername = function (username) {
  return Pool.
    query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message)
    });

};

module.exports = { getUserByUsername };
