const User = require("../models/user");
const crypto = require('crypto'); // Built-in Node.js module for generating tokens
const nodemailer = require('nodemailer'); // For sending emails


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


module.exports.getSignup = (req, res) => {
  res.render("../views/signup.ejs");
};


module.exports.postSignup = async (req, res, next) => {
  try{
    let {username, email, password} = req.body;
    let newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, err => {
        if (err){
          console.error("Error during auto-login after signup:", err); 
          req.flash('error', 'Account created, but failed to log in automatically. Please try logging in.'); 
          return res.redirect('/login');
        }
        req.flash('success', 'Welcome to Urban Bites!');
        res.redirect("/index");
    });
  }
  catch(err){
    console.error("Error during signup process (before auto-login):", err);
    let errorMessage = "Failed to create account. Please try again.";

    if (err.name === 'MongoServerError' && err.code === 11000) {
        errorMessage = "Username or email already exists.";
    } 
    else if (err.name === 'UserExistsError') {
        errorMessage = err.message;
    }

    req.flash('error', errorMessage);
    res.redirect("/signup");
  }
};

module.exports.getLogin = async (req, res) => {
  res.render("../views/login.ejs");
};

module.exports.getForgotPassword = (req, res) => {
  res.render("../views/forgotPassword.ejs");
};

module.exports.postForgotPassword = async (req, res) => {
  try{
    let {email} = req.body;

    const user = await User.findOne({ email: email });
    if(!user){
      req.flash('error', 'No account with that email address exists.');
      return res.redirect('/forgotPassword');
    }

    // Generate a random token
    const token = crypto.randomBytes(20).toString('hex');
    // Set token and expiry on the user
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    const mailOptions = {
        to: user.email,
        from: 'urbanbites@support.in',
        subject: 'Urban Bites Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
              `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
              `http://${req.headers.host}/resetPassword/${token}\n\n` +
              `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

        await transporter.sendMail(mailOptions);

        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        res.redirect('/forgotPassword');
  }
  catch(err){
    console.error("Error in postForgotPassword:", err);
    req.flash('error', 'Error sending password reset email.');
    res.redirect('/forgotPassword');
  }
};


module.exports.getResetPassword = async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() } // Token is greater than current time (not expired)
        });

        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgotPassword');
        }

        res.render('../views/resetPassword.ejs', { token: req.params.token }); 
    } 
    catch (err) {
        req.flash('error', 'Error processing password reset request.');
        res.redirect('/forgotPassword');
    }
};


module.exports.postResetPassword = async (req, res, next) => {
    try {
        const { password, confirm} = req.body; // New password from the form

        if (password !== confirm) {
          req.flash('error', 'New password and confirmation do not match.');
          return res.redirect(`/resetPassword/${req.params.token}`);
        }

        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgotPassword');
        }

        await user.setPassword(password); 
        user.resetPasswordToken = undefined; 
        user.resetPasswordExpires = undefined;
        await user.save();

        req.login(user, err => {
            if (err){
              return next(err);
            }
            req.flash('success', 'Your password has been reset and you are now logged in!');
            res.redirect('/index');
        });
    } 
    catch (err) {
        req.flash('error', 'Error resetting password.');
        res.redirect('/forgotPassword');
    }
};