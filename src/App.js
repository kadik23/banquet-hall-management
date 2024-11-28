import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import Client from './components/Client'
import Reservation from './components/Reservation';
import Paiement from './components/Paiement';
import Recu from './components/Recu';

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
