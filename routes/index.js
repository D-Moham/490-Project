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

router.get('/profile', userAuth.checkLoggedIn, (req, res) => {
  let displayName = req.user?.displayName;
  let username = req.user?.username;
  res.render('profile', {displayName: displayName, username: username});
});

router.get('/profile/personal', userAuth.checkLoggedIn, (req,res) => {
  let displayName = req.user?.displayName;
  let username = req.user?.username;
  let homeCity = req.user.homeCity;
  const message = req.query.message;
  res.render('personal', {displayName: displayName, username: username, homeCity: homeCity, message: message});
});

router.post('/profile/personal', userAuth.checkLoggedIn, async (req, res) => {
  const { username, displayName, homeCity } = req.body;
  
  try {
    // Update the itinerary object with new values
    await User.updateOne({_id: req.user._id,},
      { $set: {
          "username" : username,
          "displayName" : displayName,
          "homeCity" : homeCity,
      }});
    
    // Redirect to the Itinerary Hub
    res.status(200).redirect('/profile/personal?message=Information+Updated+Successfully');
  } catch {
    res.status(500).json({ message: 'Failed to update personal information', error: error.message });
  }
});

router.get('/profile/trips', userAuth.checkLoggedIn, async (req,res) => {
  // res.render('trips')

  // Retrieve the current user's ID from the request object
  const userId = req.user._id;

  // Query the database to find all itineraries where the author's ID matches the current user's ID
  const userItineraries = await Itinerary.find({ 'author.id': userId });

  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for accurate comparison

  // Arrays to store past, current, and future itineraries
  const pastItineraries = [];
  const currentItineraries = [];
  const futureItineraries = [];

  // Iterate through itineraries and categorize them based on today's date/ also passes itinerary attributes
  userItineraries.forEach(itinerary => {
    if (itinerary.endDate < today) {
      pastItineraries.push({ name: itinerary.itineraryName, startDate: itinerary.formattedStartDate, endDate: itinerary.formattedEndDate, startingCity: itinerary.startingCity, destinations: itinerary.destinations });
    } else if (itinerary.startDate <= today && itinerary.endDate >= today) {
      currentItineraries.push({ name: itinerary.itineraryName, startDate: itinerary.formattedStartDate, endDate: itinerary.formattedEndDate, startingCity: itinerary.startingCity, destinations: itinerary.destinations });
    } else {
      futureItineraries.push({ name: itinerary.itineraryName, startDate: itinerary.formattedStartDate, endDate: itinerary.formattedEndDate, startingCity: itinerary.startingCity, destinations: itinerary.destinations });
    }
  });
  

  // Render the page with the user itineraries
  res.render('trips', { itinerary:userItineraries, pastItineraries: pastItineraries, currentItineraries: currentItineraries, futureItineraries: futureItineraries });
})

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
      // Check if the error is due to non-unique username
      if (err.name === 'MongoError' && err.code === 11000) {
        return res.render('register', { message: 'Username already exists' });
      }
      return res.render('register', { message: err.message });
    }

    passport.authenticate('local')(req, res, () => {
      res.redirect('/');
    });
  });
})

// Login Page
router.get('/login', (req, res) => {
  res.render('login')
})

// Handle login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Authentication failed, redirect back to login page with error message
      return res.render('login',  {message: info.message});
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Authentication successful, redirect to homepage
      return res.redirect('/');
    });
  })(req, res, next);
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
router.post('/itinerary/create', userAuth.checkLoggedIn, async (req, res) => {
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
        activities: Array.isArray(destination.activities) ? destination.activities.map(activity => ({
          activityName: activity.activityName,
          activityDate: activity.activityDate,
          transportation: activity.transportation
        })) : [] // If activities array doesn't exist, return an empty array
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

    if (itinerary.author.id == req.user.id) {
      // Render a page to display the details of the itinerary
      res.render('itinerary-view', { itinerary });
    } else {
      // Send a 404 error response
      res.status(404).send('You do not have access to that!');
    }
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
        activities: Array.isArray(destination.activities) ? destination.activities.map(activity => ({
          activityName: activity.activityName,
          activityDate: activity.activityDate,
          transportation: activity.transportation
        })) : [] // If activities array doesn't exist, return an empty array
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

// GET route to share an itinerary
router.get('/itinerary/share/:id', userAuth.checkLoggedIn, async (req, res) => {
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
    res.render('itinerary-share', { itinerary });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch itinerary', error: error.message });
  }
});

// GET route to view a shared itinerary
router.get('/itinerary/share/view/:id', async (req, res) => {
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
    res.render('itinerary-share-view', { itinerary });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch itinerary', error: error.message });
  }
});

module.exports = router;