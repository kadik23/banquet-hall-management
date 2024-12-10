import React from "react";

import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, HashRouter } from "react-router-dom"; // Importer les composants nécessaires pour la navigation
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import Client from "./components/Client";
import Reservation from "./components/Reservation";
import Paiement from "./components/Paiement";
import Recu from "./components/Recu";
import Produit from "./components/Produit";

const App = () => {
  return (
    <HashRouter> {/* Envelopper l'application dans Router pour activer la navigation */}
      <Routes>
      <Route path="/" element={<LoginForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<Client />} />
          <Route path="/reservations" element={<Reservation />} />
          <Route path="/paiements" element={<Paiement />} />
          <Route path="/recus" element={<Recu />} />
          <Route path="/produit" element={<Produit />} />

      </Routes>
    </HashRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);