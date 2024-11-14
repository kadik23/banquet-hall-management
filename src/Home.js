import React from 'react';
import {
  BsPeopleFill,               // Icône pour les clients
  BsFillCalendarFill,         // Icône pour les réservations
  BsFillCheckCircleFill,      // Icône pour les réservations confirmées
  BsFillCreditCardFill,       // Icône pour les paiements en attente
  BsFillWalletFill,           // Icône pour les paiements confirmés
  BsFillFileEarmarkTextFill   // Icône pour les reçus générés
} from 'react-icons/bs';

function Home() {
  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>TABLEAU DE BORD</h3>
      </div>

      <div className='main-cards'>
        <div className='card'>
          <div className='card-inner'>
            <h3>CLIENTS</h3>
            <BsPeopleFill className='card_icon' /> {/* Icône pour plusieurs utilisateurs */}
          </div>
          <h1>1500</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>RÉSERVATIONS EN ATTENTE</h3>
            <BsFillCalendarFill className='card_icon' />
          </div>
          <h1>65</h1>
        </div>
       
        <div className='card'>
          <div className='card-inner'>
            <h3>PAIEMENTS EN ATTENTE</h3>
            <BsFillCreditCardFill className='card_icon' />
          </div>
          <h1>05</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>PAIEMENTS CONFIRMÉS</h3>
            <BsFillWalletFill className='card_icon' />
          </div>
          <h1>60</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>REÇUS GÉNÉRÉS</h3>
            <BsFillFileEarmarkTextFill className='card_icon' />
          </div>
          <h1>60</h1>
        </div>
      </div>
    </main>
  );
}

export default Home;
