const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { getUserByUsername, getUserById, getUsers } = require("../helpers");

// Login a user
router.post("/login", async (req, res) => {
  const inPuttedUsername = req.body.username;
  const inPuttedPassword = req.body.password;

  await getUserByUsername(inPuttedUsername)
    .then((user) => {
      console.log("Found user", user);
      if (!user) {
        return res.send({ error: "no user with that username" });
      }

      if (!bcrypt.compareSync(inPuttedPassword, user.password)) {
        return res.send({ error: "error" });
      }

      req.session.username = user.username;
      res.redirect('/')
    })
    .catch((error) => {
      console.error(error);
    });
});

router.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

module.exports = router;
