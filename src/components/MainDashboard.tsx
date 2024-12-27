import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BsPeopleFill,
  BsFillCalendarFill,
  BsFillCreditCardFill,
  BsFillWalletFill,
  BsFillFileEarmarkTextFill,
} from 'react-icons/bs';

function MainDashboard({searchTerm}:{searchTerm:string}) {
  const [clients, setclients] = useState(0)
  const [waitingReservation, setwaitingReservation] = useState(0)
  const [waitingPayments, setwaitingPayments] = useState(0)
  const [confirmPayments, setconfirmPayments] = useState(0)
  const [receipts, setreceipts] = useState(0)
  useEffect(() => {
    const getStatistics = async () => { 
      try {
        setclients(await window.sqliteStatistics.getNumClients())
        setwaitingReservation(await window.sqliteStatistics.getNumPendingPayments())
        setwaitingPayments(await window.sqliteStatistics.getNumPendingPayments())
        setconfirmPayments(await window.sqliteStatistics.getNumConfirmPayments())
        setreceipts(await window.sqliteStatistics.getNumReceipts())
      } catch (error) {
        alert(error)
        window.electron.fixFocus
      }
    }
    getStatistics()
  }, [])
  
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
          {clients && (<h1>{clients}</h1>)}
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>RÉSERVATIONS EN ATTENTE</h3>
            <BsFillCalendarFill className="card_icon" />
          </div>
          {waitingReservation && (<h1>{waitingReservation}</h1>)}
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>PAIEMENTS EN ATTENTE</h3>
            <BsFillCreditCardFill className="card_icon" />
          </div>
          <h1>{waitingPayments}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>PAIEMENTS CONFIRMÉS</h3>
            <BsFillWalletFill className="card_icon" />
          </div>
          {confirmPayments && (<h1>{confirmPayments}</h1>)}
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>REÇUS GÉNÉRÉS</h3>
            <BsFillFileEarmarkTextFill className="card_icon" />
          </div>
          {receipts && (<h1>{receipts}</h1>)}
        </div>
      </div>
    </main>
  );
}

export default MainDashboard;
