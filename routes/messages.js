const express = require("express");
const router = express.Router();

const { getUserByUsername, getUserById, getUsers, getListingInfo, getUserId, getMessagesOnListing  } = require("../helpers");
const { insertChatMessage } = require("../db/queries/messages")

router.get("/:id", async(req, res) => {
  // Get the listing info
  const listingName = req.params.id;
  const listingInfo = await getListingInfo(listingName)

  // Get username of user
  const username = req.session.username;
  const user = await getUserByUsername(username)
  console.log(listingInfo.id)
  console.log(user.id)
  // Get messages between user and listing
  const messages = await getMessagesOnListing(user.id, listingInfo.id)
  // console.log(messages)
  res.render('message', {user: user, listingInfo: listingInfo, messages: messages })
})

router.post(`/:id`, async (req, res) => {
  // checks if the user entered any info in the body
  if(!req.body.message) {
    res.status(400).json({error: 'invalid request - there is no message'})
  }

  // Get user info who is sending the message
  const senderInfo = await getUserByUsername(req.session.username)
  // Get info of listing along with the receiver of message
  const listingInfo = await getListingInfo(req.params.id)
  // Contents of the message being sent
  const messageContent = req.body.message;
  // Add a message to the message chat
  const chatMessage = await insertChatMessage(senderInfo, listingInfo, messageContent)
  console.log(chatMessage)
  // Get username of user
  const username = req.session.username;
  const user = await getUserByUsername(username)

  const messages = await getMessagesOnListing(user.id, listingInfo.id)
  res.render('message', {user: user, listingInfo: listingInfo, messages: messages })
})

module.exports = router;
