const db = require('../connection')

const addListing = function (listing) {
  console.log(listing)
  const queryString = 'INSERT INTO listings (title, photo_url, description, price, sold) VALUES ($1, $2, $3, $4, false) RETURNING *'
  return db.query(queryString, [listing.title, listing.photoUrl, listing.description, listing.price])
      .then(res => {
        console.log('addListing')
        console.log(res.rows[0])
        return res.rows[0];
      })
      .catch(err => {
        console.log(err.message)
      })
}

module.exports = { addListing };
