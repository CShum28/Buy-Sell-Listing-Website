const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const cookieSession = require("cookie-session");
const { getUserByUsername, getUserById, getUsers } = require("../helpers");

app.post("/", async (req, res) => {
  const senderPhone = req.body.senderPhone; // Get sender's phone number from the form
  const receiverPhone = req.body.receiverPhone; // Get receiver's phone number from the form
  const messageBody = req.body.messageBody; // Get message body from the form
  const listingId = req.body.listingId; // Get listing ID from the form
  const listingOwnerId = req.body.listingOwnerId; // Get listing owner ID from the form

  try {
    // Use the Twilio API to send the SMS message here
    const twilioResponse = await twilioClient.messages.create({
      body: messageBody,
      from: senderPhone,
      to: receiverPhone,
    });

    // Insert a new record into the textmessages table with the details of the sent message
    const insertQuery = `
      INSERT INTO textmessages (sender_phone, receiver_phone, message_body, listing_id, listing_owner_id)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await pool.query(insertQuery, [
      senderPhone,
      receiverPhone,
      messageBody,
      listingId,
      listingOwnerId,
    ]);

    // Send a response back to the client indicating that the SMS message was sent successfully
    res.status(200).send({ message: "SMS message sent successfully." });
  } catch (error) {
    // Handle errors that may occur while sending the SMS message or inserting into the database
    console.error(error);
    res
      .status(500)
      .send({ message: "An error occurred while sending the SMS message." });
  }
});

module.exports = router;
