const axios = require('axios'); // If you're already using axios, otherwise add this line.
const amtrak = require('amtrak'); 

exports.getTrainStatus = async (req, res) => {
    try {
        const trainId = `${req.params.trainNumber}-${req.query.originDate}`; // Assuming originDate in query string
        const trainData = await amtrak.fetchTrain(trainId);
        res.json(trainData);
    } catch (error) {
        console.error('Error fetching train data:', error); 
        res.status(500).json({ message: 'Error fetching train data' }); 
    }
};