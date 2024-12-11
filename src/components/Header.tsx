import React from 'react';
import { BsSearch } from 'react-icons/bs';
import '../App.css';

// Définir les props attendues pour Header
interface HeaderProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

function Header({ searchTerm, setSearchTerm }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-left">
        <div className="search-container">
          <input
            type="text"
            value={searchTerm}
            placeholder="Trouver tout..."
            className="search-bar"
            onChange={(e) => setSearchTerm(e.target.value)} // Mise à jour du searchTerm
          />
          <BsSearch className="search-icon" />
        </div>
      </div>
      <div className="header-right">
        <h1>Monsieur Iazourene</h1>
      </div>
    </header>
  );
}

export default Header;
