// const db = require('../connection')
const { database } = require("../connection");

const addListing = async function (listing, userId) {
  console.log(listing)

  const queryString = 'INSERT INTO listings (user_id, title, photo_url, description, price, sold) VALUES ($1, $2, $3, $4, $5, false) RETURNING *'
  return database.query(queryString, [userId, listing.title, listing.photoUrl, listing.description, listing.price])
      .then(res => {
        console.log('addListing')
        console.log(res.rows[0])
        // database.end(); //end pool - close the database
        return res.rows[0];
      })
      .catch(err => {
        console.log(err.message)
      })
}

module.exports = { addListing };
