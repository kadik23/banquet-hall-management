import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaCaretDown } from 'react-icons/fa';
import '../App.css';

function MainPaiement({searchTerm}:{searchTerm:string}) {
  const [Paiments, setPaiments] = useState<Payment[]>([]);
  const [filter, setFilter] = useState('Tous');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newPayment, setNewPayment] = useState<Payment>({
    total_amount: 0, 
    amount_paid: 0, 
    remaining_balance: 0, 
    payment_date: '', 
    client_id: 0, 
    reservation_id: 1, 
    status: 'waiting' 
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PaimentsPerPage = 7; // Nombre de paiements par page
  const indexOfLastPayment = currentPage * PaimentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - PaimentsPerPage;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: Payment[] = await window.sqlitePaiment.getPaiments();
        const clientData: Client[] = await window.sqliteClients.getClients();
        setClients(clientData);
        setPaiments(data);
      } catch (err) {
        window.alert(`Error: ${err}`);
        window.electron.fixFocus();
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const getReservation =async () =>{
      const reservationData: Reservation[] = await window.sqliteReservation.getReservationsByClientId(newPayment.client_id);
      if(reservationData.length > 0){
        setReservations(reservationData)
      }else{
        setNewPayment({...newPayment,reservation_id:0})
        setReservations([])
      }
    }
    if(newPayment.client_id !== 0){
      getReservation()
    }
  }, [newPayment.client_id])
  

  const handleFilterChange = (e:any) => {
    setFilter(e.target.value);
    setCurrentPage(1);
  };

  const filteredPaiments = Paiments.filter((payment) => {
    const matchesSearchTerm = [payment.amount_paid, payment.total_amount, payment.payment_date]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  
    return (filter === 'Tous' || payment.status === filter) && matchesSearchTerm;
  });  

  const currentPaiments = filteredPaiments.slice(indexOfFirstPayment, indexOfLastPayment);
  const paginate = (pageNumber:number) => setCurrentPage(pageNumber);

  const handleAddPaymentClick = () => {
    setIsEditMode(false);
    setNewPayment({
      total_amount: 0, 
      amount_paid: 0, 
      remaining_balance: 0, 
      payment_date: '', 
      client_id: 0, 
      reservation_id: 0, 
      status: 'waiting' 
    });
    setIsModalOpen(true);
  };
  
  const handleEditPaymentClick = (payment:Payment) => {
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

  const handleSubmit = async(e:any) => {
    e.preventDefault();
    if(newPayment.client_id == 0 || newPayment.reservation_id == 0){
      alert('Please select reservation id or payment id')
    }else{
        if (newPayment.amount_paid + newPayment.remaining_balance !== newPayment.total_amount) {
          alert('Total amount must equal the sum of amount paid and remaining balance.');
        }
        else if (newPayment.amount_paid === 0 && newPayment.remaining_balance === 0) {
          alert('Payment cannot have both amount paid and remaining balance as zero.');
        }
        else{
          if (isEditMode) {
            setPaiments(Paiments.map((payment:any) => payment.id === newPayment.id ? newPayment : payment));
            const data = await window.sqlitePaiment.editPaiment(newPayment.id as number, newPayment.client_id, newPayment.reservation_id, newPayment.total_amount, newPayment.amount_paid, newPayment.remaining_balance, newPayment.payment_date, newPayment.status);
            window.alert(`Payment ${newPayment.id} was edited successfully`);
  
          } else {
            const data = await window.sqlitePaiment.createPaiment(newPayment.client_id, newPayment.reservation_id, newPayment.total_amount, newPayment.amount_paid, newPayment.remaining_balance, newPayment.payment_date, newPayment.status);
            const newPaymentWithId = { id: data.paimentId, ...newPayment };
            setPaiments([...Paiments, newPaymentWithId]);
            window.alert(`Payment ${data.paimentId} was created successfully`);
          }
          setIsModalOpen(false);
        }
    }
    window.electron.fixFocus();
  };

  const handleDeletePayment = async (id:number) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette paiment ?");
    if (confirmDelete) {
      try {
        const data = await window.sqlitePaiment.deletePaiment(id);
        window.alert(data.message);
        setPaiments(Paiments.filter(payment => payment.id !== id));
      } catch (e) {
        console.error('Error deleting payment:', e);
      }
      window.electron.fixFocus();
    }
  };

  const handleDeleteAll = async() => {
    const confirmDeleteAll = window.confirm("Êtes-vous sûr de vouloir supprimer toutes les paiments ?");
    if (confirmDeleteAll) {
      try {
        const data = await window.sqlitePaiment.deleteAllPaiments();
        window.alert(data.message);
        setPaiments([]);
      } catch (e) {
        console.error('Error deleting all paiments:', e);
      }
    }
    window.electron.fixFocus();
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredPaiments.length / PaimentsPerPage); i++) {
    pageNumbers.push(i);
  }


   const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
   const [isReservationDropdownOpen, setIsReservationDropdownOpen] = useState(false);

  //  reservation
  
    const handleSelectReservation = (reserv: Pick<Reservation, 'id' | 'date_reservation' >) => {
      setNewPayment({
        ...newPayment,
        reservation_id: reserv.id as number,
      });
      setIsReservationDropdownOpen(false);
    };


  // clients

  const handleSelectClient = (client: Pick<Client, 'id' | 'name' | 'surname'>) => {
    setNewPayment({
      ...newPayment,
      client_id: client.id as number,
    });
    setIsClientDropdownOpen(false);
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
            <option value="waiting">En attente</option>
            <option value="confirmed">Payé</option>
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
                type="number"
                name="total_amount"
                value={newPayment.total_amount ?? 0} 
                placeholder="Entrez le montant total"
                onChange={(e) => {

                  const value = e.target.value;
                  if (/^\d*\.?\d*$/.test(value)) {
                    setNewPayment({
                      ...newPayment,
                      total_amount: parseFloat(value) 
                    });
                  }
                }}
                onBlur={(e) => {
                  // Convertit la valeur en nombre à la fin de la saisie
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value) && value >= 0) {
                    setNewPayment({
                      ...newPayment,
                      total_amount: value 
                    });
                  }
                }}
                required
              />


              {/* Montant payé */}
              <label>Montant payé:</label>
              <input
                type="number"
                name="amount_paid"
                value={newPayment.amount_paid ?? 0}
                placeholder="Entrez le montant payé"
                onChange={(e) => {
                  
                  const value = e.target.value;
                  if (/^\d*\.?\d*$/.test(value)) {
                    setNewPayment({
                      ...newPayment,
                      amount_paid: parseFloat(value) 
                    });
                  }
                }}
                onBlur={(e) => {
                  // Convertit la valeur en nombre à la fin de la saisie
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value)) {
                    setNewPayment({
                      ...newPayment,
                      amount_paid: value // Sauvegarde la valeur comme nombre
                    });
                  }
                }}
                required
              />


              {/* Solde restant */}
              <label>Solde restant:</label>
              <input
                type="number"
                name="remaining_balance"
                value={newPayment.remaining_balance ?? 0} 
                placeholder="Entrez le solde restant"
                onChange={(e) => {
                 
                  const value = e.target.value;
                  if (/^\d*\.?\d*$/.test(value)) {
                    setNewPayment({
                      ...newPayment,
                      remaining_balance: parseFloat(value) 
                    });
                  }
                }}
                onBlur={(e) => {
                 
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value)) {
                    setNewPayment({
                      ...newPayment,
                      remaining_balance: value // Sauvegarde la valeur comme nombre
                    });
                  } 
                }}
                required
              />


              {/* Date de paiement */}
              <label>Date de paiement:</label>
              <input
                type="date"
                name="payment_date"
                value={newPayment.payment_date}
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

              {/* Réservation associée */}
              <label>Réservation associée:</label>
              <div className="dropdown-wrapper">
                <div className="input-container">
                  <input
                    type="text"
                    name="reservation_id"
                    value={newPayment.reservation_id}
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

              {/* Statut */}
              <label>Statut:</label>
              <select
                name="status"
                value={newPayment.status}
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
                <td>{payment.total_amount}</td>
                <td>{payment.amount_paid}</td>
                <td>{payment.remaining_balance}</td>
                <td>{payment.payment_date}</td>
                <td>{payment.client_id}</td>
                <td>{payment.reservation_id}</td>
                <td>{payment.status == 'waiting' ? 'En attente' : 'Payé'}</td>
                <td>
                  <FaEdit
                    className="action-icon edit-icon"
                    title="Éditer"
                    onClick={() => handleEditPaymentClick(payment)}
                  />
                  <FaTrash
                    className="action-icon delete-icon"
                    title="Supprimer"
                    onClick={() => handleDeletePayment(payment.id as number)}
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
