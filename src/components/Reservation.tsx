import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importez useNavigate
import Header from './Header'; 

import Sidebar from './Sidebar';
import Rcome from './MainReservation'

import '../App.css'; 
import { ImPrevious } from 'react-icons/im';
import MainReservation from './MainReservation';

function Reservation() {
  const navigate = useNavigate(); 
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    
    console.log('Déconnexion réussie');
    
    navigate('/'); 
  };

  return (
      <div className='grid-container'>
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm}/> 
        <MainReservation searchTerm={searchTerm}/>
        <Sidebar openSidebarToggle={true} openSidebar={() => {}} onLogout={handleLogout} /> {/* Passez handleLogout à Sidebar */}
      </div>
  );
}

export default Reservation;
