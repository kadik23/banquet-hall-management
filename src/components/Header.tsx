import React, { useContext } from 'react';
import { BsSearch } from 'react-icons/bs';
import { SearchContext } from './SearchContext';  // Assurez-vous du bon chemin vers SearchContext
import '../App.css';

function Header() {
  // Utilisation du contexte SearchContext pour accéder à searchTerm et setSearchTerm
  const context = useContext(SearchContext);

  // Vérifier si le contexte est défini
  if (!context) {
    return <div>Loading...</div>;  // Afficher un message de chargement si le contexte est undefined
  }

  const { searchTerm, setSearchTerm } = context;

  return (
    <header className='header'>
      <div className='header-left'>
        <div className='search-container'>
          <input
            type='text'
            value={searchTerm}  // Utilisation de searchTerm depuis le contexte
            placeholder='Trouver tout...'
            className='search-bar'
            onChange={(e) => setSearchTerm(e.target.value)}  // Mise à jour de searchTerm avec setSearchTerm
          />
          <BsSearch className='search-icon' />
        </div>
      </div>
      <div className='header-right'>
        <h1>Monsieur Iazourene</h1>
      </div>
    </header>
  );
}

export default Header;
