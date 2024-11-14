import React, { useState } from 'react';

function Payments() {
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ajoutez ici la logique pour traiter le formulaire
    console.log({ amount, date });
  };

  return (
    <div>
      <h2>Add a Payment</h2>
      <form onSubmit={handleSubmit}>
        <label>Amount:</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} /><br />
        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} /><br />
        <button type="submit">Add Payment</button>
      </form>
    </div>
  );
}

export default Payments;
