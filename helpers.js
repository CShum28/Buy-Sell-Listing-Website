const { Pool } = require("pg");
const { database } = require("./db/connection");
const express = require("express");
const router = express.Router();

/*
JP's note
Please don't touch this file. I will come to it tomorrow.

*/

//Get user by username
const getUserByUsername = async function (username) {
  return await database
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((result) => {
      return result.rows[0];
    })
    .catch((error) => {
      console.error(error);
    });
};

const getUserById = async (id) => {
  return database
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((data) => {
      return data.rows;
    })
    .catch((error) => {
      console.error(error);
    });
};

const getUsers = async () => {
  return await database
    .query("SELECT * FROM users;")
    .then((data) => {
      // console.log(data.rows);
      return data.rows;
    })
    .catch((error) => {
      console.error(error);
    });
};

// Get listing information

const getListingInfo = async (listing) => {
  return await database
  .query(`SELECT * FROM listings WHERE title = $1;`, [listing])
  .then(res => {
    return res.rows[0]
  })
  .catch(err => console.log(err.message));
}

// Get user id

const getUserId = async (username) => {
  return database
    .query(`SELECT id FROM users WHERE username = $1`, [username])
    .then((data) => {
      console.log(data.rows[0])
      return data.rows[0].id;
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = { getUserByUsername, getUserById, getUsers, getListingInfo, getUserId  };
