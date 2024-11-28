import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importez useNavigate
import Header from './Header'; 
import Home from './MainDashboard'; 
import Sidebar from './Sidebar';
import MainRecu from './MainRecu';

import '../App.css'; 
import { ImPrevious } from 'react-icons/im';

function Recu() {
  const navigate = useNavigate(); 

  const handleLogout = () => {
    
    console.log('Déconnexion réussie');
    
    navigate('/'); 
  };

  return (
      <div className='grid-container'>
        <Header /> 
        <MainRecu />
        <Sidebar openSidebarToggle={true} openSidebar={() => {}} onLogout={handleLogout} /> {/* Passez handleLogout à Sidebar */}
      </div>
  );
}

export default Recu;
