const express = require("express");
const router = express.Router();
const { getUserByUsername, getUserById, getUsers } = require("../helpers");

const { addListing } = require("../db/queries/create")

// Creating a new listing and redirect back to /listings page
router.post("/", (req, res) => {
  console.log('route post /')
  console.log(req.body)
  addListing(req.body)
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
