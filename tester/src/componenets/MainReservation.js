import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import '../App.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function MainReservation() {
  const [reservations, setReservations] = useState([
    {
      id: 1,
      dateDebut: '29-11-2024',
      periode: 'Matin',
      heureDebut: '10:00',
      heureFin: '12:00',
      nombreInvites: 50,
      dateReservation: '01-11-2024',
      clientAssocie: 'Jean Dupont',
    },
    {
      id: 2,
      dateDebut: '03-12-2024',
      periode: 'Après-midi',
      heureDebut: '14:00',
      heureFin: '16:00',
      nombreInvites: 100,
      dateReservation: '02-11-2024',
      clientAssocie: 'Marie Martin',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newReservation, setNewReservation] = useState({
    id: null,
    dateDebut: '',
    periode: '',
    heureDebut: '',
    heureFin: '',
    nombreInvites: '',
    dateReservation: '',
    clientAssocie: '',
  });

  const [startDate, setStartDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reservationsPerPage = 8;

  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = reservations.slice(
    indexOfFirstReservation,
    indexOfLastReservation
  );

  const reservedDates = reservations.map((res) =>
    new Date(res.dateDebut.split('-').reverse().join('-'))
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddReservationClick = () => {
    setIsEditMode(false);
    setNewReservation({
      id: null,
      dateDebut: '',
      periode: '',
      heureDebut: '',
      heureFin: '',
      nombreInvites: '',
      dateReservation: '',
      clientAssocie: '',
    });
    setStartDate(null);
    setIsModalOpen(true);
  };

  const handleEditReservationClick = (reservation) => {
    setIsEditMode(true);
    setNewReservation(reservation);
    setStartDate(new Date(reservation.dateDebut.split('-').reverse().join('-')));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReservation({
      ...newReservation,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setStartDate(date);
    setNewReservation({
      ...newReservation,
      dateDebut: date ? date.toLocaleDateString('fr-FR') : '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      setReservations(
        reservations.map((reservation) =>
          reservation.id === newReservation.id ? newReservation : reservation
        )
      );
    } else {
      const newReservationWithId = {
        id: Date.now(),
        ...newReservation,
      };
      setReservations((prevReservations) => [
        ...prevReservations,
        newReservationWithId,
      ]);
    }
    setNewReservation({
      dateDebut: '',
      periode: '',
      heureDebut: '',
      heureFin: '',
      nombreInvites: '',
      dateReservation: '',
      clientAssocie: '',
    });
    setIsModalOpen(false);
  };

  const handleDeleteReservation = (id) => {
    setReservations(reservations.filter((reservation) => reservation.id !== id));
  };

  const handleDeleteAll = () => {
    setReservations([]);
  };

  const dayClassName = (date) => {
    if (reservedDates.some((reservedDate) => reservedDate.getTime() === date.getTime())) {
      return 'reserved-date'; // Classe pour dates réservées
    }
    return ''; // Pas de classe spéciale pour les dates disponibles
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(reservations.length / reservationsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="main-container2">
      <div className="header-cl">
        <h3>GESTION DES RÉSERVATIONS</h3>
        <span className="reservation-count">
          Toutes les réservations : {reservations.length}
        </span>
      </div>
      <div className="footer-buttons">
        <button className="add-reservation-btn" onClick={handleAddReservationClick}>
          Ajouter une réservation
        </button>
        <button className="delete-all-btn" onClick={handleDeleteAll}>
          Supprimer tout
        </button>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCloseModal}>
              &times;
            </span>
            <h3>{isEditMode ? 'Modifier une réservation' : 'Ajouter une réservation'}</h3>
            <form onSubmit={handleSubmit}>
              <label>Date de début:</label>
              <DatePicker
                selected={startDate}
                onChange={handleDateChange}
                dateFormat="dd-MM-yyyy"
                minDate={new Date()} // Dates passées interdites
                excludeDates={reservedDates} // Dates réservées exclues
                dayClassName={dayClassName} // Couleur des jours
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
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
                <button type="button" onClick={handleCloseModal}>
                  Annuler
                </button>
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
              <td colSpan="9" style={{ textAlign: 'center' }}>
                Aucune réservation disponible
              </td>
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
                    className="edit-icon"
                    onClick={() => handleEditReservationClick(reservation)}
                  />
                  <FaTrash
                    className="delete-icon"
                    onClick={() => handleDeleteReservation(reservation.id)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={currentPage === number ? 'active' : ''}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MainReservation;
