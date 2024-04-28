// planeController.js
const axios = require('axios'); // Import axios for making HTTP requests
require('dotenv').config(); // Import dotenv to read environment variables

// Your Aviationstack API key from environment variables
const AVIATIONSTACK_API_KEY = process.env.AVIATIONSTACK_API_KEY;

// Function to get the flight status given a flight IATA code
exports.getFlightStatus = async (req, res) => {
    const flight_iata = req.params.inputID; // Extract the IATA code from the query parameters

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

            // Check if live data is available, and if not, provide available data
            if (flightData && flightData.live) {
                res.json(flightData); // If live data is available, send it
            } else if (flightData) {
                // If live data isn't available, send available static data
                const staticData = {
                    departure: flightData.departure,
                    arrival: flightData.arrival,
                    airline: flightData.airline,
                    flight: flightData.flight,
                    status: flightData.flight_status
                };
                res.json(staticData);
            } else {
                // If no flight data is found, send a 404 response
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
