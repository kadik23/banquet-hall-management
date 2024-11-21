import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importez useNavigate
import Header from './Header'; 
import Hcome from './MainClient'; 
import Sidebar from './Sidebar';

import '../App.css'; 
import '../MainClient.css'

function Client() {
  const navigate = useNavigate(); 

  const handleLogout = () => {
    
    console.log('Déconnexion réussie');
    
    navigate('/'); 
  };

  return (
      <div className='grid-container'>
        <Header /> 
        <Hcome /> 
        <Sidebar openSidebarToggle={true} openSidebar={() => {}} onLogout={handleLogout} /> {/* Passez handleLogout à Sidebar */}
      </div>
  );
}

export default Client;
