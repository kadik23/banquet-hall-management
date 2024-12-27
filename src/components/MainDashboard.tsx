import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BsPeopleFill,
  BsFillCalendarFill,
  BsFillCreditCardFill,
  BsFillWalletFill,
  BsFillFileEarmarkTextFill,
} from 'react-icons/bs';

function MainDashboard() {
  const [nbrClients, setNbrClients] = useState(0);
  const navigate = useNavigate(); // Hook pour la navigation

  useEffect(() => {
    const fetchNbrClients = async () => {
      try {
        const totalClients = await window.sqliteStatistics.getNumClients();
        setNbrClients(totalClients);
      } catch (error) {
        console.error('Erreur lors de la récupération du nombre de clients :', error);
      }
    };

    fetchNbrClients();
  }, []);

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>TABLEAU DE BORD</h3>
      </div>

      <div className="main-cards">
        <div
          className="card"
          onClick={() => navigate('/clients')} // Redirige vers la page MainClient
          style={{ cursor: 'pointer' }} // Ajoute un curseur pour indiquer que c'est cliquable
        >
          <div className="card-inner">
            <h3>CLIENTS</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <h1>{nbrClients}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>RÉSERVATIONS EN ATTENTE</h3>
            <BsFillCalendarFill className="card_icon" />
          </div>
          <h1>65</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>PAIEMENTS EN ATTENTE</h3>
            <BsFillCreditCardFill className="card_icon" />
          </div>
          <h1>05</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>PAIEMENTS CONFIRMÉS</h3>
            <BsFillWalletFill className="card_icon" />
          </div>
          <h1>60</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>REÇUS GÉNÉRÉS</h3>
            <BsFillFileEarmarkTextFill className="card_icon" />
          </div>
          <h1>60</h1>
        </div>
      </div>
    </main>
  );
}

export default MainDashboard;
