const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

// Create the connection pool
const pool = new Pool({
  user: "labber",
  host: "localhost",
  database: "midterm", //
  password: "123", // Default password
});

router.get("/listings", async (req, res) => {
  try {
    // Get a client frmo connection pool
    const client = await pool.connect();

    // SQL query on the 'listings' table using the client that was retrieved from the pool. Await means asynchronous.
    const result = await client.query("SELECT * FROM listings");

    // grab ONLY the rows from the query and jams it into the listings variable
    const listings = result.rows;

    // Release the client. Need to use release instead of pool.end(), caused lots of problems!
    client.release();

    // Send the listings variable as JSON response to the client.
    res.json(listings);
  } catch (err) {
    // If error, log the error to the console
    console.error(err);
    res.send("Error: " + err);
  }

  res.render("listingpage", { listings });
});

module.exports = router;
