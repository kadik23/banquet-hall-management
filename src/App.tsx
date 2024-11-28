import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "./index.css";

// Composants
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import Client from "./components/Client";
import Reservation from "./components/Reservation";
import Paiement from "./components/Paiement";
import Recu from "./components/Recu";

const ClientsPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsNbr, setClientsNbr] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        // Appels IPC pour récupérer les clients et leur nombre
        const data: Client[] = await window.sqliteClients.getClients(1);
        const nbrCl: number = await window.sqliteStatistics.getNumClients();
        setClients(data);
        setClientsNbr(nbrCl);
      } catch (err) {
        setError(`Error: ${err}`);
      }
    };

    fetchClients();
  }, []);

  const DeleteAll = async () => {
    try {
      const data = await window.sqliteClients.deleteAllClients();
      if (data.success) {
        setClientsNbr(0);
        setClients([]);
      }
    } catch (err) {
      setError(`Error: ${err}`);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            {client.name} - {client.surname} - {client.phone} - {client.address}
          </li>
        ))}
      </ul>
      <br />
      <p>
        Number of Clients: <b>{clientsNbr}</b>
      </p>
      <br />
      <button onClick={DeleteAll} className="border-2 p-1 m-2 rounded-md">
        Delete All Clients
      </button>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/reservations" element={<Reservation />} />
          <Route path="/paiements" element={<Paiement />} />
          <Route path="/recus" element={<Recu />} />
        </Routes>
      </div>
    </Router>
  );
};

const mainElement = document.createElement("div");
document.body.appendChild(mainElement);

const root = ReactDOM.createRoot(mainElement);
root.render(<App />);
