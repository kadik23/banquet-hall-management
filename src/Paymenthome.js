import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './Paymenthome.css';
import './Hcome.css'

function Paymenthome() {
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
    // Ajoutez plus de paiements pour tester...
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false); // Gérer l'état du modal
  const [isEditMode, setIsEditMode] = useState(false); // Gérer le mode édition
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

  const [currentPage, setCurrentPage] = useState(1); // Page courante
  const paymentsPerPage = 9; // Nombre de paiements par page

  // Calculer l'index des premiers et derniers paiements à afficher pour la pagination
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = payments.slice(indexOfFirstPayment, indexOfLastPayment);

  // Fonction pour changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Ouvrir le modal pour ajouter un paiement
  const handleAddPaymentClick = () => {
    setIsEditMode(false); // Assurer qu'on est en mode ajout
    setNewPayment({
      id: null,
      montantTotal: '',
      montantPaye: '',
      soldeRestant: '',
      datePaiement: '',
      clientAssocie: '',
      reservationAssocie: '',
      statut: ''
    }); // Réinitialiser le formulaire
    setIsModalOpen(true);
  };

  // Ouvrir le modal pour modifier un paiement
  const handleEditPaymentClick = (payment) => {
    setIsEditMode(true); // Passer en mode édition
    setNewPayment(payment); // Remplir le formulaire avec les données du paiement sélectionné
    setIsModalOpen(true);
  };

  // Fermer le modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPayment({
      ...newPayment,
      [name]: value
    });
  };

  // Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      // Mise à jour d'un paiement existant
      setPayments(payments.map(payment => payment.id === newPayment.id ? newPayment : payment));
    } else {
      // Ajouter un nouveau paiement avec un ID unique
      const newPaymentWithId = {
        id: Date.now(), // Utiliser l'heure actuelle pour un ID unique
        ...newPayment
      };
      setPayments(prevPayments => [...prevPayments, newPaymentWithId]);
    }
    setNewPayment({
      montantTotal: '',
      montantPaye: '',
      soldeRestant: '',
      datePaiement: '',
      clientAssocie: '',
      reservationAssocie: '',
      statut: ''
    });
    setIsModalOpen(false); // Fermer le modal après soumission
  };

  // Supprimer un paiement spécifique
  const handleDeletePayment = (id) => {
    setPayments(payments.filter(payment => payment.id !== id));
  };

  // Supprimer tous les paiements
  const handleDeleteAll = () => {
    setPayments([]); // Vide la liste des paiements
  };

  // Calculer le nombre de pages
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(payments.length / paymentsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="main-container2">
      <div className="header-cl">
        <h3>GESTION DES PAIEMENTS</h3>
        <span className="payment-count">Tous les paiements : {payments.length}</span>
      </div>
      <div className="footer-buttons">
        <button className="add-payment-btn" onClick={handleAddPaymentClick}>Ajouter un paiement</button>
        <button className="delete-all-btn" onClick={handleDeleteAll}>Supprimer tout</button>
      </div>

      {/* Modal Formulaire */}
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

      <div className="pagination">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={number === currentPage ? 'active' : ''}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Paymenthome;
