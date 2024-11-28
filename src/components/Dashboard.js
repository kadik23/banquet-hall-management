import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importez useNavigate
import Header from './Header'; 
import MainDashboard from './MainDashboard';

import Sidebar from './Sidebar';

import '../App.css'; 


function Dashboard() {
  const navigate = useNavigate(); 

  const handleLogout = () => {
    
    console.log('Déconnexion réussie');
    
    navigate('/'); 
  };

  return (
      <div className='grid-container'>
        <Header /> 
        <MainDashboard /> 
        <Sidebar openSidebarToggle={true} openSidebar={() => {}} onLogout={handleLogout} /> {/* Passez handleLogout à Sidebar */}
      </div>
  );
}

export default Dashboard;
