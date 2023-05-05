const express = require("express");
const router = express.Router();

const { getUserByUsername, getUserById, getUsers, getListingInfo, getUserId, getMessagesOnListing, getEachMessageForListing, messagesBetweenUserAndAdmin  } = require("../helpers");
const { insertChatMessage } = require("../db/queries/messages")

// User routes

router.get("/:id", async(req, res) => {
  // Get the listing info
  const listingName = req.params.id;
  const listingInfo = await getListingInfo(listingName)

  // Get username of user
  const username = req.session.username;
  const user = await getUserByUsername(username)

  const receiverId = req.query.senderId;
  const chatLog = await messagesBetweenUserAndAdmin(user.id, receiverId, listingInfo.id)

  res.render('message', { user, listingInfo, messages: chatLog, receiverId })
})

router.post(`/:id`, async (req, res) => {
  // checks if the user entered any info in the body
  if(!req.body.message) {
    res.status(400).json({error: 'invalid request - there is no message'})
  }
  // Get user info who is sending the message
  const senderInfo = await getUserByUsername(req.session.username)

  // Contents of the message being sent
  const messageContent = req.body.message;
  // Get info of listing along with the receiver of message
  const listingInfo = await getListingInfo(req.params.id)
  const receiverId = req.query.receiverId;

  const chatMessage = await insertChatMessage(senderInfo, receiverId, listingInfo, messageContent)
  res.redirect(`/message/${listingInfo.title}?senderId=${receiverId}`)

})

// Admin routes

router.get('/select/:id', async(req, res) => {
  // Get the listing info
  const listingName = req.params.id;
  const listingInfo = await getListingInfo(listingName)
  // console.log(listingInfo)
  // Get info of admin
  const adminInfo = await getUserByUsername(req.session.username)
  // console.log(adminInfo)
  // Get all of the messages that were sent to this listing
  const individualMessages = await getEachMessageForListing(listingInfo.user_id, listingInfo.id)
  // console.log(individualMessages)
  res.render('list-of-messengers', { user: adminInfo, listingInfo: listingInfo, messages: individualMessages })
})

module.exports = router;


// router.post(`/:id`, async (req, res) => {
//   // checks if the user entered any info in the body
//   if(!req.body.message) {
//     res.status(400).json({error: 'invalid request - there is no message'})
//   }

//   // Get user info who is sending the message
//   const senderInfo = await getUserByUsername(req.session.username)
//   // Get info of listing along with the receiver of message
//   const listingInfo = await getListingInfo(req.params.id)

//   // Contents of the message being sent
//   const messageContent = req.body.message;

//   if (!senderInfo.admin) {
//     // Add a message to the message chat
//     const chatMessage = await insertChatMessage(senderInfo, listingInfo.user_id, listingInfo, messageContent)
//     // Get username of user
//     const username = req.session.username;
//     const user = await getUserByUsername(username)

//     const messages = await getMessagesOnListing(user.id, listingInfo.id)
//     const senderId = messages[0].receiver_id;
//     const receiverId = req.query.receiverId;
//     const listingId = messages[0].listing_id;
//     const chatLog = await messagesBetweenUserAndAdmin(senderId, receiverId, listingId)
//     // res.render('message', {user: user, listingInfo: listingInfo, messages: chatLog })
//     res.redirect(`/message/${listingInfo.title}?senderId=${receiverId}`)
//   } else if (senderInfo.admin) {

//     // Get username of user
//     const username = req.session.username;
//     const user = await getUserByUsername(username)
//     // Add a message to the message chat
//     const messages = await getMessagesOnListing(user.id, listingInfo.id)
//     // console.log('messages')
//     // console.log(messages)
//     const senderId = messages[0].receiver_id;
//     const receiverId = req.query.receiverId;
//     const listingId = messages[0].listing_id;

//     const chatMessage = await insertChatMessage(senderInfo, receiverId, listingInfo, messageContent)

//     const chatLog = await messagesBetweenUserAndAdmin(senderId, receiverId, listingId)
//     messages.push(chatMessage)
//     res.redirect(`/message/${listingInfo.title}?senderId=${receiverId}`)
//   }
// })

