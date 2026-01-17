const Reservation = require('../models/reservation'); 
const { reservationSchema } = require('../schemas');


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
    // Validate request body
    const { error } = reservationSchema.validate(req.body);
    if (error) {
      const msg = error.details.map(el => el.message).join(',');
      return res.status(400).json({ message: msg });
    }

    const { name, phone, date, time, guests } = req.body;
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
    // Validate request body
    const { error } = reservationSchema.validate(req.body);
    if (error) {
      const msg = error.details.map(el => el.message).join(',');
      req.flash('error', msg); // Send validation error to the user
      return res.redirect("/reservation");
    }

    let {name, phone, date, time, guests} = req.body;
    let newReservation = new Reservation({name, phone, date, time, guests});
    
    await newReservation.save();
    req.flash('success', 'Reservation successful');
    res.redirect("/reservation");
  } 
  catch (error) {
    console.error("Error during reservation process", error);
    req.flash('error', "Failed to create reservation. Please try again.");
    res.redirect("/reservation");
  }
};