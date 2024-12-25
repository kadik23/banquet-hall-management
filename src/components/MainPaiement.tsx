import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaCaretDown } from 'react-icons/fa';
import '../App.css';
import Reservation from './Reservation';


type Payment = {
  id?: number; 
  montantTotal: number; 
  montantPaye: number; 
  soldeRestant: number; 
  datePaiement: string; 
  client_id: number; 
  reserv_id: number;
  statut: 'Payé' | 'En attente'; 
};


type Client = {
  id: number;
  name: string;
  surname: string;
};


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

function MainPaiement() {
  const [Paiments, setPaiments] = useState<Payment[]>([]);

 
  

  const [filter, setFilter] = useState('Tous');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newPayment, setNewPayment] = useState<Payment>({
    montantTotal: undefined, 
    montantPaye: undefined, 
    soldeRestant: undefined, 
    datePaiement: '', 
    client_id: undefined, 
    reserv_id: undefined, 
    statut: 'En attente' 
  });
  
  

  const [clients, setClients] = useState<Client[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PaimentsPerPage = 8; // Nombre de paiements par page

  const indexOfLastPayment = currentPage * PaimentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - PaimentsPerPage;


    // useEffect(() => {
    //   const fetchClients = async () => {
    //     try {
    //       const data: Payment[] = await window.sqliteReservation.getReservations();
    //       const clientData: Client[] = await window.sqliteClients.getClients();
    //       setClients(clientData);
    //       setPaiments(data);
    //     } catch (err) {
    //       window.alert(`Error: ${err}`);
    //       window.electron.fixFocus();
    //     }
    //   };
  
    //   fetchClients();
    // }, []);


    
    // useEffect(() => {
    //   const fetchReservations = async () => {
    //     try {
    //       const data: Payment[] = await window.sqliteReservation.getReservations();
    //       const reservationData: Reservation[] = await window.sqliteReservation. getReservations();
    //       setReservations(reservationData);
    //       setPaiments(data);
    //     } catch (err) {
    //       window.alert(`Error: ${err}`);
    //       window.electron.fixFocus();
    //     }
    //   };
  
    //   fetchReservations();
    // }, []);

  const handleFilterChange = (e:any) => {
    setFilter(e.target.value);
    setCurrentPage(1);
  };

  const filteredPaiments = Paiments.filter(
    (payment) => filter === 'Tous' || payment.statut === filter
  );

  const currentPaiments = filteredPaiments.slice(indexOfFirstPayment, indexOfLastPayment);

  const paginate = (pageNumber:number) => setCurrentPage(pageNumber);

  


  const handleAddPaymentClick = () => {
    setIsEditMode(false);
    setNewPayment({
      montantTotal: undefined, 
      montantPaye: undefined, 
      soldeRestant: undefined, 
      datePaiement: '', 
      client_id: undefined, 
      reserv_id: undefined, 
      statut: 'En attente' 
    });
    setIsModalOpen(true);
  };
  
  

  const handleEditPaymentClick = (payment:any) => {
    setIsEditMode(true);
    setNewPayment(payment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setNewPayment({
      ...newPayment,
      [name]: value
    });
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    if (isEditMode) {
      setPaiments(Paiments.map((payment:any) => payment.id === newPayment.id ? newPayment : payment));
    } else {
      const newPaymentWithId = { id: Date.now(), ...newPayment };
      setPaiments([...Paiments, newPaymentWithId]);
    }
    setIsModalOpen(false);
  };

  const handleDeletePayment = (id:number) => {
    setPaiments(Paiments.filter(payment => payment.id !== id));
  };

  const handleDeleteAll = () => {
    setPaiments([]);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredPaiments.length / PaimentsPerPage); i++) {
    pageNumbers.push(i);
  }


   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  //  reservation
  
    const handleSelectReservation = (reserv: Pick<Reservation, 'id' | 'date_reservation' >) => {
      setNewPayment({
        ...newPayment,
        reserv_id: Reservation.id,
      });
      setIsDropdownOpen(false);
    };


  // clients

  const handleSelectClient = (client: Pick<Client, 'id' | 'name' | 'surname'>) => {
    setNewPayment({
      ...newPayment,
      client_id: client.id,
    });
    setIsDropdownOpen(false);
  };




  return (
    <div className="main-container2">
      <div className="header-cl">
        <h3>GESTION DES PAIEMENTS</h3>
        <span className="payment-count">Nombre de paiements : {filteredPaiments.length}</span>
      </div>

      <div className="footer-buttons">
        <button className="add-payment-btn" onClick={handleAddPaymentClick}>
          Ajouter un paiement
        </button>
        <div className="filter-buttons">
          <label htmlFor="filter-select" className="filt">Filtrer par statut :</label>
          <select id="filter-select" value={filter} onChange={handleFilterChange}>
            <option value="Tous">Tous</option>
            <option value="En attente">En attente</option>
            <option value="Payé">Payé</option>
          </select>
        </div>
        <button className="delete-all-btn" onClick={handleDeleteAll}>
          Supprimer tout
        </button>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCloseModal}>&times;</span>
            <h3>{isEditMode ? 'Modifier un paiement' : 'Ajouter un paiement'}</h3>
            <form onSubmit={handleSubmit}>
              {/* Montant total */}
              <label>Montant total:</label>
              <input
                type="text"
                name="montantTotal"
                value={newPayment.montantTotal ?? ''} 
                placeholder="Entrez le montant total"
                onChange={(e) => {

                  const value = e.target.value;
                  if (/^\d*\.?\d*$/.test(value)) {
                    setNewPayment({
                      ...newPayment,
                      montantTotal: value 
                    });
                  }
                }}
                onBlur={(e) => {
                  // Convertit la valeur en nombre à la fin de la saisie
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value) && value >= 0) {
                    setNewPayment({
                      ...newPayment,
                      montantTotal: value 
                    });
                  }
                }}
                required
              />


              {/* Montant payé */}
              <label>Montant payé:</label>
              <input
                type="text"
                name="montantPaye"
                value={newPayment.montantPaye ?? ''}
                placeholder="Entrez le montant payé"
                onChange={(e) => {
                  
                  const value = e.target.value;
                  if (/^\d*\.?\d*$/.test(value)) {
                    setNewPayment({
                      ...newPayment,
                      montantPaye: value 
                    });
                  }
                }}
                onBlur={(e) => {
                  // Convertit la valeur en nombre à la fin de la saisie
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value) && value >= 0) {
                    setNewPayment({
                      ...newPayment,
                      montantPaye: value // Sauvegarde la valeur comme nombre
                    });
                  }
                }}
                required
              />


              {/* Solde restant */}
              <label>Solde restant:</label>
              <input
                type="text"
                name="soldeRestant"
                value={newPayment.soldeRestant ?? ''} 
                placeholder="Entrez le solde restant"
                onChange={(e) => {
                 
                  const value = e.target.value;
                  if (/^\d*\.?\d*$/.test(value)) {
                    setNewPayment({
                      ...newPayment,
                      soldeRestant: value 
                    });
                  }
                }}
                onBlur={(e) => {
                 
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value) && value >= 0) {
                    setNewPayment({
                      ...newPayment,
                      soldeRestant: value // Sauvegarde la valeur comme nombre
                    });
                  } 
                }}
                required
              />


              {/* Date de paiement */}
              <label>Date de paiement:</label>
              <input
                type="date"
                name="datePaiement"
                value={newPayment.datePaiement}
                onChange={handleInputChange}
                required
              />

              {/* Client associé */}
              <label>Client associé:</label>
              <div className="dropdown-wrapper">
                <div className="input-container">
                  <input
                    type="text"
                    name="client_id"
                    value={newPayment.client_id}
                    readOnly
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    placeholder="Cliquez pour sélectionner un client"
                    required
                  />
                  <FaCaretDown
                    className="dropdown-icon"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
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

              {/* Réservation associée */}
              <label>Réservation associée:</label>
              <div className="dropdown-wrapper">
                <div className="input-container">
                  <input
                    type="text"
                    name="reserv_id"
                    value={newPayment.reserv_id}
                    readOnly
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    placeholder="Cliquez pour sélectionner une réservation"
                    required
                  />
                  <FaCaretDown
                    className="dropdown-icon"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                  />
                </div>
                {isDropdownOpen && (
                  <ul className="dropdown-list">
                    {reservations.map((reservation) => (
                      <li
                        key={reservation.id}
                        onClick={() => handleSelectReservation(reservation)}
                        className="reservation-item"
                      >
                        <span>{reservation.id}</span> <span>{reservation.date_reservation}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Statut */}
              <label>Statut:</label>
              <select
                name="statut"
                value={newPayment.statut}
                onChange={handleInputChange}
                required
              >
                <option value="waiting">En attente</option>
                <option value="confirmed">Payé</option>
              </select>

              {/* Boutons */}
              <div className="modal-buttons">
                <button type="submit">{isEditMode ? 'Modifier' : 'Ajouter'}</button>
                <button type="button" onClick={handleCloseModal}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}


      <table className="payments-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Montant total</th>
            <th>Montant payé</th>
            <th>Solde restant</th>
            <th>Date de paiement</th>
            <th>Client associé</th>
            <th>Réservation associée</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPaiments.length === 0 ? (
            <tr>
              <td colSpan={9} style={{ textAlign: 'center' }}>Aucun paiement disponible</td>
            </tr>
          ) : (
            currentPaiments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.montantTotal}</td>
                <td>{payment.montantPaye}</td>
                <td>{payment.soldeRestant}</td>
                <td>{payment.datePaiement}</td>
                <td>{payment.client_id}</td>
                <td>{payment.reserv_id}</td>
                <td>{payment.statut}</td>
                <td>
                  <FaEdit
                    className="action-icon edit-icon"
                    title="Éditer"
                    onClick={() => handleEditPaymentClick(payment)}
                  />
                  <FaTrash
                    className="action-icon delete-icon"
                    title="Supprimer"
                    onClick={() => handleDeletePayment(payment.id)}
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
    {currentPaiments.length} sur {Paiments.length} paiements
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

export default MainPaiement;
