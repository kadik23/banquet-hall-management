import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importez useNavigate
import Header from './Header'; 
import Home from './MainDashboard'; 
import Sidebar from './Sidebar';
import MainRecu from './MainRecu';

import '../App.css'; 
import { ImPrevious } from 'react-icons/im';

function Recu() {
  const navigate = useNavigate(); 
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    
    console.log('Déconnexion réussie');
    
    navigate('/'); 
  };

  return (
      <div className='grid-container'>
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm}/> 
        <MainRecu searchTerm={searchTerm}/>
        <Sidebar openSidebarToggle={true} openSidebar={() => {}} onLogout={handleLogout} /> {/* Passez handleLogout à Sidebar */}
      </div>
  );
}

export default Recu;
