const mongoose = require('mongoose');

// Define a schema for activities
const activitySchema = new mongoose.Schema({
  activityName: String,
  activityDate: Date,
  transportation: String
});

activitySchema.virtual('formattedActivityDate').get(function() {
  return this.activityDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
})

// Define a schema for destination and transportation
const destinationSchema = new mongoose.Schema({
  name: String,
  transportation: String,
  hotel: String,
  activities: [activitySchema], // Array of activity objects for this destination
  startDate: Date, // Start date for this destination
  endDate: Date // End date for this destination
});

// Define virtuals to format dates
destinationSchema.virtual('formattedStartDate').get(function() {
  return this.startDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
});

destinationSchema.virtual('formattedEndDate').get(function() {
  return this.endDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
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

// Define virtuals to format dates
itinerarySchema.virtual('formattedStartDate').get(function() {
  return this.startDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
});

itinerarySchema.virtual('formattedEndDate').get(function() {
  return this.endDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);

module.exports = Itinerary;