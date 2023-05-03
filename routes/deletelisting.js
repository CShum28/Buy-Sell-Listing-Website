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

router.post("/", async (res, req) => {});
