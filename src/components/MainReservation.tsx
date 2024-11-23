import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import '../App.css';

function MainReservation() {
  const [reservations, setReservations] = useState([
    { 
      id: 1, 
      dateDebut: '2024-11-10', 
      periode: 'Matin', 
      heureDebut: '10:00', 
      heureFin: '12:00', 
      nombreInvites: 50, 
      dateReservation: '2024-11-01', 
      clientAssocie: 'Jean Dupont'
    },
    { 
      id: 2, 
      dateDebut: '2024-11-15', 
      periode: 'Après-midi', 
      heureDebut: '14:00', 
      heureFin: '16:00', 
      nombreInvites: 100, 
      dateReservation: '2024-11-02', 
      clientAssocie: 'Marie Martin'
    },
    { 
      id: 3, 
      dateDebut: '2024-11-15', 
      periode: 'Après-midi', 
      heureDebut: '14:00', 
      heureFin: '16:00', 
      nombreInvites: 100, 
      dateReservation: '2024-11-02', 
      clientAssocie: 'Marie Martin'
    },
    { 
      id: 4, 
      dateDebut: '2024-11-15', 
      periode: 'Après-midi', 
      heureDebut: '14:00', 
      heureFin: '16:00', 
      nombreInvites: 100, 
      dateReservation: '2024-11-02', 
      clientAssocie: 'Marie Martin'
    },
    { 
      id: 5, 
      dateDebut: '2024-11-15', 
      periode: 'Après-midi', 
      heureDebut: '14:00', 
      heureFin: '16:00', 
      nombreInvites: 100, 
      dateReservation: '2024-11-02', 
      clientAssocie: 'Marie Martin'
    },
    { 
      id: 6, 
      dateDebut: '2024-11-15', 
      periode: 'Après-midi', 
      heureDebut: '14:00', 
      heureFin: '16:00', 
      nombreInvites: 100, 
      dateReservation: '2024-11-02', 
      clientAssocie: 'Marie Martin'
    },
    { 
      id: 7, 
      dateDebut: '2024-11-15', 
      periode: 'Après-midi', 
      heureDebut: '14:00', 
      heureFin: '16:00', 
      nombreInvites: 100, 
      dateReservation: '2024-11-02', 
      clientAssocie: 'Marie Martin'
    },
    { 
      id: 8, 
      dateDebut: '2024-11-15', 
      periode: 'Après-midi', 
      heureDebut: '14:00', 
      heureFin: '16:00', 
      nombreInvites: 100, 
      dateReservation: '2024-11-02', 
      clientAssocie: 'Marie Martin'
    },
    { 
      id: 9, 
      dateDebut: '2024-11-15', 
      periode: 'Après-midi', 
      heureDebut: '14:00', 
      heureFin: '16:00', 
      nombreInvites: 100, 
      dateReservation: '2024-11-02', 
      clientAssocie: 'Marie Martin'
    },
    { 
      id: 10, 
      dateDebut: '2024-11-15', 
      periode: 'Après-midi', 
      heureDebut: '14:00', 
      heureFin: '16:00', 
      nombreInvites: 100, 
      dateReservation: '2024-11-02', 
      clientAssocie: 'Marie Martin'
    },
    // Ajoutez plus de réservations pour tester...
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false); // Gérer l'état du modal
  const [isEditMode, setIsEditMode] = useState(false); // Gérer le mode édition
  const [newReservation, setNewReservation] = useState({
    id: null,
    dateDebut: '',
    periode: '',
    heureDebut: '',
    heureFin: '',
    nombreInvites: '',
    dateReservation: '',
    clientAssocie: ''
  });

  const [currentPage, setCurrentPage] = useState(1); // Page courante
  const reservationsPerPage = 8; // Nombre de réservations par page

  // Calculer l'index des premiers et derniers clients à afficher pour la pagination
  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = reservations.slice(indexOfFirstReservation, indexOfLastReservation);

  // Fonction pour changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Ouvrir le modal pour ajouter une réservation
  const handleAddReservationClick = () => {
    setIsEditMode(false); // Assurer qu'on est en mode ajout
    setNewReservation({
      id: null,
      dateDebut: '',
      periode: '',
      heureDebut: '',
      heureFin: '',
      nombreInvites: '',
      dateReservation: '',
      clientAssocie: ''
    }); // Réinitialiser le formulaire
    setIsModalOpen(true);
  };

  // Ouvrir le modal pour modifier une réservation
  const handleEditReservationClick = (reservation) => {
    setIsEditMode(true); // Passer en mode édition
    setNewReservation(reservation); // Remplir le formulaire avec les données de la réservation sélectionnée
    setIsModalOpen(true);
  };

  // Fermer le modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReservation({
      ...newReservation,
      [name]: value
    });
  };

  // Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      // Mise à jour d'une réservation existante
      setReservations(reservations.map(reservation => reservation.id === newReservation.id ? newReservation : reservation));
    } else {
      // Ajouter une nouvelle réservation avec un ID unique
      const newReservationWithId = {
        id: Date.now(), // Utiliser l'heure actuelle pour un ID unique
        ...newReservation
      };
      setReservations(prevReservations => [...prevReservations, newReservationWithId]);
    }
    setNewReservation({
      dateDebut: '',
      periode: '',
      heureDebut: '',
      heureFin: '',
      nombreInvites: '',
      dateReservation: '',
      clientAssocie: ''
    });
    setIsModalOpen(false); // Fermer le modal après soumission
  };

  // Supprimer une réservation spécifique
  const handleDeleteReservation = (id) => {
    setReservations(reservations.filter(reservation => reservation.id !== id));
  };

  // Supprimer toutes les réservations
  const handleDeleteAll = () => {
    setReservations([]); // Vide la liste des réservations
  };

  // Calculer le nombre de pages
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(reservations.length / reservationsPerPage); i++) {
    pageNumbers.push(i);
  }

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

      {/* Modal Formulaire */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCloseModal}>&times;</span>
            <h3>{isEditMode ? 'Modifier une réservation' : 'Ajouter une réservation'}</h3>
            <form onSubmit={handleSubmit}>
              <label>Date de début:</label>
              <input
                type="date"
                name="dateDebut"
                value={newReservation.dateDebut}
                onChange={handleInputChange}
                required
              />
              <label>Période:</label>
              <input
                type="text"
                name="periode"
                value={newReservation.periode}
                onChange={handleInputChange}
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
              <input
                type="text"
                name="clientAssocie"
                value={newReservation.clientAssocie}
                onChange={handleInputChange}
                required
              />
              <div className="modal-buttons">
                <button type="submit">{isEditMode ? 'Modifier' : 'Ajouter'}</button>
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
            <th>Période</th>
            <th>Heure de début</th>
            <th>Heure de fin</th>
            <th>Nombre d’invités</th>
            <th>Date de réservation</th>
            <th>Client associé</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentReservations.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ textAlign: 'center' }}>Aucune réservation disponible</td>
            </tr>
          ) : (
            currentReservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.id}</td>
                <td>{reservation.dateDebut}</td>
                <td>{reservation.periode}</td>
                <td>{reservation.heureDebut}</td>
                <td>{reservation.heureFin}</td>
                <td>{reservation.nombreInvites}</td>
                <td>{reservation.dateReservation}</td>
                <td>{reservation.clientAssocie}</td>
                <td>
                  <FaEdit
                    className="action-icon edit-icon"
                    title="Éditer"
                    onClick={() => handleEditReservationClick(reservation)}
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

      {/* Pagination */}
      <div className="pagination">
  <span className="page-info">
    {indexOfLastReservation} sur {reservations.length} réservations
  </span>
  <button 
    onClick={() => paginate(currentPage - 1)} 
    disabled={currentPage === 1}
  >
    &lt;
  </button>
  <button 
    onClick={() => paginate(currentPage + 1)} 
    disabled={currentPage === pageNumbers.length}
  >
    &gt;
  </button>
</div>

    </div>
  );
}

export default MainReservation;
