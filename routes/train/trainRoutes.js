const express = require('express'); // Import Express
const router = express.Router(); // Create a new router
const trainController = require('./trainController'); // Import the train controller

// Route that handles getting train status by number. 
// It uses the getTrainStatus function from the train controller.
router.get('/status/:trainNumber', trainController.getTrainStatus);

module.exports = router; // Export the router for use in other files
