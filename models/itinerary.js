const mongoose = require('mongoose');

// Define a schema for activities
const activitySchema = new mongoose.Schema({
  activityName: String,
  activityDate: Date
});

// Define a schema for destination and transportation
const destinationSchema = new mongoose.Schema({
  name: String,
  transportation: String,
  activities: [activitySchema], // Array of activity objects for this destination
  startDate: Date, // Start date for this destination
  endDate: Date // End date for this destination
});

const itinerarySchema = new mongoose.Schema({
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  itineraryName: String,
  startingCity: String, // Starting city for the entire itinerary
  startDate: Date, // Start date for the entire itinerary
  endDate: Date, // End date for the entire itinerary
  destinations: [destinationSchema] // Array of destination objects
});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);

module.exports = Itinerary;