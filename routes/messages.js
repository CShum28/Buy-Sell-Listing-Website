const express = require("express");
const router = express.Router();

const { getUserByUsername, getUserById, getUsers, getListingInfo, getUserId  } = require("../helpers");
const { user } = require("pg/lib/defaults");

router.post("/:id", async(req, res) => {
  // Get the listing info
  const listingName = req.params.id;
  const listingInfo = await getListingInfo(listingName)

  // Get username of user
  const username = req.session.username;
  const user = await getUserByUsername(username)
  console.log('This is the user info:')
  console.log(user)
  console.log('This is info on this listing')
  console.log(listingInfo)
  res.render('message', {user: user, listingInfo: listingInfo })
})

router.post(`/:id/sent`, async (req, res) => {
  // checks if the user entered any info in the body
  if(!req.body.message) {
    res.status(400).json({error: 'invalid request - there is no message'})
  }

  const username = req.session.username
  const message = {
    user: username,
    content: {
      text: req.body.message
    }
  }

  const senderInfo = await getUserByUsername(req.session.username)
  console.log(senderInfo)
  const listingInfo = await getListingInfo(req.params.id)
  console.log(listingInfo)

  res.send(message)
  console.log(message)
})

module.exports = router;
