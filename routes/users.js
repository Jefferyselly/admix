const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const fetch = require('node-fetch');

const _ = require('lodash');

//Import the paystack service module.
const initializeTransaction = require('../config/paystack'); 

// Load User model
const User = require('../models/User');
const Referal = require('../models/Referal');


const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth')

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const { username, email, password, password2 } = req.body;
  let errors = [];

  if (!username || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      username,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          username,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          username,
          email,
          password,
          refered_by : req.cookies['ref'] || '',
          is_new_user : true,
          level : 0,

        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {

                //save the details in the referals document.
                const refl_doc = new Referal({
                  user_id : user._id,
                  referred_by_id : req.cookies['ref'] || 'jefferyselly',
                  status : false
                })//referal document object

                refl_doc.save();

                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

//paystack payment
router.post('/paystack/pay', ensureAuthenticated, (req,res) => {
  body = _.pick(req.body, ['email','amount']);
  
  fetch('https://api.paystack.co/transaction/initialize', {
        method: 'post',
        body:    JSON.stringify(body),
        headers: {
        "Authorization": "Bearer sk_test_7f08b63f79b938d2104ff13bae686af2e0377324",
        'Content-Type': 'application/json' },
        'cache-control': 'no-cache'    
    })
    .then(res => res.json())
    .then(json => {

      //if error exists, let the user know
      if(json.status == false) {res.send(json.message)}
        else{
      //Get the authorization message and proceed
      const auth_url = json.data.authorization_url;

      res.send(auth_url);
        }
    });
})

//paystack payment verification.
router.get('/paystack/verify', ensureAuthenticated, (req,res) => {
  const reference_id = req.query.reference;
  console.log(req.user)
   fetch('https://api.paystack.co/transaction/verify/'+encodeURIComponent(reference_id), {
        method: 'post',
        headers: {
        "Authorization": "Bearer sk_test_7f08b63f79b938d2104ff13bae686af2e0377324",
        'Content-Type': 'application/json' },
        'cache-control': 'no-cache'    
    }).then(res => {
      //store the reference_id in payment, credit the referal!!.
      Referal.findOneAndUpdate({user_id : req.user._id},{$set : {earned : 10, payment_status : true}}).then(ref => {
        //redirect user to paid group!!..

                })
    })
})



// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
