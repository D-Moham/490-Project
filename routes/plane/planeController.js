// planeController.js
const axios = require('axios');
require('dotenv').config();
const AVIATIONSTACK_API_KEY = process.env.AVIATIONSTACK_API_KEY;

exports.getFlightStatus = async (req, res) => {
    const { flight_iata } = req.query;

    const params = {
        access_key: AVIATIONSTACK_API_KEY,
        flight_iata
    };

    try {
        const response = await axios.get('http://api.aviationstack.com/v1/flights', { params });
        const apiResponse = response.data;
        if (apiResponse.data && apiResponse.data.length > 0) {
            const flightData = apiResponse.data.find(flight => flight.flight.iata === flight_iata);
            if (flightData) {
                res.json(flightData);
            } else {
                res.status(404).json({ message: "Flight not found." });
            }
        } else {
            res.status(404).json({ message: "No data available." });
        }
    } catch (error) {
        console.error("Error fetching flight data:", error);
        res.status(500).json({ message: "Server error." });
    }
};
