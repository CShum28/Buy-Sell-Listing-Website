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
  };
  res.render("listingpage");
});

module.exports = router;
