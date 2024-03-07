const express = require('express');
const ejs = require('ejs');
const path = require('path');
const mongoose = require("mongoose");

// configure dotenv
require('dotenv').config();

// Database Connection 
// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;
const databaseUri = process.env.MONGODB_URI;
mongoose.connect(databaseUri)
      .then(() => console.log(`Database connected`))
      .catch(err => console.log(`Database connection error: ${err.message}`));

// Express app
let app = express();

app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');

// Routes
app.get('/', function(req, res){
  res.render('home');
});

app.get('/search', function(req, res) {
  res.render('search');
});

app.get('/itinerary', function(req, res) {
  res.render('itinerary');
});

app.get('/tracker', function(req, res) {
  res.render('tracker');
});

app.get('/profile', function(req, res) {
  res.render('profile');
})

app.listen(3000, function() {
  console.log('App is running on http://localhost:3000/');
});
