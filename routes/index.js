let express = require('express')
let router = express.Router()
let passport = require('passport')
let User = require('../models/user')
let Itinerary = require('../models/itinerary');
const userAuth = require('../middleware/userAuth')

// GET: root
router.get('/', (req, res) => {
    res.render('home')
})

router.get('/tracker', (req, res) => {
  res.render('tracker');
});

router.get('/profile', (req, res) => {
  let displayName = req.user?.displayName;
  let username = req.user?.username;
  res.render('profile', {displayName: displayName, username: username});
})

router.get('/profile/personal', (req,res) => {
  let displayName = req.user?.displayName;
  let username = req.user?.username;
  let homeCity = req.user.homeCity;
  res.render('personal', {displayName: displayName, username: username, homeCity: homeCity});
});

router.get('/profile/preferences', (req,res) => {
  res.render('preferences');
});

// Register Page
router.get('/register', (req, res) => {
    res.render('register')
})

// Handle sign-up
router.post('/register', (req, res) => {
    // Save New User
    const { username, displayName, homeCity } = req.body;
    
    const newUser = new User({ 
      username: username,
      displayName: displayName,
      homeCity: homeCity
    });

    User.register(newUser, req.body.password, (err, user) => {
      if (err) {
        console.log(err);
        return res.render('register', { error: err.message });
      }

      passport.authenticate('local')(req, res, () => {
        res.redirect('/');
      })
    })
})

// Login Page
router.get('/login', (req, res) => {
    res.render('login')
})

// Handle login
router.post('/login', passport.authenticate('local'), userAuth.checkLoggedIn, (req, res) => {
  res.redirect('/');
});

// Handle logout
router.get('/logout', userAuth.logout, (req, res) => {
  res.redirect('/');
})

// Dynamic Page that displays the selected City's Details
router.get('/city', function(req, res) {
  const cityName = req.query.city; // Extract the city name from query parameters
  
  res.render('city', {cityName: cityName});
});

// GET route to fetch all itineraries for the current user
router.get('/itinerary', userAuth.checkLoggedIn, async (req, res) => {
  try {
    // Retrieve the current user's ID from the request object
    const userId = req.user._id;

    // Query the database to find all itineraries where the author's ID matches the current user's ID
    const userItineraries = await Itinerary.find({ 'author.id': userId });

    // Render the page with the user itineraries
    res.render('itinerary', { itineraries: userItineraries });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch itineraries', error: error.message });
  }
});

// Get route to handle creation
router.get('/itinerary/create', userAuth.checkLoggedIn, (req, res) => {
  res.render('itinerary-create');
})

// POST route to create a new itinerary
router.post('/itinerary/create', async (req, res) => {
  try {
    // Extract user information
    const author = {
      id: req.user._id,
      username: req.user.username
    };

    // Extract data from req.body
    const { itineraryName, startingCity, startDate, endDate, destinations } = req.body;

    // Ensure destinations are formatted correctly as an array of objects
    let formattedDestinations = [];
    if (Array.isArray(destinations)) {
      formattedDestinations = destinations.map(destination => ({
        name: destination.name,
        transportation: destination.transportation,
        hotel: destination.hotel,
        startDate: destination.startDate,
        endDate: destination.endDate,
        activities: destination.activities.map(activity => ({
          activityName: activity.activityName,
          activityDate: activity.activityDate,
          transportation: activity.transportation
        }))
      }));
    }

    // Create a new itinerary object
    const newItinerary = new Itinerary({
      author, // Include the author information
      itineraryName,
      startingCity,
      startDate,
      endDate,
      destinations: formattedDestinations // Use the formatted destinations
    });

    // Save the new itinerary to the database
    await newItinerary.save();

    res.status(201).redirect('/itinerary');
  } catch (error) {
    res.status(500).json({ message: 'Failed to create itinerary', error: error.message });
  }
});

// GET route to view an individual itinerary
router.get('/itinerary/:id', userAuth.checkLoggedIn, async (req, res) => {
  try {
    // Retrieve the itinerary ID from the request parameters
    const itineraryId = req.params.id;

    // Find the itinerary in the database by its ID
    const itinerary = await Itinerary.findById(itineraryId);

    // Check if the itinerary exists
    if (!itinerary) {
      return res.status(404).send('Itinerary not found');
    }

    // Render a page to display the details of the itinerary
    res.render('itinerary-view', { itinerary });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch itinerary', error: error.message });
  }
});

// GET route to delete an individual itinerary
router.get('/itinerary/delete/:id', async (req, res) => {
  try {
    // Retrieve the itinerary ID from the request parameters
    const itineraryId = req.params.id;

    // Find the itinerary in the database by its ID
    const itinerary = await Itinerary.findById(itineraryId);

    // Check if the itinerary exists
    if (!itinerary) {
      return res.status(404).send('Itinerary not found');
    }

    // Delete the found itinerary
    await itinerary.deleteOne();

    // Redirect to the Itinerary Hub
    res.status(201).redirect('/itinerary');
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete itinerary', error: error.message });
  }
});

router.get('/itinerary/edit/:id', userAuth.checkLoggedIn, async (req, res) => {
  try {
    // Retrieve the itinerary ID from the request parameters
    const itineraryId = req.params.id;

    // Find the itinerary in the database by its ID
    const itinerary = await Itinerary.findById(itineraryId);
    res.render('itinerary-edit', { itinerary });
  }   catch (error) {
    res.status(500).json({ message: 'Failed to fetch itinerary for edit', error: error.message });
  }
})

router.post('/itinerary/edit/:id', async (req, res) => {
  try {
    // Extract data from req.body
    const { itineraryName, startingCity, startDate, endDate, destinations } = req.body;

    // Ensure destinations are formatted correctly as an array of objects
    let formattedDestinations = [];
    if (Array.isArray(destinations)) {
      formattedDestinations = destinations.map(destination => ({
        name: destination.name,
        transportation: destination.transportation,
        hotel: destination.hotel,
        startDate: destination.startDate,
        endDate: destination.endDate,
        activities: destination.activities.map(activity => ({
          activityName: activity.activityName,
          activityDate: activity.activityDate,
          transportation: activity.transportation
        }))
      }));
    }

    // Update the itinerary object with new values
    await Itinerary.updateOne({_id: req.params.id},
      { $set: {
          author: {
            id: req.user._id,
            username: req.user.username
          },
          "itineraryName" : itineraryName,
          "startingCity" : startingCity,
          "startDate" : startDate,
          "endDate" : endDate,
          "destinations" : formattedDestinations
      }});
      
    // Redirect to the Itinerary Hub
    res.status(200).redirect('/itinerary');
  } catch (error) {
    res.status(500).json({ message: 'Failed to update itinerary', error: error.message });
  }
});

module.exports = router;