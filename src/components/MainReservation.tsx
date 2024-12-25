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

// Types pour Reservation et Client
type Reservation = {
  id?: number;
  start_date: string;
  start_hour: string;
  end_hour: string;
  period: string;
  nbr_invites: number;
  date_reservation: string;
  client_id: number;
};

type Client = {
  id: number;
  name: string;
  surname: string;
};

function MainReservation({ searchTerm }: { searchTerm: string }) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newReservation, setNewReservation] = useState<Reservation>({
    start_date: '',
    start_hour: '',
    end_hour: '',
    period: 'morning',
    nbr_invites: 0,
    date_reservation: '',
    client_id: 0,
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    setFilteredReservations(reservations.filter((reservation) =>
      [reservation.client_id, reservation.date_reservation, reservation.start_date, reservation.period, reservation.nbr_invites, reservation.surname, reservation.name]
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    ));
  }, [searchTerm, reservations]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data: Reservation[] = await window.sqliteReservation.getReservations();
        const clientData: Client[] = await window.sqliteClients.getClients();
        setClients(clientData);
        setReservations(data);
      } catch (err) {
        window.alert(`Error: ${err}`);
        window.electron.fixFocus();
      }
    };

    fetchClients();
  }, []);

  const getTakenDates = () => {
    return filteredReservations.map((reservation: any) => {
      const takenDate = new Date(reservation.start_date);
      takenDate.setHours(0, 0, 0, 0); // Réinitialiser l'heure à minuit pour comparer uniquement les dates
      return takenDate;
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const isDateTaken = (date: Date) => {
    const takenDates = getTakenDates();
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0); // Réinitialiser l'heure de la date sélectionnée à minuit pour comparer uniquement la date
    return takenDates.some(takenDate => takenDate.getTime() === selectedDate.getTime());
  };

  // Ouvrir le modal pour ajouter une réservation
  const handleAddReservationClick = () => {
    setIsEditMode(false);
    setNewReservation({
      start_date: '',
      start_hour: '',
      end_hour: '',
      period: 'morning',
      nbr_invites: 0,
      date_reservation: '',
      client_id: 0,
    });
    setIsModalOpen(true);
  };

  const navigate = useNavigate();
  const handleClientDetails = () => {
    navigate('/clients'); // Redirection vers la page des détails du client
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Vérifier si le client a été sélectionné
    if (!newReservation.client_id) {
      alert('Veuillez sélectionner un client associé.');
      return; // Empêche la soumission si aucun client n'est sélectionné
    }

    // Vérifier si tous les champs obligatoires sont remplis
    if (!newReservation.start_date || !newReservation.start_hour || !newReservation.end_hour || !newReservation.nbr_invites || !newReservation.date_reservation) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return; // Empêche la soumission si un champ est vide
    }

    let newReservationWithId: Reservation = newReservation;
    if (isEditMode) {
      newReservationWithId = {
        ...newReservation,
        id: newReservation.id
      };
      const data = await window.sqliteReservation.editReservation(newReservationWithId.id as number, newReservationWithId.client_id, newReservationWithId.start_date, newReservationWithId.period, newReservationWithId.start_hour, newReservationWithId.end_hour, newReservationWithId.nbr_invites, newReservationWithId.date_reservation);
      window.alert(`Reservation ${newReservation.id} was edited successfully`);
    } else {
      const data = await window.sqliteReservation.createReservation(newReservationWithId.client_id, newReservationWithId.start_date, newReservationWithId.period, newReservationWithId.start_hour, newReservationWithId.end_hour, newReservationWithId.nbr_invites, newReservationWithId.date_reservation);
      newReservationWithId = {
        ...newReservation,
        id: data.reservationId
      };
      window.alert(`Reservation ${data.reservationId} was created successfully`);
    }

    const updatedReservations = isEditMode
      ? reservations.map((reservation: any) => reservation.id === newReservation.id ? newReservationWithId : reservation)
      : [...reservations, newReservationWithId];
    window.electron.fixFocus();
    setReservations(updatedReservations);
    setIsModalOpen(false);
  };

  // Supprimer une réservation
  const handleDeleteReservation = async (id: number) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?");
    if (confirmDelete) {
      try {
        const data = await window.sqliteReservation.deleteReservation(id);
        window.alert(data.message);
        const updatedReservations = reservations.filter((reservation: Reservation) => reservation.id !== id);
        setReservations(updatedReservations);
      } catch (e) {
        console.error('Error deleting reservation:', e);
      }
    }
    window.electron.fixFocus();
  };

  // Supprimer toutes les réservations
  const handleDeleteAll = async () => {
    const confirmDeleteAll = window.confirm("Êtes-vous sûr de vouloir supprimer toutes les réservations ?");
    if (confirmDeleteAll) {
      try {
        const data = await window.sqliteReservation.deleteAllReservations();
        window.alert(data.message);
        setReservations([]);
      } catch (e) {
        console.error('Error deleting all reservations:', e);
      }
    }
    window.electron.fixFocus();
  };

  const [currentPage, setCurrentPage] = useState(1);
  const reservationsPerPage = 3;
  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = filteredReservations.slice(indexOfFirstReservation, indexOfLastReservation);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredReservations.length / reservationsPerPage); i++) {
    pageNumbers.push(i);
  }

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelectClient = (client: Pick<Client, 'id' | 'name' | 'surname'>) => {
    setNewReservation({
      ...newReservation,
      client_id: client.id,
    });
    setIsDropdownOpen(false);
  };

  const CustomInput = ({ value, onClick }: any) => (
    <button 
      style={{backgroundColor:'white', color:'black', border:'1px solid #ddd'}}
      
      onClick={onClick}
      type="button"
    >
      <span >{value || "Sélectionner une date"}</span>
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
              <label>Date de début du mariage:</label>
              <ReactDatePicker
                selected={newReservation.start_date ? new Date(newReservation.start_date) : null}
                onChange={(date: Date | null) => setNewReservation({ 
                  ...newReservation, 
                  start_date: date ? format(date, 'yyyy-MM-dd') : '' // Utilisation de la fonction format de date-fns
                })}
                minDate={new Date()} // Empêcher de sélectionner une date avant aujourd'hui
                filterDate={date => !isDateTaken(date)} // Désactiver les dates prises
                dateFormat="dd/MM/yyyy"
                customInput={<CustomInput />}
                required
              />
  
              <label>Heure de début:</label>
              <input
                type="time"
                name="start_hour"
                value={newReservation.start_hour}
                onChange={handleInputChange}
                required
              />
              <label>Heure de fin:</label>
              <input
                type="time"
                name="end_hour"
                value={newReservation.end_hour}
                onChange={handleInputChange}
                required
              />
              <label>Période:</label>
              <select
                name="period"
                value={newReservation.period}
                onChange={handleInputChange}
                required
              >
                <option value="morning">Matin</option>
                <option value="evening">Soir</option>
              </select>
              <label>Nombre d'invités:</label>
              <input
                type="number"
                name="nbr_invites"
                value={newReservation.nbr_invites}
                onChange={handleInputChange}
                required
              />
              <label>Date de réservation:</label>
              <input
                type="date"
                name="date_reservation"
                value={newReservation.date_reservation}
                onChange={handleInputChange}
                required
              />
  
              <label>Client associé:</label>
              <div className="dropdown-wrapper">
                <div className="input-container">
                  <input
                    type="text"
                    name="client_id"
                    value={newReservation.client_id}
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
                        <span>{client.id}</span> <span>{client.name}</span> <span>{client.surname}</span>
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
            currentReservations.map((reservation: Reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.id}</td>
                <td>{format(new Date(reservation.start_date), 'd-MM-yyyy')}</td>
                <td>{reservation.start_hour}</td>
                <td>{reservation.end_hour}</td>
                {reservation.period == 'morning' ? <td>Matin</td> : <td>Soir</td>}
                <td>{reservation.nbr_invites}</td>
                <td>{format(new Date(reservation.date_reservation), 'd-MM-yyyy')}</td>
                <td>
                  {/* <span
                    onClick={() => handleClientDetails()}
                    style={{ cursor: 'pointer' }}
                  >
                    {reservation.name ? (<>{reservation.name} {reservation.surname}</>) : (<>{reservation.id}</>)}
                  </span> */}
                  {reservation.client_id}
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
                    onClick={() => handleDeleteReservation(reservation.id as number)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
  
      <div className="pagination">
        <span className="page-info">
          {Math.min(indexOfLastReservation, filteredReservations.length)} sur {filteredReservations.length} réservations
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
  