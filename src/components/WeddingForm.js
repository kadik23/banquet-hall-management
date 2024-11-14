import React, { useState } from 'react';

function Weddings() {
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [guestCount, setGuestCount] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ajoutez ici la logique pour traiter le formulaire
    console.log({ date, venue, guestCount });
  };

  return (
    <div>
      <h2>Add a Wedding</h2>
      <form onSubmit={handleSubmit}>
        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} /><br />
        <label>Venue:</label>
        <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} /><br />
        <label>Guest Count:</label>
        <input type="number" value={guestCount} onChange={(e) => setGuestCount(e.target.value)} /><br />
        <button type="submit">Add Wedding</button>
      </form>
    </div>
  );
}

export default Weddings;
