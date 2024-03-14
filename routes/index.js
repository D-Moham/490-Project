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
  res.render('itinerary');
});

router.get('/tracker', (req, res) => {
  res.render('tracker');
});

router.get('/profile', (req, res) => {
  res.render('profile');
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

module.exports = router;