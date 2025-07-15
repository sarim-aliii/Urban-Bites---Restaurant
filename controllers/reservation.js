const Reservation = require('../models/reservation'); 


module.exports.reservation = async (req, res) => {
  try {
    const reservations = await Reservation.find({});
    res.render("reservation.ejs", { reservations });
  } 
  catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).send("Internal Server Error");
  }
};


module.exports.getAPIReservation = async (req, res) => {
  try {
    const { name, phone, date, time, guests } = req.body;

    if (!name || !phone || !date || !time || !guests) {
      console.error('Validation failed. Missing fields:', req.body);
      return res.status(400).json({ message: 'All fields are required' });
    }

    const reservation = new Reservation({ name, phone, date, time, guests });
    await reservation.save();
    res.redirect('/reservation');
  } 
  catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports.postAPIReservation = async (req, res) => {
  try {
    let {name, phone, date, time, guests} = req.body;
    let newReservation = new Reservation({name, phone, date, time, guests});
    
    await newReservation.save();
    req.flash('success', 'Reservation successful');
    res.redirect("/reservation");
  } 
  catch (error) {
    console.error("Error during reservation process", err);
    let errorMessage = "Failed to create reservation. Please try again.";

    req.flash('error', errorMessage);
    res.redirect("/reservation");
  }
};
