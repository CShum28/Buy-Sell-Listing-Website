const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const cookieSession = require("cookie-session");
const { getUserByUsername, getUserById, getUsers } = require("../helpers");
// const { addListing } = require("../db/queries/create");

// res.render("listingpage", { listings: listings, user: user });

const pool = new Pool({
  user: process.env.DB_USER,
  host: "localhost",
  database: "midterm", //
  password: "labber", // Default password
});

router.post("/", async (req, res) => {
  // Get the username of the currently logged-in user from the session
  const username = req.session.username;
  // Retrieve the user object from the database based on the username
  const user = await getUserByUsername(username);

  // Get the ID of the item to be deleted from the request body
  const itemID = req.body["itemID"];
  // Get the ID of the currently logged-in user
  const userID = user.id;
  // console.log(userID);

  try {
    // Connect to the PostgreSQL database
    const client = await pool.connect();

    // Check if the item to be deleted exists in the listings table
    const selectItem = "SELECT user_id FROM listings WHERE id = $1";
    const result = await client.query(selectItem, [itemID]);

    // If the item is not found in the listings table, return a 404 error
    if (result.rows.length === 0) {
      res.status(404).send("Item not found.");
      return;
    }

    // Get the user ID of the item's owner
    const itemUserID = result.rows[0].user_id;

    // If the current user is not the owner of the item, return a 401 error
    if (itemUserID !== userID) {
      res.status(401).send("Unauthorized access!");
      return;
    }
    console.log("trying to delete");
    // Mark the item as deleted in the listings table
    const deleteItem = "UPDATE listings SET deleted = true WHERE id = $1";
    await client.query(deleteItem, [itemID]);

    // Send a success message to the client
    res.send("Successfully deleted!");
  } catch (err) {
    // If there's an error, log it to the console and return a 500 error
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
