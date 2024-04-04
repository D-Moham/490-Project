const axios = require('axios'); // Import axios for making HTTP requests

// Function to get the status of a train given a train number and origin date
exports.getTrainStatus = async (req, res) => {
    try {
        // Construct the train ID using parameters from the request
        const trainId = `${req.params.trainNumber}-${req.query.originDate}`;

        // Fetch train data from the Amtrak API using the constructed train ID
        const trainData = await amtrak.fetchTrain(trainId);

        // Send the train data as a JSON response
        res.json(trainData);
    } catch (error) {
        // Log the error to the console and send a 500 error response
        console.error('Error fetching train data:', error);
        res.status(500).json({ message: 'Error fetching train data' });
    }
};
