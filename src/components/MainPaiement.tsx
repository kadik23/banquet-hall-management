import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaCaretDown } from 'react-icons/fa';
import '../App.css';
import { format } from 'date-fns';

function MainPaiement({ searchTerm }: { searchTerm: string }) {
  const [Paiments, setPaiments] = useState<Payment[]>([]);
  const [filter, setFilter] = useState('Tous');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newPayment, setNewPayment] = useState<Payment>({
    total_amount: '', 
    amount_paid: '', 
    remaining_balance: '', 
    payment_date: '', 
    client_id: '', 
    reservation_id: 1, 
    status: '' 
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PaimentsPerPage = 5;
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
    const getReservation = async () => {
      const reservationData: Reservation[] = await window.sqliteReservation.getReservationsByClientId(newPayment.client_id);
      if (reservationData.length > 0) {
        setReservations(reservationData);
      } else {
        setNewPayment({ ...newPayment, reservation_id: 0 });
        setReservations([]);
      }
    };
    if (newPayment.client_id !== 0) {
      getReservation();
    }
  }, [newPayment.client_id]);

  const handleFilterChange = (e: any) => {
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
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleAddPaymentClick = () => {
    setIsEditMode(false);
    setNewPayment({
      total_amount: '', 
      amount_paid: '', 
      remaining_balance: '', 
      payment_date: '', 
      client_id: '', 
      reservation_id: '', 
      status: '' 
    });
    setIsModalOpen(true);
  };

  const handleEditPaymentClick = (payment: Payment) => {
    setIsEditMode(true);
    setNewPayment(payment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    setNewPayment((prevPayment) => {
      const updatedPayment = {
        ...prevPayment,
        [name]: value, // Met à jour la valeur du champ modifié
      };
  
      // Recalcul automatique du solde restant si pertinent
      if (name === "total_amount" || name === "amount_paid") {
        // Assurez-vous que les valeurs sont des chaînes avant de les manipuler
        const total = parseFloat(String(updatedPayment.total_amount || "").replace(",", "."));
        const paid = parseFloat(String(updatedPayment.amount_paid || "").replace(",", "."));
  
        // Vérification de la validité des montants et calcul du solde restant
        if (!isNaN(total) && !isNaN(paid)) {
          // Conservez remaining_balance en nombre, sans convertir en chaîne
          updatedPayment.remaining_balance = total - paid; // Calcul direct sans .toFixed
        } else {
          updatedPayment.remaining_balance = NaN; // Réinitialiser si les valeurs sont invalides
        }
      }
  
      return updatedPayment; // Retourne le nouvel état
    });
  };
  
  
  
  
  
  
  
  

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const total = parseFloat(newPayment.total_amount);
    const paid = parseFloat(newPayment.amount_paid);
    const remaining = parseFloat(newPayment.remaining_balance);

    if (isNaN(total) || isNaN(paid) || isNaN(remaining)) {
      alert("Veuillez entrer des valeurs valides pour les montants.");
      return;
    }

    if (paid + remaining !== total) {
      alert("Le montant total doit être égal à la somme du montant payé et du solde restant.");
    } else if (paid === 0 && remaining === 0) {
      alert("Le paiement ne peut pas avoir à la fois le montant payé et le solde restant à zéro.");
    } else {
      if (isEditMode) {
        setPaiments(Paiments.map((payment: any) => (payment.id === newPayment.id ? newPayment : payment)));
        await window.sqlitePaiment.editPaiment(
          newPayment.id as number,
          newPayment.client_id,
          newPayment.reservation_id,
          total,
          paid,
          remaining,
          newPayment.payment_date,
          newPayment.status
        );
        alert(`Paiement ${newPayment.id} modifié avec succès`);
      } else {
        const data = await window.sqlitePaiment.createPaiment(
          newPayment.client_id,
          newPayment.reservation_id,
          total,
          paid,
          remaining,
          newPayment.payment_date,
          newPayment.status
        );
        if (data.success) {
          const newPaymentWithId = { id: data.paimentId, ...newPayment };
          setPaiments([...Paiments, newPaymentWithId]);
          alert(`Paiement ${data.paimentId} créé avec succès`);
        } else {
          alert(data.message);
        }
      }
      setIsModalOpen(false);
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
            <label>Montant total:</label>
            <div style={{ position: "relative", display: "inline-block" }}>
  <input
    type="text"
    name="total_amount"
    value={newPayment.total_amount || ""}
    placeholder="Entrez le montant total"
    onChange={handleInputChange}
    onInput={(e) => {
      const validInput = e.target.value.replace(/[^0-9.]/g, "");
      e.target.value = validInput;
    }}
    onBlur={(e) => {
      const value = e.target.value.replace(/ DA$/, "").replace(",", ".");
      const numericValue = parseFloat(value);

      setNewPayment((prevPayment) => ({
        ...prevPayment,
        total_amount: isNaN(numericValue) || value === "" ? "" : numericValue,
      }));
    }}
    required
  />
  <span
    style={{
      position: "absolute",
      right: "10px",
      top: "40%",
      transform: "translateY(-50%)",
      pointerEvents: "none",
    }}
  >
    DA
  </span>
</div>




<label>Montant payé:</label>
<div style={{ position: "relative", display: "inline-block" }}>
  <input
    type="text"
    name="amount_paid"
    value={newPayment.amount_paid !== undefined && newPayment.amount_paid !== null 
      ? newPayment.amount_paid 
      : ""}
    placeholder="Entrez le montant payé"
    onChange={handleInputChange}
    onInput={(e) => {
      // Autorise uniquement les chiffres et le point
      const validInput = e.target.value.replace(/[^0-9.]/g, "");
      e.target.value = validInput;
    }}
    onBlur={(e) => {
      // Retirer " DA" et convertir en nombre
      const valueWithoutDA = e.target.value.replace(/ DA$/, "");
      const numericValue = parseFloat(valueWithoutDA);

      setNewPayment((prevPayment) => ({
        ...prevPayment,
        amount_paid: isNaN(numericValue) || valueWithoutDA === ""
          ? ""
          : numericValue,  // Pas de formatage des décimales
      }));
    }}
    required
  />
  <span
    style={{
      position: "absolute",
      right: "10px",
      top: "40%",
      transform: "translateY(-50%)",
      pointerEvents: "none",
    }}
  >
    DA
  </span>
</div>

<label>Solde restant:</label>
<div style={{ position: "relative", display: "inline-block" }}>
  <input
    type="text"
    name="remaining_balance"
    value={newPayment.remaining_balance !== undefined && newPayment.remaining_balance !== null
      ? newPayment.remaining_balance
      : ""}
    placeholder="Solde restant"
    readOnly
    required
  />
  <span
    style={{
      position: "absolute",
      right: "10px",
      top: "40%",
      transform: "translateY(-50%)",
      pointerEvents: "none",
    }}
  >
    DA
  </span>
</div>








               
    



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

  {/* Statut */}
  <label>Statut:</label>
  <select
    name="status"
    value={newPayment.status}
    onChange={handleInputChange}
    required
  >
    <option value="" disabled hidden>
      Sélectionnez un statut
    </option>
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
                <td>{payment.total_amount} DA</td>
                <td>{payment.amount_paid} DA</td>
                <td>{payment.remaining_balance} DA</td>


                <td>{format(new Date(payment.payment_date), 'd-MM-yyyy')}</td>
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