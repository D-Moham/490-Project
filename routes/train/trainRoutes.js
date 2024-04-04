const express = require('express');
const router = express.Router();
const trainController = require('./trainController');

// Keep the existing route as is
router.get('/status/:trainNumber', trainController.getTrainStatus); 

module.exports = router;
