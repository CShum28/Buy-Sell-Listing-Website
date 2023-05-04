const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const cookieSession = require("cookie-session");
const { database } = require("../db/connection");

//Clement added this
const { getUserByUsername, getUserById, getUsers } = require("../helpers");

router.get("/", async (req, res) => {
  try {
    // Get a client frmo connection pool
    const client = await database.connect();

    // SQL query on the 'listings' table using the client that was retrieved from the pool. Await means asynchronous.
    const result = await client.query(
      "SELECT * FROM listings WHERE deleted = false OR deleted IS NULL"
    );

    // grab ONLY the rows from the query and jams it into the listings variable
    const listings = result.rows;

    // Release the client. Need to use release instead of pool.end(), caused lots of problems!
    client.release();
    // console.log(listings);

    // Render the listings page and pass the listings variable into it!

    // Clement added this
    const username = req.session.username;
    const user = await getUserByUsername(username);
    // console.log(user);
    res.render("listingpage", { listings: listings, user: user });
  } catch (err) {
    // If error, log the error to the console
    console.error(err);
    res.send("Error: " + err);
  }
});

router.get("/search", async (req, res) => {
  try {
    // Get a client frmo connection pool
    const client = await database.connect();
    const min = req.query.min * 100;
    const max = req.query.max * 100;

    // SQL query on the 'listings' table using the client that was retrieved from the pool. Await means asynchronous.
    const result = await client.query(
      `SELECT * FROM listings WHERE price >= $1 AND price <= $2`,
      [min, max]
    );

    // grab ONLY the rows from the query and jams it into the listings variable
    const listings = result.rows;

    // Release the client. Need to use release instead of pool.end(), caused lots of problems!
    client.release();
    console.log(listings);

    // Render the listings page and pass the listings variable into it!

    // Clement added this
    const username = req.session.username;
    const user = await getUserByUsername(username);

    res.render("listingpage", { listings: listings, user: user });
  } catch (err) {
    // If error, log the error to the console
    console.error(err);
    res.send("Error: " + err);
  }
});

module.exports = router;
