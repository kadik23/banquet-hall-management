import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import MainClient from './MainClient';
import Sidebar from './Sidebar';

function Client() {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Déconnexion réussie');
    navigate('/');
  };
  
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="grid-container">
      {/* Intégration du composant Header avec searchTerm et setSearchTerm */}
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {/* Passer searchTerm à MainClient pour filtrage */}
      <MainClient searchTerm={searchTerm}/>
      <Sidebar openSidebarToggle={true} openSidebar={() => {}} onLogout={handleLogout} />
    </div>
  );
}

export default Client;
