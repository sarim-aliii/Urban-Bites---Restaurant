const { reservationSchema, orderSchema, userSignupSchema } = require('./schemas'); 
const ExpressError = require('./util/ExpressError');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};


// Generic function to validate data using a schema
const validateSchema = (schema, req, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        // Map over details to get a comma-separated string of messages
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400); // 400 = Bad Request
    } else {
        next();
    }
};

// Specific middleware for each route type
module.exports.validateReservation = (req, res, next) => {
    validateSchema(reservationSchema, req, next);
};

module.exports.validateOrder = (req, res, next) => {
    validateSchema(orderSchema, req, next);
};

module.exports.validateUserSignup = (req, res, next) => {
    validateSchema(userSignupSchema, req, next);
};