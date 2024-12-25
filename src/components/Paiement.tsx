import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importez useNavigate
import Header from './Header'; 
// import Home from './Home'; 
import Sidebar from './Sidebar';
import MainPaiement from './MainPaiement';


import '../App.css'; 

function Paiement() {
  const navigate = useNavigate(); 
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    
    console.log('Déconnexion réussie');
    
    navigate('/'); 
  };

  return (
      <div className='grid-container'>
        <Header  searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> 
        <MainPaiement searchTerm={searchTerm}/>
        <Sidebar openSidebarToggle={true} openSidebar={() => {}} onLogout={handleLogout} /> {/* Passez handleLogout à Sidebar */}
      </div>
  );
}

export default Paiement;
