// load .env data into process.env
require("dotenv").config();

// Web server config
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const morgan = require("morgan");
const cookieSession = require("cookie-session");
const { pool, getUserByUsername } = require("./helpers");
const { database } = require("./db/connection");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";

const PORT = process.env.PORT || 8080;
const app = express();

app.set("view engine", "ejs");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static("public"));
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userApiRoutes = require("./routes/users-api");
const widgetApiRoutes = require("./routes/widgets-api");
const usersRoutes = require("./routes/users");
const listingsRoutes = require("./routes/listings");
const favourites = require("./routes/favourites");
// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use("/api/users", userApiRoutes);
app.use("/api/widgets", widgetApiRoutes);
app.use("/users", usersRoutes);
app.use("/listings", listingsRoutes);
app.use("/favourites", favourites);
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

// Login a user
app.post("/login", (req, res) => {
  const inPuttedUsername = req.query.username;
  const inPuttedPassword = req.query.password;
  console.log(inPuttedPassword);

  database.getUserByUsername(inPuttedUsername).then((user) => {
    if (!user) {
      return res.send({ error: "no user with that username" });
    }

    if (!bcrypt.compareSync(inPuttedPassword, user.password)) {
      return res.send({ error: "error" });
    }

    req.session.username = user.username;
    res.send({
      user: {
        name: username,
        email: user.email,
        id: user.id,
      },
    });
  });
});

// Return information about the current user (based on cookie value)
app.get("/login", (req, res) => {
  const username = req.session.username;
  if (!username) {
    return res.send({ message: "not logged in" });
  }

  database
    .getUserByUsername(username)
    .then((user) => {
      if (!user) {
        return res.send({ error: "no user with that id" });
      }

      res.send({
        user: {
          name: username,
          email: user.email,
          id: user.id,
        },
      });
    })
    .catch((e) => res.send(e));
});

app.get("/create", (req, res) => {
  res.render("create-listing");
});

app.get("/favourites", (req, res) => {
  res.render("favourites");
});

app.get("/message", (req, res) => {
  res.render("message");
});

// app.get("/listings", (req, res) => {
//   res.render("listingpage");
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
