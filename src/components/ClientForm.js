import React, { useState } from 'react';

function Clients() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ajoutez ici la logique pour traiter le formulaire
    console.log({ name, phone, email, address });
  };

  return (
    <div>
      <h2>Add a Client</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} /><br />
        <label>Phone:</label>
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} /><br />
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
        <label>Address:</label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} /><br />
        <button type="submit">Add Client</button>
      </form>
    </div>
  );
}

export default Clients;
