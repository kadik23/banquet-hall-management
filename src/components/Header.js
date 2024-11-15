import React from 'react';
import { BsSearch } from 'react-icons/bs';

function Header() {
  return (
    <header className='header'>
     
      <div className='header-left'>
        <div className='search-container'>
          <input
            type='text'
            placeholder='Trouver tout...'
            className='search-bar'
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
