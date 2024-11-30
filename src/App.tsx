import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Importer les composants nécessaires pour la navigation
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import Client from "./components/Client";
import Reservation from "./components/Reservation";
import Paiement from "./components/Paiement";
import Recu from "./components/Recu";

// Créer un élément div pour le rendu
const mainElement = document.createElement("div");
document.body.appendChild(mainElement);

const App = () => {
  return (
    <Router> {/* Envelopper l'application dans Router pour activer la navigation */}
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<Client />} />
        <Route path="/reservations" element={<Reservation />} />
        <Route path="/paiements" element={<Paiement />} />
        <Route path="/recus" element={<Recu />} />
      </Routes>
    </Router>
  );
};

// Initialiser le root et rendre l'application
const root = ReactDOM.createRoot(mainElement);
root.render(<App />);
