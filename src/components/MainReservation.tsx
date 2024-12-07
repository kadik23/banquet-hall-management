import React, { useState, useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import { FaEdit, FaTrash, FaEye, FaCaretDown } from 'react-icons/fa';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { FaCalendarAlt } from "react-icons/fa";

import { registerLocale, setDefaultLocale } from "react-datepicker";
import fr from 'date-fns/locale/fr';  // Importer la locale française

// Enregistrer et définir la locale
registerLocale('fr', fr);
setDefaultLocale('fr');

function MainReservation() {
  const loadReservationsFromLocalStorage = () => {
    const savedReservations = localStorage.getItem('reservations');
    return savedReservations ? JSON.parse(savedReservations) : [];
  };

  const [reservations, setReservations] = useState(loadReservationsFromLocalStorage());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newReservation, setNewReservation] = useState({
    id: '',
    dateDebut: '',
    heureDebut: '',
    heureFin: '',
    periode: 'matin',  // Valeur par défaut pour "periode"
    nombreInvites: '',
    dateReservation: '',
    clientAssocie: '', // Valeur par défaut vide
  });

  const getTakenDates = () => {
    return reservations.map((reservation: any) => new Date(reservation.dateDebut));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const isDateTaken = (date: Date) => {
    const takenDates = getTakenDates();
    return takenDates.some(takenDate => takenDate.toDateString() === date.toDateString());
  };


  

  // Ouvrir le modal pour ajouter une réservation
  const handleAddReservationClick = () => {
    setIsEditMode(false);
    setNewReservation({
      id: '',
      dateDebut: '',
      heureDebut: '',
      heureFin: '',
      periode: 'matin',  // Valeur par défaut pour "periode"
      nombreInvites: '',
      dateReservation: ''
    });
    setIsModalOpen(true);
  };

  const navigate = useNavigate();
  const handleClientDetails = () => {
    navigate(`/clients/`); // Redirection vers la page des détails du client
  };

  // Ouvrir la modale pour modifier une réservation
  const handleEditReservClick = (reservation: any) => {
    setIsEditMode(true);
    setNewReservation(reservation);
    setIsModalOpen(true);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewReservation({
      ...newReservation,
      [name]: value
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
  
    // Vérifier si le client a été sélectionné
    if (!newReservation.clientAssocie) {
      alert('Veuillez sélectionner un client associé.');
      return; // Empêche la soumission si aucun client n'est sélectionné
    }
  
    // Vérifier si tous les champs obligatoires sont remplis
    if (!newReservation.dateDebut || !newReservation.heureDebut || !newReservation.heureFin || !newReservation.nombreInvites || !newReservation.dateReservation) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return; // Empêche la soumission si un champ est vide
    }

    const newReservationWithId = {
      ...newReservation,
      id: isEditMode ? newReservation.id : reservations.length ? reservations[reservations.length - 1].id + 1 : 1
    };
    const updatedReservations = isEditMode
      ? reservations.map((reservation: any) => reservation.id === newReservation.id ? newReservationWithId : reservation)
      : [...reservations, newReservationWithId];

    setReservations(updatedReservations);
    localStorage.setItem('reservations', JSON.stringify(updatedReservations));
    setIsModalOpen(false);
  };

  // Supprimer une réservation
  const handleDeleteReservation = (id: number) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?");
    if (confirmDelete) {
      const updatedReservations = reservations.filter((reservation: any) => reservation.id !== id);
      setReservations(updatedReservations);
      localStorage.setItem('reservations', JSON.stringify(updatedReservations));
    }
  };

  // Supprimer toutes les réservations
  const handleDeleteAll = () => {
    const confirmDeleteAll = window.confirm("Êtes-vous sûr de vouloir supprimer toutes les réservations ?");
    if (confirmDeleteAll) {
      setReservations([]);
      localStorage.removeItem('reservations');
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const reservationsPerPage = 8;
  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = reservations.slice(indexOfFirstReservation, indexOfLastReservation);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(reservations.length / reservationsPerPage); i++) {
    pageNumbers.push(i);
  }

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const clients = [
    { id: 1, nom: 'Jean', prenom: 'Dupont' },
    { id: 2, nom: 'Marie', prenom: 'Martin' },
    { id: 3, nom: 'Paul', prenom: 'Durand' },
    { id: 3, nom: 'Paul', prenom: 'Durand' },
    { id: 3, nom: 'Paul', prenom: 'Durand' },
    { id: 3, nom: 'Paul', prenom: 'Durand' },
    { id: 3, nom: 'Paul', prenom: 'Durand' },
    { id: 3, nom: 'Paul', prenom: 'Durand' },
    { id: 3, nom: 'Paul', prenom: 'Durand' },
    // Ajoutez d'autres clients si nécessaire
  ];

  const handleSelectClient = (client) => {
    setNewReservation({
      ...newReservation,
      clientAssocie: `${client.nom} ${client.prenom}`,
    });
    setIsDropdownOpen(false);
  };
  


  const CustomInput = ({ value, onClick }) => (
    <button 
      style={{backgroundColor:'white', color:'black', border:'1px solid #ddd'}}
      
      onClick={onClick}
      type="button"
    >
      <span st >{value || "Sélectionner une date"}</span>
      <FaCalendarAlt style={{marginLeft:15}}  />
    </button>
  );
  






  return (
    <div className="main-container2">
      <div className="header-cl">
        <h3>GESTION DES RÉSERVATIONS</h3>
        <span className="reservation-count">Toutes les réservations : {reservations.length}</span>
      </div>

      <div className="footer-buttons">
        <button className="add-reservation-btn" onClick={handleAddReservationClick}>Ajouter une réservation</button>
        <button className="delete-all-btn" onClick={handleDeleteAll}>Supprimer tout</button>
      </div>



      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCloseModal}>&times;</span>
            <h3>{isEditMode ? 'Modifier une réservation' : 'Ajouter une réservation'}</h3>
            <form onSubmit={handleSubmit}>

              
              <label>Date de début du marriage:</label>
              <ReactDatePicker
                selected={newReservation.dateDebut ? new Date(newReservation.dateDebut) : null}
                onChange={(date: Date) => setNewReservation({ ...newReservation, dateDebut: date.toISOString().split('T')[0] })}
                minDate={new Date()} // Empêcher de sélectionner une date avant aujourd'hui
                filterDate={date => !isDateTaken(date)} // Désactiver les dates prises
                dateFormat="dd/MM/yyyy"
                customInput={<CustomInput/>}
                required
              />
              <label>Heure de début:</label>
              <input
                type="time"
                name="heureDebut"
                value={newReservation.heureDebut}
                onChange={handleInputChange}
                required
              />
              <label>Heure de fin:</label>
              <input
                type="time"
                name="heureFin"
                value={newReservation.heureFin}
                onChange={handleInputChange}
                required
              />
              <label>Période:</label>
              <select
                name="periode"
                value={newReservation.periode}
                onChange={handleInputChange}
                required>
                <option value="matin">Matin</option>
                <option value="soir">Soir</option>
              </select>
              <label>Nombre d'invités:</label>
              <input
                type="number"
                name="nombreInvites"
                value={newReservation.nombreInvites}
                onChange={handleInputChange}
                required
              />
              <label>Date de réservation:</label>
              <input
                type="date"
                name="dateReservation"
                value={newReservation.dateReservation}
                onChange={handleInputChange}
                required
              />

              <label>Client associé:</label>
              <div className="dropdown-wrapper">
                <div className="input-container">
                  <input
                    type="text"
                    name="clientAssocie"
                    value={newReservation.clientAssocie}
                    readOnly
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    placeholder="Cliquez pour sélectionner un client"
                    required
                  />
                  <FaCaretDown
                    className="dropdown-icon"
                    onClick={() => setIsDropdownOpen((prev) => !prev)} // Vous pouvez faire en sorte que l'icône ouvre le dropdown
                  />
                </div>

                {isDropdownOpen && (
                  <ul className="dropdown-list">
                    {clients.map((client) => (
                      <li
                        key={client.id}
                        onClick={() => handleSelectClient(client)}
                        className="client-item"
                      >
                        <span>{client.id}</span> <span>{client.nom}</span> <span>{client.prenom}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="modal-buttons">
                <button type="submit">{isEditMode ? 'Mettre à jour' : 'Ajouter'}</button>
                <button type="button" onClick={handleCloseModal}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="reservations-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date de début</th>
            <th>Heure de début</th>
            <th>Heure de fin</th>
            <th>Période</th>
            <th>Nombre invités</th>
            <th>Date de réservation</th>
            <th>Client associé</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentReservations.length === 0 ? (
            <tr>
              <td colSpan={9}>Aucune réservation ajoutée</td>
            </tr>
          ) : (
            currentReservations.map((reservation: any) => (
              <tr key={reservation.id}>
                <td>{reservation.id}</td>
                <td>{format(new Date(reservation.dateDebut), 'd-MM-yyyy')}</td>
                <td>{reservation.heureDebut}</td>
                <td>{reservation.heureFin}</td>
                <td>{reservation.periode}</td>
                <td>{reservation.nombreInvites}</td>
                <td>{format(new Date(reservation.dateReservation), 'd-MM-yyyy')}</td>
                <td >
                    <span
                      onClick={() => handleClientDetails(reservation.clientAssocie)}
                      style={{ cursor: 'pointer',  }}
                    >
                      {reservation.clientAssocie}
                    </span>
                    &nbsp;
                    
                    {/* <FaEye 
                      className="action-icon edit-icon"
                      title="Voir les détails"
                      onClick={() => handleClientDetails(reservation.clientAssocie)}
                    /> */}
                </td>
                <td>
                  <FaEdit
                    className="action-icon edit-icon"
                    title="Modifier"
                    onClick={() => handleEditReservClick(reservation)}
                  />
                  <FaTrash
                    className="action-icon delete-icon"
                    title="Supprimer"
                    onClick={() => handleDeleteReservation(reservation.id)}
                  />
                </td>
                
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        <span className="page-info">
          {Math.min(indexOfLastReservation, reservations.length)} sur {reservations.length} réservations
        </span>
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          &lt;
        </button>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === pageNumbers.length}>
          &gt;
        </button>
      </div>
    </div>
  );
}

export default MainReservation;
