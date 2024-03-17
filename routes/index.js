let express = require('express')
let router = express.Router()
let passport = require('passport')
let User = require('../models/user')
const userAuth = require('../middleware/userAuth')

// GET: root
router.get('/', (req, res) => {
    res.render('home')
})

router.get('/search', (req, res) => {
  res.render('search');
});

router.get('/itinerary', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('itinerary');
    router.get('/itinerary/create', (req, res) => {
      res.render('itinerary-create');
    })
    router.get('/itinerary/view', (req, res) => {
      res.render('itinerary-view');
    })
    router.get('/itinerary/edit', (req, res) => {
      res.render('itinerary-edit');
    })
  } else {
    res.redirect('/register');
  }
});

router.get('/tracker', (req, res) => {
  res.render('tracker');
});

router.get('/profile', (req, res) => {
  let displayName = req.user?.displayName;

  res.render('profile', {displayName: displayName});
})

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

module.exports = router;