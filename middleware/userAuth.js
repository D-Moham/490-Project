checkLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }

  res.status(403).render('login', {message: 'You Must Authenticate to Perform That Action'});
  return;
}

logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      res.status(403).send({ message: 'error logging out' });
    }
    next();
  });
}

module.exports = {
  checkLoggedIn,
  logout
}