import React, { useState, useEffect, useRef } from 'react';
import { FaPrint, FaTrash, FaCaretDown } from 'react-icons/fa';
import { format } from 'date-fns';

function MainRecu({searchTerm}:{searchTerm:string}) {

   const [newRecu, setNewRecu] = useState<Receipt>({
    client_id :0,
    reservation_id: 0,
    paiment_id: 0,
    date_reservation: '',
    name: '',
    surname: '',
    payment_date: '',
    total_amount: 0,
    status: '',
    amount_paid: 0,
    remaining_balance: 0
   });
  const [clients, setClients] = useState<Client[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [Paiments, setPaiments] = useState<Payment[]>([]);
  const [recus, setRecus] = useState<Receipt[]>([]);
  const [modalitesFile, setModalitesFile] = useState<Blob | null>(null);
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
  const recusPerPage = 5;
  const indexOfLastRecu = currentPage * recusPerPage;
  const indexOfFirstRecu = indexOfLastRecu - recusPerPage;
  const filteredRecus = recus.filter((recu) => {
    return [
      recu.name,
      recu.surname,
      recu.date_reservation,
      recu.payment_date,
      recu.total_amount?.toString(),
      recu.amount_paid.toString(),
      recu.remaining_balance.toString(),
      recu.status,
    ]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });
  const currentRecus: Receipt[] = filteredRecus.slice(indexOfFirstRecu, indexOfLastRecu);
  const pageNumbers = Array.from({ length: Math.ceil(filteredRecus.length / recusPerPage) }, (_, i) => i + 1);
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isReservationDropdownOpen, setIsReservationDropdownOpen] = useState(false);
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    client: false,
    reservation: false,
    paiement: false
  });

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const clientData: Client[] = await window.sqliteClients.getClients();
        const receiptData: Receipt[] = await window.sqliteReceipt.getReceipts();
        console.table(receiptData)
        setClients(clientData);
        setRecus(receiptData)
      } catch (err) {
        window.alert(`Error: ${err}`);
        window.electron.fixFocus();
      }
    };

    fetchClientData();
  }, []);

  useEffect(() => {
    const getReservations =async () =>{
      const reservationData: Reservation[] = await window.sqliteReservation.getReservationsByClientId(newRecu.client_id);
      if(reservationData.length > 0){
        setReservations(reservationData)
      }else{

        
        // setNewRecu({ ...newRecu, reservation_id: reservation_id });

        setReservations([])
      }
    }
    if(newRecu.client_id !== 0){
      getReservations()
    }
  }, [newRecu.client_id])

  useEffect(() => {
    const getPayments =async () =>{
      const paymentsData: Payment[] = await window.sqlitePaiment.getPaimentsByReservationId(newRecu.reservation_id);
      if(paymentsData.length > 0){
        setPaiments(paymentsData)
      }else{
        // setNewRecu({...newRecu,paiment_id:0})
        // setNewRecu({ ...newRecu, paiment_id: paiment_id });

        setPaiments([])
      }
    }
    if(newRecu.client_id !== 0 && newRecu.reservation_id !== 0){
      getPayments()
    }
  }, [newRecu.reservation_id])

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

    
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const savedFileData = localStorage.getItem('modalitesFile');
    if (savedFileData) {
      const fileData = new Uint8Array(JSON.parse(savedFileData));
      const fileBlob = new Blob([fileData], { type: 'application/pdf' });
      setModalitesFile(fileBlob);
    }
  }, []);

  const paginate = (pageNumber:any) => setCurrentPage(pageNumber);

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
  const handleSelectPayment = (payment: Pick<Payment, 'id' | 'payment_date'>) => {
    setNewRecu({
      ...newRecu,
      paiment_id: payment.id as number,
      payment_date: payment.payment_date, // Assurez-vous d'ajouter cette ligne
    });
    setIsPaymentDropdownOpen(false);
  };
  

  const handleClickOutside = (event:any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen({ client: false, reservation: false, paiement: false });
    }
  };

  const handleSaveRecu =async (e:any) => {
    e.preventDefault();
    if (newRecu.client_id && newRecu.reservation_id && newRecu.paiment_id) {
      const {success, receipt}: {success:boolean, receipt: Receipt} = await window.sqliteReceipt.createReceipt(newRecu.client_id, newRecu.reservation_id, newRecu.paiment_id, 'pdf_url');
      if(success){
        console.log(receipt)
          const newRecuData: Receipt = {
            id: receipt.id,
            ...newRecu,
            name: receipt.name,
            surname: receipt.surname,
            remaining_balance: receipt.remaining_balance,
            status: receipt.status,
            date_reservation: receipt.date_reservation,
            payment_date : receipt.payment_date,
          
            total_amount: receipt.total_amount
          };
          setRecus([...recus, newRecuData]);
          alert('Reçu ajouté avec succès');
          handleCloseModal();
      }else{
        alert('Something wrong...')
      }
    } else {
      alert('Veuillez remplir tous les champs');
    }
    window.electron.fixFocus()
  };

  const handleAddModalitesClick = () => {
    if (isFileAdded) {
      setIsPrintModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      // Save the file in IndexedDB or send it to the backend
      const fileData = await file.arrayBuffer(); // Convert file to binary
      localStorage.setItem('modalitesFile', JSON.stringify(Array.from(new Uint8Array(fileData))));
      setModalitesFile(file);
      setModalitesFileName(file.name);
      setIsFileAdded(true);
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
    } else {
      alert("Aucun fichier modalités disponible. Veuillez télécharger à nouveau.");
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


  const handlePrintRecu = (recu: Receipt) => {
    const printWindow = window.open('', '_blank');
    const content = `
      <html>
        <head>
          <title>Reçu - ${recu.name} ${recu.surname}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .receipt { padding: 20px; }
            .receipt h2 { text-align: center; }
            .receipt p { font-size: 16px; }
            .receipt table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .receipt th, .receipt td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .receipt th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <h2>Reçu de réservation</h2>
            <table>
              <tr><th>Nom</th><td>${recu.name}</td></tr>
              <tr><th>Prénom</th><td>${recu.surname}</td></tr>
              <tr><th>Date de réservation</th><td>${recu.date_reservation}</td></tr>
              <tr><th>Date de paiement</th><td>${recu.payment_date}</td></tr>
              <tr><th>Total</th><td>${recu.total_amount}</td></tr>
              <tr><th>Montant payé</th><td>${recu.amount_paid}</td></tr>
              <tr><th>Solde restant</th><td>${recu.remaining_balance}</td></tr>
              <tr><th>Statut</th><td>${recu.status == 'waiting' ? 'En attente' : 'Payé'}</td></tr>
            </table>
          </div>
        </body>
      </html>
    `;
    printWindow?.document.write(content);
    printWindow?.document.close();
    printWindow?.print();
  };

  const handleDeleteReceiptById = async (receipt_id: number) => { 
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette recu ?");
    if (confirmDelete) {
      try {
        const data = await window.sqliteReceipt.deleteReceipt(receipt_id);
        window.alert(data.message);
        setRecus(currentRecus.filter((r) => r.id !== receipt_id))
      } catch (error) {
        alert(`Error: ${error}`)
      }
    }
    window.electron.fixFocus()
  } 

  const handleDeleteAll = async () => {
    const confirmDeleteAll = window.confirm("Êtes-vous sûr de vouloir supprimer toutes les recus ?");
    if (confirmDeleteAll) {
      try {
        const data = await window.sqliteReceipt.deleteAllReceipts();
        window.alert(data.message);
        setRecus([]);
      } catch (e) {
        console.error('Error deleting all recus:', e);
      }
    }
    window.electron.fixFocus();
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
        <button className="delete-all-btn" onClick={handleDeleteAll}>Supprimer tout</button>
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
                          <li className="client-item"
                            key={reservation.id}
                            onClick={() => handleSelectReservation(reservation)}
                            
                          >
                            <span>{reservation.id}</span> <span>{format(new Date(reservation.date_reservation), 'd-MM-yyyy')}</span>
                           
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
                      required
                    />
                    <FaCaretDown
                      className="dropdown-icon"
                      onClick={() => setIsPaymentDropdownOpen((prev) => !prev)}
                    />
                  </div>
                  {isPaymentDropdownOpen && (
                    <ul className="dropdown-list">
                      {Paiments.map((payment) => (
                        
                        <li className="client-item" onClick={() => handleSelectPayment(payment)} key={payment.id}>
                          <span>{payment.id}</span> <span>{format(new Date(payment.payment_date), 'd-MM-yyyy')}</span>
                          
                       
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
            <th>Date de paiement</th>
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
                <td>{recu.name}</td>
                <td>{recu.surname}</td>
                <td>{format(new Date(recu.date_reservation), 'd-MM-yyyy')}</td>
                <td>{recu.payment_date}</td>
                <td>{recu.total_amount}</td>
                <td>{recu.amount_paid}</td>
                <td>{recu.remaining_balance}</td>
                <td>{recu.status == 'waiting' ? 'En attente' : 'Payé'}</td>
                <td>
                  <FaPrint onClick={() => handlePrintRecu(recu)} className="action-icon" title="Imprimer" />
                  
                  <FaTrash
                  className="action-icon delete-icon"
                  title="Supprimer"
                  onClick={() => { handleDeleteReceiptById(recu.id as number)} }
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