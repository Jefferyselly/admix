const express = require('express');
const path = require('path');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');




// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('home'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('user_dashboard', {
    user: req.user
  })

  
);

module.exports = router;
