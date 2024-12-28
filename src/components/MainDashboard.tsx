import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BsPeopleFill,
  BsFillCalendarFill,
  BsFillCreditCardFill,
  BsFillWalletFill,
  BsFillFileEarmarkTextFill,
} from 'react-icons/bs';

function MainDashboard({ searchTerm }: { searchTerm: string }) {
  const [clients, setClients] = useState(0);
  const [reservations, setReservations] = useState(0);
  const [waitingPayments, setWaitingPayments] = useState(0);
  const [confirmedPayments, setConfirmedPayments] = useState(0);
  const [receipts, setReceipts] = useState(0);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const getStatistics = async () => {
      try {
        setClients(await window.sqliteStatistics.getNumClients());
        setReservations(await window.sqliteStatistics.getNumReservation());
        setWaitingPayments(await window.sqliteStatistics.getNumPendingPayments());
        setConfirmedPayments(await window.sqliteStatistics.getNumConfirmPayments());
        setReceipts(await window.sqliteStatistics.getNumReceipts());
      } catch (err) {
        setError(err.message || 'Une erreur est survenue.');
        window.electron.fixFocus();
      }
    };
    getStatistics();
  }, []);

  return (
    <main className="main-container">
      {error && <div className="error">{error}</div>}
      <div className="main-title">
        <h3>TABLEAU DE BORD</h3>
      </div>
      <div className="main-cards">
        <div className="card" onClick={() => navigate('/clients')} style={{ cursor: 'pointer' }}>
          <div className="card-inner">
            <h3>CLIENTS</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <h1>{clients}</h1>
        </div>
        <div className="card" onClick={() => navigate('/reservations')} style={{ cursor: 'pointer' }}>
          <div className="card-inner">
            <h3>RÉSERVATIONS </h3>
            <BsFillCalendarFill className="card_icon" />
          </div>
          <h1>{reservations}</h1>
        </div>
        <div
         className="card"
         onClick={() => navigate('/paiements')} // Redirige vers la page MainClient
         style={{ cursor: 'pointer' }}
         >
          <div className="card-inner">
            <h3>PAIEMENTS EN ATTENTE</h3>
            <BsFillCreditCardFill className="card_icon" />
          </div>
          <h1>{waitingPayments}</h1>
        </div>
        <div
         className="card"
         onClick={() => navigate('/paiements')} // Redirige vers la page MainClient
         style={{ cursor: 'pointer' }}
         >
          <div className="card-inner">
            <h3>PAIEMENTS CONFIRMÉS</h3>
            <BsFillWalletFill className="card_icon" />
          </div>
          <h1>{confirmedPayments}</h1>
        </div>
        <div 
          className="card"
          onClick={() => navigate('/recus')}
          style={{ cursor: 'pointer' }}
          >
          <div className="card-inner">
            <h3>REÇUS GÉNÉRÉS</h3>
            <BsFillFileEarmarkTextFill className="card_icon" />
          </div>
          <h1>{receipts}</h1>
        </div>
      </div>
    </main>
  );
}

export default MainDashboard;
