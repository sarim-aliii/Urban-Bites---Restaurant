require('dotenv').config();


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const session = require('express-session');
const flash = require('connect-flash');



// MongoDB connection
const MONGO_URL = "mongodb://127.0.0.1:27017/Restaurant";
mongoose.connect(MONGO_URL)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));


// Setup view engine and static files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Setup session and passport configuration
const sessionOptions = {
  secret: process.env.SECRET, 
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


// Debug middleware to log requests
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


// Authentication
const { isLoggedIn } = require("./middleware.js");


// Routes for User
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);

app.get('/login', userController.getLogin);
app.post('/login', passport.authenticate('local', {
  successRedirect: '/index',
  failureRedirect: '/login',
  failureFlash: true,        
  successFlash: 'Welcome back!',
}));


app.get("/forgotPassword", userController.getForgotPassword);
app.post("/forgotPassword", userController.postForgotPassword);
app.get("/resetPassword/:token", userController.getResetPassword);
app.post("/resetPassword/:token", userController.postResetPassword);


// Routes for Flow
app.get('/', flowController.home);
app.get('/index', isLoggedIn, flowController.index);
app.get('/menu', isLoggedIn, flowController.menu);
app.get('/about', isLoggedIn, flowController.about);


// Route for delivery page with orders
app.get('/delivery', isLoggedIn, orderController.delivery);
app.post('/submit-order', isLoggedIn, orderController.submitOrder);
app.get('/order-summary/:id', isLoggedIn, orderController.getOrderSummary);
app.get("/made-payment", isLoggedIn, orderController.madePayment);


// API Routes for Reservations
app.get('/reservation', isLoggedIn, reservationController.reservation);
app.get('/api/reservations', isLoggedIn, reservationController.getAPIReservation);
app.post('/api/reservations', isLoggedIn, reservationController.postAPIReservation);



const PORT = process.env.PORT ||8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});