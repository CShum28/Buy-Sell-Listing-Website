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
  // console.log(req.body);

  const itemID = req.body["itemID"];
  const userID = req.body["userID"];
  // console.log(req.body);
  // console.log(itemID);
  // console.log(userID);

  try {
    const client = await pool.connect();

    // Need to check if the item is already in favourites!
    const checkIfFavourite =
      "SELECT * FROM favourites WHERE listing_id = $1 AND user_id = $2";
    const result = await client.query(checkIfFavourite, [itemID, userID]);

    // If a result is returned, it is implied that the item already exists in the favourites table.
    if (result.rows.length > 0) {
      client.release();
      res.sendStatus(200);
      return;
    }

    const insertFavourite =
      "INSERT INTO favourites (listing_id, user_id) VALUES ($1, $2)";
    await client.query(insertFavourite, [itemID, userID]);
    // client.release();
    const selectFavourites = "SELECT * FROM favourites";
    const result2 = await client.query(selectFavourites);
    console.log(result2.rows);
    client.release();
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Route to display the list of favourite listings for a specific user
router.get("/", async (req, res) => {
  // Get the username from the session
  const username = req.session.username;
  // Get the user object from the database using the username
  const user = await getUserByUsername(username);
  // Get the user ID from the user object
  const userID = user.id;

  try {
    // Connect to the database using the pool
    const client = await pool.connect();
    // Query to get the favourite listings for the user from the listings and favourites tables
    const getFavouriteListings =
      "SELECT listings.title, listings.description, listings.price FROM listings JOIN favourites ON listings.id = favourites.listing_id WHERE favourites.user_id = $1;";
    // Execute the query with the user ID parameter and get the result set
    const favouriteListingsResult = await client.query(getFavouriteListings, [
      userID,
    ]);
    // Extract the rows from the result set
    const result = favouriteListingsResult.rows;
    // console.log(result);

    // console.log(favouriteListingsResult.rows);
    // Render the listing page with the favourite listings and user object as parameters
    res.render("listingpage", {
      listings: result,
      user: user,
    });
  } catch (err) {
    console.error(err);
    // Handle errors by sending an HTTP 500 status code
    res.sendStatus(500);
  }
});

module.exports = router;
