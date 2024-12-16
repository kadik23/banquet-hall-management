import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Header from './Header'; 
import Sidebar from './Sidebar';
import MainProduit from './MainProduit';


// import '../App.css'; 
import { ImPrevious } from 'react-icons/im';

function Produit() {
  const navigate = useNavigate(); 
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    
    console.log('Déconnexion réussie');
    
    navigate('/'); 
  };

  return (
      <div className='grid-container'>
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm}/> 
        <MainProduit searchTerm={searchTerm}/>
        <Sidebar openSidebarToggle={true} openSidebar={() => {}} onLogout={handleLogout} /> {/* Passez handleLogout à Sidebar */}
      </div>
  );
}

export default Produit;
