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
  try {
    const client = await pool.connect();
    const selectItem = "SELECT user_id FROM listings WHERE id = $1";
    const result = await client.query(selectItem, [itemID]);
    if (result.rows.length === 0) {
      res.status(404).send("Item not found.");
      return;
    }

    const itemUserID = result.rows[0].user_id;
    if (itemUserID !== userID) {
      res.status(401).semd("Unauthorized access!");
      return;
    }

    const deleteItem = "UPDATE listings SET deleted = true WHERE id = $1";
    await client.query(deleteItem, [itemID]);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});
