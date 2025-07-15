const reservationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true },
  }, { timestamps: true });
  
  module.exports = mongoose.model('Reservation', reservationSchema);

module.exports = mongoose.model('Reservation', reservationSchema);
document.addEventListener('DOMContentLoaded', async () => {
    const reservationList = document.getElementById('reservationList');
  
    try {
      // Fetch existing reservations
      const response = await fetch('/api/reservations');
      if (response.ok) {
        const reservations = await response.json();
  
        // Populate reservation list
        reservations.forEach(reservation => {
          const listItem = document.createElement('li');
          listItem.innerHTML = `
            <strong>${reservation.name}</strong> - 
            ${reservation.date} at ${reservation.time}, 
            ${reservation.guests} guests.
          `;
          reservationList.appendChild(listItem);
        });
      } else {
        console.error('Failed to fetch reservations');
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  });
  