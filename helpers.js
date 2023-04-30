const { Pool } = require("pg");
const database = require("./db/connection");


//Get user by username
const getUserByUsername = function (username) {
    return database
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((result) => {
      console.log(result.rows[0][username]);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

getUserByUsername("jp");

module.exports = { getUserByUsername };
