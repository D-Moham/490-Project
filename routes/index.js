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

router.get('/personal', (req,res) => {
  let displayName = req.user?.displayName;
  let username = req.user?.username;
  res.render('personal', {displayName: displayName, username: username});
});

router.get('/preferences', (req,res) => {
  res.render('preferences');
});

// Register Page
router.get('/register', (req, res) => {
    res.render('register')
})

// Handle sign-up
router.post('/register', (req, res) => {
    // Save New User
    let newUser = new User({ username: req.body.username });
    newUser.displayName = req.body.displayName;

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
        startDate: destination.startDate,
        endDate: destination.endDate,
        activities: destination.activities.map(activity => ({
          activityName: activity.activityName,
          activityDate: activity.activityDate
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
router.get('/itinerary/:id', async (req, res) => {
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

module.exports = router;