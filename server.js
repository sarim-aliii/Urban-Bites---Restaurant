require('dotenv').config();

const express = require('express');
const app = express();
const catchAsync = require('./util/catchAsync'); 
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const session = require('express-session');
const flash = require('connect-flash');

// Import Middleware
// Ensure your middleware.js exports these four functions
const { 
    validateUserSignup, 
    validateOrder, 
    validateReservation, 
    isLoggedIn 
} = require('./middleware');

// MongoDB connection
const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/urbanbites'; 
mongoose.connect(dbURL)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("DB Connection Error:", err));

// Setup view engine and static files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Setup session and passport configuration
const sessionOptions = {
  secret: process.env.SECRET || 'thisshouldbeabettersecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(passport.initialize());   
app.use(passport.session());       
app.use(flash());               

// Static files and URL encoding
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Passport strategy
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global Local Variables Middleware
app.use((req, res, next) => {
  res.locals.success = req.flash('success'); 
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  next();
});

// Controllers
const userController = require("./controllers/user.js");
const reservationController = require("./controllers/reservation.js");
const orderController = require("./controllers/order.js");
const flowController = require("./controllers/flow.js");


// 1. User Authentication Routes
app.get('/signup', userController.getSignup);
app.post('/signup', validateUserSignup, catchAsync(userController.postSignup));

app.get('/login', userController.getLogin);
app.post('/login', passport.authenticate('local', {
  successRedirect: '/index',
  failureRedirect: '/login',
  failureFlash: true,        
  successFlash: 'Welcome back!',
}));

app.get("/forgotPassword", userController.getForgotPassword);
// Applied catchAsync
app.post("/forgotPassword", catchAsync(userController.postForgotPassword));
app.get("/resetPassword/:token", catchAsync(userController.getResetPassword));
app.post("/resetPassword/:token", catchAsync(userController.postResetPassword));


// 2. Flow Routes (Pages)
app.get('/', flowController.home);
app.get('/index', isLoggedIn, flowController.index);
app.get('/menu', isLoggedIn, flowController.menu);
app.get('/about', isLoggedIn, flowController.about);


// 3. Order Routes
app.get('/delivery', isLoggedIn, catchAsync(orderController.delivery));
// Applied validateOrder and catchAsync
app.post('/submit-order', isLoggedIn, validateOrder, catchAsync(orderController.submitOrder));
app.get('/order-summary/:id', isLoggedIn, catchAsync(orderController.getOrderSummary));
app.get("/made-payment", isLoggedIn, orderController.madePayment);


// 4. Reservation Routes
app.get('/reservation', isLoggedIn, reservationController.reservation);
app.get('/api/reservations', isLoggedIn, catchAsync(reservationController.getAPIReservation));
app.post('/api/reservations', isLoggedIn, validateReservation, catchAsync(reservationController.postAPIReservation));


// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    
    // Check if the request was an API call (AJAX) or a page load
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(statusCode).json({ error: err.message });
    }
    
    res.status(statusCode).render('error', { err });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});