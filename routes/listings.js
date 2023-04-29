const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

// Create the connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: "localhost",
  database: "midterm", //
  password: process.env.DB_PASS,
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
