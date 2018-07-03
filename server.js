const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const config = require("./config.json");
const Register = require("./models/register.js");
var bodyParser = require("body-parser");
const passport = require("passport");
const passportConfig = require("./passport.js");

mongoose.connect(
  config.databaseUrl,
  err => {
    if (err) throw err;
    console.log("Database connected");
  }
);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

app.get("/register", (req, res, next) => {
  res.sendFile(path.join(__dirname + "/signup.html"));
});
app.post("/register", (req, res, next) => {
  const newRegistration = new Register(req.body);
  newRegistration.save((err, user) => {
    if (err) throw err;
    res.json(user);
  });
});

app.get("/login", (req, res, next) => {
  res.sendFile(path.join(__dirname + "/login.html"));
});
app.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/register",
    failureRedirect: "/login",
    failureFlash: true
  })
);

const port = process.env.PORT || 3000;
app.listen(port, err => {
  if (err) throw err;
  console.log(`Server is running on port ${port}`);
});
