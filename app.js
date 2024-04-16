const express = require('express');
const axios = require('axios'); // Ensure axios is installed via npm
const amtrak = require('amtrak'); // Ensure amtrak is installed via npm
const app = express();
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user'); // Make sure this path is correct
const indexRoutes = require('./routes/index'); // Ensure this module is correctly set up

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
// Route for fetching train data using Amtrak API
app.get('/api/trains/:trainNumber', async (req, res) => {
  try {
    const trainNumber = req.params.trainNumber;
    const response = await axios.get(`https://api-v3.amtraker.com/v3/trains/${trainNumber}`);

    // Assuming the response from the API is similar to the structure of the BODY in your example:
    if (response.data && response.data[trainNumber]) {
      // Send back the entire object as received from the Amtrak API
      res.json(response.data[trainNumber]);
    } else {
      res.status(404).json({ message: "Train not found." });
    }
  } catch (error) {
    console.error('Error fetching train data:', error);
    res.status(500).json({ message: 'Error fetching train data' });
  }
});

// Route to handle Aviationstack API requests for flight coordinates
app.get('/api/flights/:flightIATA', async (req, res) => {
  const flightIATA = req.params.flightIATA;
  const params = {
        // Set parameters for the Aviationstack API request
    access_key: process.env.AVIATIONSTACK_API_KEY,
    flight_iata: flightIATA
  };

  try {
        // Make a GET request to the Aviationstack API to retrieve flight data
    const response = await axios.get('http://api.aviationstack.com/v1/flights', { params });
// Check if the response has the flight data
    if (response.data && response.data.data) {
      const activeFlight = response.data.data.find(flight => flight.flight.iata === flightIATA && flight.flight_status === 'active');
// Find an active flight that matches the IATA code
      if (activeFlight && activeFlight.live) {
        res.json({
              // Respond with the latitude and longitude of the flight
          latitude: activeFlight.live.latitude,
          longitude: activeFlight.live.longitude
        });
            //catch any possible errors which may come about from ivalid IDs, or down API
      } else {
        res.status(404).json({ message: "Active flight not found for the provided IATA code." });
      }
    } else {
      res.status(404).json({ message: "Flight not found." });
    }
        // Log and respond with error information
  } catch (error) {
    console.error('Error fetching flight data:', error);
    res.status(500).json({ message: 'Error fetching flight data' });
  }
});




