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
      // console.log(data.rows[0])
      return data.rows[0].id;
    })
    .catch((error) => {
      console.error(error);
    });
};

// Get messages between based on user and listing

const messagesBetweenUserAndAdmin = async (senderId, receiverId, listingId) => {
  return database
  .query(`SELECT * FROM messages WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1) AND listing_id = $3`, [senderId, receiverId, listingId])
  .then(res => {
    return res.rows;
  })
  .catch(err => console.log(err.message))
}

// USE THIS FUNCTION TO GET THE sender_id
const getMessagesOnListing = async (user, listing) => {
  return database
  // ORIGINAL
  .query(`SELECT * FROM messages WHERE sender_id = $1 AND listing_id = $2`, [user, listing])
  // .query(`SELECT * FROM messages WHERE (sender_id = $1 OR sender_id = $2) AND (receiver_id = $1 OR receiver_id =$2) AND listing_id = $3`, [sender_id, receiver_id, listing_id])
  .then(data => {
    // console.log(data.rows)
    return data.rows;
  })
  .catch(err => console.log(err.message))
}

// Get all of admin's listings

const getAdminListings = async (user) => {
  return database
  .query(`SELECT * FROM listings WHERE user_id = $1`, [user])
  .then(res => {
    return res.rows;
  })
  .catch(err => console.log(err.message))
}

// Get each user who messaged for the listing

const getEachMessageForListing = async (receiverId, listingId) => {
  return database
  .query(`SELECT * FROM messages WHERE receiver_id = $1 AND listing_id = $2`, [receiverId, listingId])
  .then(res => {
    return res.rows;
  })
  .catch(err => console.log(err.message))
}

module.exports = {
  getUserByUsername,
  getUserById,
  getUsers,
  getListingInfo,
  getUserId,
  getMessagesOnListing,
  getAdminListings,
  getEachMessageForListing,
  messagesBetweenUserAndAdmin
};

