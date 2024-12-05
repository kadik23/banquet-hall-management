import React, { useState, useEffect, useRef } from 'react';
import { FaPrint, FaTrash, FaCaretDown } from 'react-icons/fa';

function MainRecu() {
  const [recus, setRecus] = useState([
    { id: 1, nom: 'Dupont', prenom: 'Jean', dateReservation: '2024-11-01', dateDebut: '2024-11-10', total: 500, montantPaye: 300, soldeRestant: 200, statut: 'En attente' },
    { id: 2, nom: 'Martin', prenom: 'Marie', dateReservation: '2024-11-02', dateDebut: '2024-11-12', total: 600, montantPaye: 600, soldeRestant: 0, statut: 'Payé' },
  ]);
  const [modalitesFile, setModalitesFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecuModalOpen, setIsRecuModalOpen] = useState(false);
  const [newRecu, setNewRecu] = useState({
    clientId: '',
    reservationId: '',
    montantPaye: ''
  });
  const [isEditMode, setIsEditMode] = useState(false);



  const [currentPage, setCurrentPage] = useState(1);
  const recusPerPage = 8;
  const indexOfLastRecu = currentPage * recusPerPage;
  const indexOfFirstRecu = indexOfLastRecu - recusPerPage;
  const currentRecus = recus.slice(indexOfFirstRecu, indexOfLastRecu);
  const pageNumbers = Array.from({ length: Math.ceil(recus.length / recusPerPage) }, (_, i) => i + 1);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    client: false,
    reservation: false,
    paiement: false
  });

  const clients = [
    { id: 1, nom: 'Dupont', prenom: 'Jean' },
    { id: 2, nom: 'Martin', prenom: 'Marie' },
    { id: 3, nom: 'Lemoine', prenom: 'Pierre' }
  ];

  const reservations = [
    { id: 1, description: 'Réservation A' },
    { id: 2, description: 'Réservation B' },
    { id: 3, description: 'Réservation C' }
  ];

  const paiements = [
    { id: 1, montant: '500' },
    { id: 2, montant: '300' },
    { id: 3, montant: '200' }
  ];

  const handleSelect = (field, item) => {
    setNewRecu({
      ...newRecu,
      [`${field}Id`]: item.id
    });
    setIsDropdownOpen(prev => ({ ...prev, [field]: false }));
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen({ client: false, reservation: false, paiement: false });
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRecuChange = (e) => {
    const { name, value } = e.target;
    setNewRecu((prevRecu) => ({
      ...prevRecu,
      [name]: value
    }));
  };

  const handleSaveRecu = (e) => {
    e.preventDefault();
    if (newRecu.clientId && newRecu.reservationId && newRecu.montantPaye) {
      const newRecuData = {
        id: recus.length + 1,
        ...newRecu,
        soldeRestant: 500 - parseFloat(newRecu.montantPaye),
        statut: 'En attente',
        dateReservation: new Date().toISOString().split('T')[0],
        dateDebut: new Date().toISOString().split('T')[0],
        total: 500
      };
      setRecus([...recus, newRecuData]);
      alert('Reçu ajouté avec succès');
      handleCloseModal();
    } else {
      alert('Veuillez remplir tous les champs');
    }
  };

  const handleAddModalitesClick = () => {
    setIsModalOpen(true);
  };

  const handleAddRecuClick = () => {
    setIsRecuModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsRecuModalOpen(false);
  };

  return (
    <div className="main-container2">
      <div className="header-cl">
        <h3>GESTION DES REÇUS</h3>
        <span className="recu-count">Tous les reçus : {recus.length}</span>
      </div>

      <div className="footer-buttons">
        <div className="left-buttons">
          <button className="add-recu-btn" onClick={handleAddRecuClick}>Ajouter un reçu</button>
          <button className="add-recu-btn" onClick={handleAddModalitesClick}>
            {modalitesFile ? 'Imprimer les modalités' : 'Ajouter les modalités'}
          </button>
        </div>
        <button className="delete-all-btn" onClick={() => setRecus([])}>Supprimer tout</button>
      </div>

      {isRecuModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCloseModal}>&times;</span>
            <h3>Ajouter un reçu</h3>
            <form onSubmit={handleSaveRecu}>
              <div>
                <label>ID Client:</label>
                <div className="dropdown-wrapper" ref={dropdownRef}>
                  <div className="input-container">
                    <input
                      type="text"
                      name="clientAssocie"
                      value={newRecu.clientId}
                      readOnly
                      onClick={() => setIsDropdownOpen(prev => ({ ...prev, client: !prev.client }))}
                      placeholder="Cliquez pour sélectionner un client"
                    />
                    <FaCaretDown
                      className="dropdown-icon"
                      onClick={() => setIsDropdownOpen(prev => ({ ...prev, client: !prev.client }))}
                    />
                  </div>
                  {isDropdownOpen.client && (
                    <ul className="dropdown-list">
                      {clients.map((client) => (
                        <li className="client-item" key={client.id} onClick={() => handleSelect('client', client)}>
                          <span>{client.id}</span>
                          <span>{client.nom}</span>
                          <span>{client.prenom}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div>
                <label>ID Réservation:</label>
                <div className="dropdown-wrapper" ref={dropdownRef}>
                  <div className="input-container">
                    <input
                      type="text"
                      name="reservationId"
                      value={newRecu.reservationId}
                      readOnly
                      onClick={() => setIsDropdownOpen(prev => ({ ...prev, reservation: !prev.reservation }))}
                      placeholder="Cliquez pour sélectionner une réservation"
                    />
                    <FaCaretDown
                      className="dropdown-icon"
                      onClick={() => setIsDropdownOpen(prev => ({ ...prev, reservation: !prev.reservation }))}
                    />
                  </div>
                  {isDropdownOpen.reservation && (
                    <ul className="dropdown-list">
                      {reservations.map((reservation) => (
                        <li className="client-item" key={reservation.id} onClick={() => handleSelect('reservation', reservation)}>
                          <span>{reservation.id}</span>
                          <span>{reservation.description}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div>
                <label>ID Paiement:</label>
                <div className="dropdown-wrapper" ref={dropdownRef}>
                  <div className="input-container">
                    <input
                      type="text"
                      name="paiementId"
                      value={newRecu.montantPaye}
                      readOnly
                      onClick={() => setIsDropdownOpen(prev => ({ ...prev, paiement: !prev.paiement }))}
                      placeholder="Cliquez pour sélectionner un paiement"
                    />
                    <FaCaretDown
                      className="dropdown-icon"
                      onClick={() => setIsDropdownOpen(prev => ({ ...prev, paiement: !prev.paiement }))}
                    />
                  </div>
                  {isDropdownOpen.paiement && (
                    <ul className="dropdown-list">
                      {paiements.map((paiement) => (
                        <li className="client-item" key={paiement.id} onClick={() => handleSelect('paiement', paiement)}>
                          <span>{paiement.id}</span>
                          <span>{paiement.montant}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
             
              <div className="modal-buttons">
                <button type="submit">{isEditMode ? 'Modifier' : 'Ajouter'}</button>
                <button type="button" onClick={handleCloseModal}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

<table className="recus-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Date de réservation</th>
            <th>Date de début</th>
            <th>Total</th>
            <th>Montant payé</th>
            <th>Solde restant</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRecus.length === 0 ? (
            <tr>
              <td colSpan={10} style={{ textAlign: 'center' }}>Aucun reçu disponible</td>
            </tr>
          ) : (
            currentRecus.map((recu) => (
              <tr key={recu.id}>
                <td>{recu.id}</td>
                <td>{recu.nom}</td>
                <td>{recu.prenom}</td>
                <td>{recu.dateReservation}</td>
                <td>{recu.dateDebut}</td>
                <td>{recu.total}</td>
                <td>{recu.montantPaye}</td>
                <td>{recu.soldeRestant}</td>
                <td>{recu.statut}</td>
                <td>
                  <FaPrint className="action-icon" title="Imprimer" />
                  <FaTrash
                    className="action-icon delete-icon"
                    title="Supprimer"
                    onClick={() => setRecus(recus.filter((r) => r.id !== recu.id))}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        <span className="page-info">
          {Math.min(indexOfLastRecu, recus.length)} sur {recus.length} reçus
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

export default MainRecu;
