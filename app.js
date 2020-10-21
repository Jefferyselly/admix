const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true,useFindAndModify : false}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

//Cookie Parser middleware
app.use(cookieParser())

//Middleware for checking referal Links
const check_for_ref_link = (req,res,next) => {

  //check if the referal tag is activated. store as cookie if true & new, if already exists, replace.
  if(req.query.ref){
    
      res.cookie('ref',req.query.ref);
      }

      next();
}

app.use(check_for_ref_link)


//EXPRESS STATIC FILES
// app.use(express.static( path.join(__dirname ,'public')));
app.use(express.static(path.join(__dirname, '/public')));


// EJS

app.set('view engine', 'ejs');

// Express body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/admin', require('./routes/admin.js'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
