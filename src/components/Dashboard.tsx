import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importez useNavigate
import Header from './Header'; 
import MainDashboard from './MainDashboard';

import Sidebar from './Sidebar';

import '../App.css'; 


function Dashboard() {
  const navigate = useNavigate(); 
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    
    console.log('Déconnexion réussie');
    
    navigate('/'); 
  };

  return (
      <div className='grid-container'>
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm}/> 
        <MainDashboard searchTerm={searchTerm}/> 
        <Sidebar openSidebarToggle={true} openSidebar={() => {}} onLogout={handleLogout} /> {/* Passez handleLogout à Sidebar */}
      </div>
  );
}

export default Dashboard;
