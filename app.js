const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const indexRoutes = require('./routes/index');

// configure dotenv
require('dotenv').config();

// Database Connection 
// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;
const databaseUri = process.env.MONGODB_URI;
mongoose.connect(databaseUri)
      .then(() => console.log(`Database connected`))
      .catch(err => console.log(`Database connection error: ${err.message}`));

app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "Very secret message",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err, null);
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

// Import Routes
app.use('/', indexRoutes);

// Running the app
app.listen(3000, function() {
  console.log('App is running on http://localhost:3000/');
});
