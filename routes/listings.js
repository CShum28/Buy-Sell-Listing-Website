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

// you should not be creating a new connection everytime you call a route
// you should create a connection and then export it

// Creating a new listing and redirect back to /listings page
router.post("/", (req, res) => {
  console.log("route post /");
  console.log(req.body);
  addListing(req.body)
    .then((info) => {
      console.log("info");
      console.log(info);
      res.redirect("/listings");
    })
    .catch((err) => {
      console.log(err.message);
    });
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

module.exports = router;
