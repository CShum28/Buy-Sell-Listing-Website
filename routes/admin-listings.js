const express = require("express");
const router = express.Router();

const { getUserByUsername, getAdminListings  } = require("../helpers");

router.get("/", async (req, res) => {
  // Getting user info
  const username = req.session.username;
  const user = await getUserByUsername(username);

  // Getting all of the user's listings
  const adminListings = await getAdminListings(user.id);
  console.log(adminListings)
  //Use the listing page to show all of their listings
  res.render('listingpage', { user: user, listings: adminListings })
})

module.exports = router;
