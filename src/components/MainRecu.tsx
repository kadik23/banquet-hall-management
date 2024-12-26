import React, { useState, useEffect, useRef } from 'react';
import { FaPrint, FaTrash, FaCaretDown } from 'react-icons/fa';

function MainRecu() {
   const [newRecu, setNewRecu] = useState<Recu>({
    client_id :0,
    reservation_id: 0,
    paiment_id: 0,
   
   });

  const [clients, setClients] = useState<Client[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
   const [Paiments, setPaiments] = useState<Payment[]>([]);
  
  const [recus, setRecus] = useState(() => {
      const savedRecus = localStorage.getItem('recus');
      return savedRecus ? JSON.parse(savedRecus) : [];
    });
  const [modalitesFile, setModalitesFile] = useState(null);
  const [modalitesFileName, setModalitesFileName] = useState(() => {
      return localStorage.getItem('modalitesFileName') || '';
    });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
 
   // Sauvegarde de l'état du bouton (Ajouter ou Imprimer)
   const [isFileAdded, setIsFileAdded] = useState(() => {
     return localStorage.getItem('isFileAdded') === 'true';
   });


  const [isRecuModalOpen, setIsRecuModalOpen] = useState(false);
 
  const [isEditMode, setIsEditMode] = useState(false);



  const [currentPage, setCurrentPage] = useState(1);
  const recusPerPage = 8;
  const indexOfLastRecu = currentPage * recusPerPage;
  const indexOfFirstRecu = indexOfLastRecu - recusPerPage;
  const currentRecus = recus.slice(indexOfFirstRecu, indexOfLastRecu);
  const pageNumbers = Array.from({ length: Math.ceil(recus.length / recusPerPage) }, (_, i) => i + 1);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isReservationDropdownOpen, setIsReservationDropdownOpen] = useState(false);
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);


  // clients

  const handleSelectClient = (client: Pick<Client, 'id' | 'name' | 'surname'>) => {
    setNewRecu({
      ...newRecu,
      client_id: client.id as number,
    });
    setIsClientDropdownOpen(false);
  };


  //  reservation
  
  const handleSelectReservation = (reserv: Pick<Reservation, 'id' | 'date_reservation' >) => {
    setNewRecu({
      ...newRecu,
      reservation_id: reserv.id as number,
    });
    setIsReservationDropdownOpen(false);
  };

  //payment
  const handleSelectPayment = (payment: Pick<Payment, 'id' | 'payment_date' >) => {
    setNewRecu({
      ...newRecu,
      paiment_id: payment.id as number,
    });
    setIsPaymentDropdownOpen(false);
  };
  

  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    client: false,
    reservation: false,
    paiement: false
  });

  

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


   // Sauvegarder les reçus et autres états dans le stockage local
    useEffect(() => {
      localStorage.setItem('recus', JSON.stringify(recus));
    }, [recus]);
  
    useEffect(() => {
      localStorage.setItem('modalitesFileName', modalitesFileName);
    }, [modalitesFileName]);
  
    useEffect(() => {
      localStorage.setItem('isFileAdded', isFileAdded);
    }, [isFileAdded]);

  const handleAddModalitesClick = () => {
    if (isFileAdded) {
      setIsPrintModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setModalitesFile(file);
      setModalitesFileName(file.name);
      setIsFileAdded(true); // Mettre à jour l'état du bouton
    } else {
      alert('Veuillez sélectionner un fichier PDF.');
    }
  };

  const handlePrint = () => {
    if (modalitesFile) {
      const fileURL = URL.createObjectURL(modalitesFile);
      const printWindow = window.open(fileURL, '_blank');
      if (printWindow) {
        printWindow.focus();
        printWindow.print();
      }
    }
  };

  const handleDeleteFile = () => {
    setModalitesFile(null);
    setModalitesFileName('');
    setIsFileAdded(false); // Réinitialiser l'état du bouton
  };
  

  const handleAddRecuClick = () => {
    setIsRecuModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsRecuModalOpen(false);
  };


  const handleCloseModal2 = () => {
    setIsModalOpen(false);
    setIsPrintModalOpen(false);
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

       {/* Modal pour ajouter un fichier */}
       {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCloseModal}>&times;</span>
            <h3>Ajouter un fichier PDF</h3>
            <input type="file" accept="application/pdf" onChange={handleFileUpload} />
            <div className="modal-buttons">
              <button
                className="save-btn"
                onClick={() => {
                  if (modalitesFile) {
                    setIsModalOpen(false);
                  } else {
                    alert("Veuillez d'abord sélectionner un fichier PDF.");
                  }
                }}
              >
                Enregistrer le fichier ajouté
              </button>
              <button className="cancel-btn" onClick={handleCloseModal}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}


       {/* Modal pour imprimer ou remplacer les modalités */}
      {isPrintModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCloseModal2}>&times;</span>
            <h3>Imprimer ou remplacer les modalités</h3>
            <input
              
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              style={{ marginBottom: '10px' }}
            />
            {modalitesFileName && (
              <p style={{ marginTop: '10px', color: 'gray' }}>
                Fichier ajouté : <strong>{modalitesFileName}</strong>
              </p>
            )}
            <div className="modal-buttons">
              <button className="print-btn" onClick={handlePrint}>
                <FaPrint /> Imprimer
              </button>
              <button className="delete-btn" onClick={handleDeleteFile}>
                <FaTrash /> Supprimer
              </button>
              <button className="cancel-btn" onClick={handleCloseModal2}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}


       {/* Modal pour ajouter un recu */}
      {isRecuModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCloseModal}>&times;</span>
            <h3>Ajouter un reçu</h3>
            <form onSubmit={handleSaveRecu}>
              <div>
                 {/* Client associé */}
                <label>ID Client:</label>
                <div className="dropdown-wrapper">
                  <div className="input-container">
                    <input
                      type="text"
                      name="client_id"
                      value={newRecu.client_id}
                      readOnly
                      onClick={() => setIsClientDropdownOpen((prev) => !prev)}
                      placeholder="Cliquez pour sélectionner un client"
                      required
                    />
                    <FaCaretDown
                      className="dropdown-icon"
                      onClick={() => setIsClientDropdownOpen((prev) => !prev)}
                    />
                  </div>
                  {isClientDropdownOpen && (
                    <ul className="dropdown-list">
                      {clients.map((client: Client) => (
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
              </div>


              <div>
                <label>ID Réservation:</label>
                <div className="dropdown-wrapper">
                    <div className="input-container">
                      <input
                        type="text"
                        name="reservation_id"
                        value={newRecu.reservation_id}
                        readOnly
                        onClick={() => setIsReservationDropdownOpen((prev) => !prev)}
                        placeholder="Cliquez pour sélectionner une réservation"
                        required
                      />
                      <FaCaretDown
                        className="dropdown-icon"
                        onClick={() => setIsReservationDropdownOpen((prev) => !prev)}
                      />
                    </div>
                    {isReservationDropdownOpen && (
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
              </div>


              <div>
                <label>ID Paiement:</label>
                <div className="dropdown-wrapper" ref={dropdownRef}>
                  <div className="input-container">
                    <input
                      type="text"
                      name="paiment_id"
                      value={newRecu.paiment_id}
                      readOnly
                      onClick={() => setIsPaymentDropdownOpen((prev) => !prev)}
                      placeholder="Cliquez pour sélectionner un paiement"
                    />
                    <FaCaretDown
                      className="dropdown-icon"
                      onClick={() => setIsPaymentDropdownOpen((prev) => !prev)}
                      
                    />
                  </div>
                  {isDropdownOpen.paiement && (
                    <ul className="dropdown-list">
                      {Paiments.map((payment) => (
                        <li className="client-item" key={payment.id} onClick={() => handleSelect('paiement', payment)}>
                          <span>{payment.id}</span>
                          <span>{payment.payment_date}</span>
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
                  onClick={() => setRecus(currentRecus.filter((r) => r.id !== recu.id))}
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
