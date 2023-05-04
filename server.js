// load .env data into process.env
// require("dotenv").config();

// Web server config
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const morgan = require("morgan");
const cookieSession = require("cookie-session");
const { getUserByUsername, getUserById, getUsers, getListingInfo, getUserId, updateToSold, getAllListings  } = require("./helpers");
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
const createRoutes = require("./routes/create-listing")
const messageRoutes = require("./routes/messages")
// const loginRoutes = require("./routes/login")
// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use("/api/users", userApiRoutes);
app.use("/api/widgets", widgetApiRoutes);
app.use("/users", usersRoutes);
app.use("/listings", listingsRoutes);
app.use("/favourites", favourites);
app.use("/create-listing", createRoutes);
app.use("/message", messageRoutes);
// app.use("/login", loginRoutes);
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", async (req, res) => {
  const username = req.session.username;
  const user = await getUserByUsername(username);
  res.render("index", { user: user });
});

// message board - CONTINUE WORKING HERE

// app.post("/message/:id", async(req, res) => {
//   // Get the listing info
//   const listingName = req.params.id;
//   const listingInfo = await getListingInfo(listingName)

//   // Get username of user
//   const username = req.session.username;
//   const user = await getUserByUsername(username)
//   console.log(user)
//   console.log(listingInfo)
//   res.render('message', {user: user, listingInfo: listingInfo })
// })

// app.get("/message", async (req, res) => {
//   const username = req.session.username;
//   const user = await getUserByUsername(username);
//   console.log(req.body);
//   console.log(user);
//   res.render("message", { user: user });
// });


//-------------------------------------------------------------------------------------------------------

// Going to login page
app.get("/login", async (req, res) => {
  const username = req.session.username;
  if (!username) {
    const username = req.session.username;
    const user = await getUserByUsername(username);
    console.log(user);
    res.render("login", { user: user });
  } else {
    res.redirect("/");
  }
});

// Login a user
app.post("/login", async (req, res) => {
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
      res.redirect("/");
    })
    .catch((error) => {
      console.error(error);
    });
});

// Logout a user

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

// ----

app.get("/favourites", (req, res) => {
  res.render("favourites");
});

//Mark item as sold
app.post("/listings/sold/:id", async (req, res) => {
  console.log(req.params.id)
  await updateToSold(req.params.id)
    .then((data) => {
      console.log(data)
      res.redirect("/listings");
      // return data;
    })
    .catch((err) => {
      console.error(err);
    })
});



/*
How to make patch request in ejs
Pass in the id with the request
Access resource in the database by the id
Change the bolean value to true
*/



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
