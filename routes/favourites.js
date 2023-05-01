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
  const username = req.session.username;
  const user = await getUserByUsername(username);
  console.log(user.id);
  // console.log(req.body);

  const itemID = req.body["itemID"];
  const userID = user.id;
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

router.get("/", async (req, res) => {
  const username = req.session.username;
  const user = await getUserByUsername(username);

  res.render("listingpage", { listings: listings, user: user });
});

module.exports = router;
