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

    // SQL query to retrieve all the rows from the table titled 'listings'
    const result = await client.query('SELECT * FROM listings');

    // grab ONLY the rows
    const listings = result.rows;

    // Release the client. Need to use release instead of pool.end(), caused lots of problems!
    client.release();
  }


  res.render("listingpage");
});

module.exports = router;
