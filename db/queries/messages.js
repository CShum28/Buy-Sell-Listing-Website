const { database } = require("../connection");

// const insertChatMessage = async (sender, listing, message) => {
const insertChatMessage = async (sender, receiverId, listing, message) => {
  const queryString = `INSERT INTO messages (sender_id, receiver_id, listing_id, content) VALUES($1, $2, $3, $4) RETURNING *`
  return database.query(queryString, [sender.id, receiverId, listing.id, message])
  // return database.query(queryString, [sender.id, listing.user_id, listing.id, message])
  .then(res => {
    console.log(res.rows)
    return res.rows[0]
  })
  .catch(err => console.log(err.message))
}

module.exports = { insertChatMessage };
