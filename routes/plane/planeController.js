// planeController.js
const axios = require('axios'); // Import axios for making HTTP requests
require('dotenv').config(); // Import dotenv to read environment variables

// Your Aviationstack API key from environment variables
const AVIATIONSTACK_API_KEY = process.env.AVIATIONSTACK_API_KEY;

// Function to get the flight status given a flight IATA code
exports.getFlightStatus = async (req, res) => {
    const { flight_iata } = req.query; // Extract the IATA code from the query parameters

    // Setup the parameters for the request to the Aviationstack API
    const params = {
        access_key: AVIATIONSTACK_API_KEY,
        flight_iata
    };

    try {
        // Make a GET request to the Aviationstack API with the parameters
        const response = await axios.get('http://api.aviationstack.com/v1/flights', { params });
        const apiResponse = response.data;

        // If data is found in the API response
        if (apiResponse.data && apiResponse.data.length > 0) {
            // Find the flight data matching the IATA code
            const flightData = apiResponse.data.find(flight => flight.flight.iata === flight_iata);

            // If flight data is found, send it as a JSON response
            if (flightData) {
                res.json(flightData);
            } else {
                // If not, send a 404 response
                res.status(404).json({ message: "Flight not found." });
            }
        } else {
            // If no data is available, send a 404 response
            res.status(404).json({ message: "No data available." });
        }
    } catch (error) {
        // Log the error to the console and send a 500 error response
        console.error("Error fetching flight data:", error);
        res.status(500).json({ message: "Server error." });
    }
};
