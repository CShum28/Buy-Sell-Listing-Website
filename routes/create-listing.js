const express = require("express");
const router = express.Router();
const { getUserByUsername, getUserById, getUsers, getUserId } = require("../helpers");

const { addListing } = require("../db/queries/create")

// Creating a new listing and redirect back to /listings page
router.post("/", async (req, res) => {
  // using the user name from req.session(cookies)
  const username = req.session.username;
  // fetching the user_id and using it inside of addListings
  // attaching user_id to a specific listing
  const user_id = await getUserId(username);
  addListing(req.body, user_id)
    .then( info =>{
      console.log('info');
      console.log(info);
      res.redirect('/listings')
    })
    .catch(err => {
      console.log(err.message)
    })
});

router.get("/", async (req, res) => {
  const username = req.session.username;
  const user = await getUserByUsername(username);
  res.render("create-listing", { user: user })
})

module.exports = router;
