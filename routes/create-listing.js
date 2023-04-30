const express = require("express");
const router = express.Router();

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

router.get("/", (req, res) => {
  res.render("create-listing");
})

module.exports = router;
