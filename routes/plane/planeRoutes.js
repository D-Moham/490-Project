const express = require('express');
const router = express.Router();
const planeController = require('./planeController');

router.get('/status/:inputID', planeController.getFlightStatus);

module.exports = router;
