import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';
import Client from './Client';
import Reservation from './Reservation';
import Paiement from './Paiement';
import Recu from './Recu';
const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<Client />} />
          <Route path="/reservations" element={<Reservation />} />
          <Route path="/paiements" element={<Paiement />} />
          <Route path="/recus" element={<Recu />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
