import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import '../App.css';

function MainPaiement() {
  const [payments, setPayments] = useState([
    { 
      id: 1, 
      montantTotal: 1500, 
      montantPaye: 500, 
      soldeRestant: 1000, 
      datePaiement: '2024-11-01', 
      clientAssocie: 'Jean Dupont',
      reservationAssocie: '2024-11-10',
      statut: 'En attente'
    },
    { 
      id: 2, 
      montantTotal: 2500, 
      montantPaye: 2500, 
      soldeRestant: 0, 
      datePaiement: '2024-11-02', 
      clientAssocie: 'Marie Martin',
      reservationAssocie: '2024-11-15',
      statut: 'Payé'
    },
    { 
      id: 3, 
      montantTotal: 2500, 
      montantPaye: 2500, 
      soldeRestant: 0, 
      datePaiement: '2024-11-02', 
      clientAssocie: 'Marie Martin',
      reservationAssocie: '2024-11-15',
      statut: 'Payé'
    },
    { 
      id: 4, 
      montantTotal: 2500, 
      montantPaye: 2500, 
      soldeRestant: 0, 
      datePaiement: '2024-11-02', 
      clientAssocie: 'Marie Martin',
      reservationAssocie: '2024-11-15',
      statut: 'Payé'
    },
    { 
      id: 5, 
      montantTotal: 2500, 
      montantPaye: 2500, 
      soldeRestant: 0, 
      datePaiement: '2024-11-02', 
      clientAssocie: 'Marie Martin',
      reservationAssocie: '2024-11-15',
      statut: 'Payé'
    },
    { 
      id: 6, 
      montantTotal: 2500, 
      montantPaye: 2500, 
      soldeRestant: 0, 
      datePaiement: '2024-11-02', 
      clientAssocie: 'Marie Martin',
      reservationAssocie: '2024-11-15',
      statut: 'Payé'
    },
    { 
      id: 7, 
      montantTotal: 2500, 
      montantPaye: 2500, 
      soldeRestant: 0, 
      datePaiement: '2024-11-02', 
      clientAssocie: 'Marie Martin',
      reservationAssocie: '2024-11-15',
      statut: 'Payé'
    },
    { 
      id: 8, 
      montantTotal: 2500, 
      montantPaye: 2500, 
      soldeRestant: 0, 
      datePaiement: '2024-11-02', 
      clientAssocie: 'Marie Martin',
      reservationAssocie: '2024-11-15',
      statut: 'Payé'
    },
    { 
      id: 9, 
      montantTotal: 2500, 
      montantPaye: 2500, 
      soldeRestant: 0, 
      datePaiement: '2024-11-02', 
      clientAssocie: 'Marie Martin',
      reservationAssocie: '2024-11-15',
      statut: 'Payé'
    },
    { 
      id: 10, 
      montantTotal: 2500, 
      montantPaye: 2500, 
      soldeRestant: 0, 
      datePaiement: '2024-11-02', 
      clientAssocie: 'Marie Martin',
      reservationAssocie: '2024-11-15',
      statut: 'Payé'
    },
    { 
      id: 11, 
      montantTotal: 2500, 
      montantPaye: 2500, 
      soldeRestant: 0, 
      datePaiement: '2024-11-02', 
      clientAssocie: 'Marie Martin',
      reservationAssocie: '2024-11-15',
      statut: 'Payé'
    },
    { 
      id: 12, 
      montantTotal: 2500, 
      montantPaye: 2500, 
      soldeRestant: 0, 
      datePaiement: '2024-11-02', 
      clientAssocie: 'Marie Martin',
      reservationAssocie: '2024-11-15',
      statut: 'Payé'
    },
    // Ajoutez d'autres données si nécessaire
  ]);

  const [filter, setFilter] = useState('Tous');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newPayment, setNewPayment] = useState({
    id: null,
    montantTotal: '',
    montantPaye: '',
    soldeRestant: '',
    datePaiement: '',
    clientAssocie: '',
    reservationAssocie: '',
    statut: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 8; // Nombre de paiements par page

  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1);
  };

  const filteredPayments = payments.filter(
    (payment) => filter === 'Tous' || payment.statut === filter
  );

  const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddPaymentClick = () => {
    setIsEditMode(false);
    setNewPayment({
      id: null,
      montantTotal: '',
      montantPaye: '',
      soldeRestant: '',
      datePaiement: '',
      clientAssocie: '',
      reservationAssocie: '',
      statut: ''
    });
    setIsModalOpen(true);
  };

  const handleEditPaymentClick = (payment) => {
    setIsEditMode(true);
    setNewPayment(payment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPayment({
      ...newPayment,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      setPayments(payments.map(payment => payment.id === newPayment.id ? newPayment : payment));
    } else {
      const newPaymentWithId = { id: Date.now(), ...newPayment };
      setPayments([...payments, newPaymentWithId]);
    }
    setIsModalOpen(false);
  };

  const handleDeletePayment = (id) => {
    setPayments(payments.filter(payment => payment.id !== id));
  };

  const handleDeleteAll = () => {
    setPayments([]);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredPayments.length / paymentsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="main-container2">
      <div className="header-cl">
        <h3>GESTION DES PAIEMENTS</h3>
        <span className="payment-count">Nombre de paiements : {filteredPayments.length}</span>
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
              <label>Montant total:</label>
              <input
                type="number"
                name="montantTotal"
                value={newPayment.montantTotal}
                onChange={handleInputChange}
                required
              />
              <label>Montant payé:</label>
              <input
                type="number"
                name="montantPaye"
                value={newPayment.montantPaye}
                onChange={handleInputChange}
                required
              />
              <label>Solde restant:</label>
              <input
                type="number"
                name="soldeRestant"
                value={newPayment.soldeRestant}
                onChange={handleInputChange}
                required
              />
              <label>Date de paiement:</label>
              <input
                type="date"
                name="datePaiement"
                value={newPayment.datePaiement}
                onChange={handleInputChange}
                required
              />
              <label>Client associé:</label>
              <input
                type="text"
                name="clientAssocie"
                value={newPayment.clientAssocie}
                onChange={handleInputChange}
                required
              />
              <label>Réservation associée:</label>
              <input
                type="text"
                name="reservationAssocie"
                value={newPayment.reservationAssocie}
                onChange={handleInputChange}
                required
              />
              <label>Statut:</label>
              <input
                type="text"
                name="statut"
                value={newPayment.statut}
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
          {currentPayments.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ textAlign: 'center' }}>Aucun paiement disponible</td>
            </tr>
          ) : (
            currentPayments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.montantTotal}</td>
                <td>{payment.montantPaye}</td>
                <td>{payment.soldeRestant}</td>
                <td>{payment.datePaiement}</td>
                <td>{payment.clientAssocie}</td>
                <td>{payment.reservationAssocie}</td>
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
    {currentPayments.length} sur {payments.length} paiements
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
