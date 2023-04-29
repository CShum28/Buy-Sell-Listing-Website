const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const { addListing } = require("../db/queries/create");
const $ = require("../public/vendor/jquery-3.0.0.js");
// const favourites = require("./routes/favourites.js");

// Create the connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: "localhost",
  database: "midterm", //
  password: "labber", // Default password
});

router.get("/", async (req, res) => {
  try {
    // Get a client frmo connection pool
    const client = await pool.connect();

    // SQL query on the 'listings' table using the client that was retrieved from the pool. Await means asynchronous.
    const result = await client.query("SELECT * FROM listings");

    // grab ONLY the rows from the query and jams it into the listings variable
    const listings = result.rows;

    // Release the client. Need to use release instead of pool.end(), caused lots of problems!
    client.release();
    // console.log(listings);

    // Render the listings page and pass the listings variable into it!
    res.render("listingpage", { listings: listings });
  } catch (err) {
    // If error, log the error to the console
    console.error(err);
    res.send("Error: " + err);
  }
});

router.get("/search", async (req, res) => {
  try {
    // Get a client frmo connection pool
    const client = await pool.connect();
    const min = req.query.min;
    const max = req.query.max;

    // SQL query on the 'listings' table using the client that was retrieved from the pool. Await means asynchronous.
    const result = await client.query(`SELECT * FROM listings WHERE price <= $1 AND price >= $2`, [min, max]);

    // grab ONLY the rows from the query and jams it into the listings variable
    const listings = result.rows;

    // Release the client. Need to use release instead of pool.end(), caused lots of problems!
    client.release();
    console.log(listings);

    // Render the listings page and pass the listings variable into it!
    res.render("listingpage", { listings: listings });
  } catch (err) {
    // If error, log the error to the console
    console.error(err);
    res.send("Error: " + err);
  }
});



module.exports = router;
