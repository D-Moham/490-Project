const express = require('express'); // Import Express
const router = express.Router(); // Create a new router
const planeController = require('./planeController'); // Import the plane controller

// Route that handles getting flight status by IATA code.
// It uses the getFlightStatus function from the plane controller.
router.get('/status/:inputID', planeController.getFlightStatus);

module.exports = router; // Export the router for use in other files
