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

router.post("/", async (res, req) => {
  const username = req.session.username;
  const user = await getUserByUsername(username);
  console.log(user.id);
  // console.log(req.body);

  const itemID = req.body["itemID"];
  const userID = user.id;
  try {
    const client = await pool.connect();
    const deleteItem = "UPDATE listings SET deleted = true WHERE id = $1";
    await client.query(deleteItem, [itemID]);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});
