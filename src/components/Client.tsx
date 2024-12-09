import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Hcome from './MainClient';
import Sidebar from './Sidebar';
import { SearchProvider } from './SearchContext'; // Assurez-vous que le chemin est correct

function Client() {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Déconnexion réussie');
    navigate('/');
  };

  return (
    <SearchProvider>
      <div className="grid-container">
        <Header /> 
        <Hcome />
        <Sidebar openSidebarToggle={true} openSidebar={() => {}} onLogout={handleLogout} />
      </div>
    </SearchProvider>
  );
}

export default Client;
