import React from 'react';
import {
  BsGrid1X2Fill,
  BsPeopleFill,
  BsCalendarFill,
  BsFillCreditCardFill,
  BsFileEarmarkTextFill,
  BsBoxArrowRight,
  BsShieldLockFill, // Icône pour "Termes et conditions"
  BsFillBoxFill // Icône pour "Gestion des produits"
} from 'react-icons/bs';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Sidebar({ openSidebarToggle, openSidebar, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();  // Utiliser useLocation pour obtenir l'URL actuelle

  const handleLogout = () => {
    onLogout();
    navigate('/');  // Redirige vers la page de connexion
  };

  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
          <span className='icon wedding-icon'>💒</span>
          <span className='brand-name'>WedManage</span>
        </div>
        <span className='icon close_icon' onClick={openSidebar}>X</span>
      </div>

      <ul className='sidebar-list'>
        <li className={`sidebar-list-item ${location.pathname === "/dashboard" ? "active" : ""}`}>
          <Link to="/dashboard">
            <BsGrid1X2Fill className='icon' /> Tableau de bord
          </Link>
        </li>

        <li className={`sidebar-list-item ${location.pathname === "/clients" ? "active" : ""}`}>
          <Link to="/clients">
            <BsPeopleFill className='icon' /> Gestion des clients
          </Link>
        </li>

        <li className={`sidebar-list-item ${location.pathname === "/reservations" ? "active" : ""}`}>
          <Link to="/reservations">
            <BsCalendarFill className='icon' /> Gestion des réservations
          </Link>
        </li>

        <li className={`sidebar-list-item ${location.pathname === "/paiements" ? "active" : ""}`}>
          <Link to="/paiements">
            <BsFillCreditCardFill className='icon' /> Gestion des paiements
          </Link>
        </li>

        <li className={`sidebar-list-item ${location.pathname === "/recus" ? "active" : ""}`}>
          <Link to="/recus">
            <BsFileEarmarkTextFill className='icon' /> Gestion des reçus
          </Link>
        </li>
       

        {/* Lien "Gestion des produits" avec l'icône de boîte remplie */}
        <li className={`sidebar-list-item ${location.pathname === "/produit" ? "active" : ""}`}>
          <Link to="/produit">
            <BsFillBoxFill className='icon' /> Gestion des produits
          </Link>
        </li>

        
      </ul>

      <li className='sidebar-list-item btnn'>
        <button onClick={handleLogout} className="logout-button">
          <BsBoxArrowRight className='icon bold-icon logt' /> Déconnecter
        </button>
      </li>
    </aside>
  );
}

export default Sidebar;
