import React, { useState, useEffect, FormEvent } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

function MainClient({searchTerm}:{searchTerm:string}) {
  const loadFormStateFromLocalStorage = () => {
    const savedFormState = localStorage.getItem('newClient');
    return savedFormState ? JSON.parse(savedFormState) : { name: '', surname: '', address: '', phone: '' };
  };

  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newClient, setNewClient] = useState<Client>(loadFormStateFromLocalStorage());
  const [nbrClients, setNbrClients] = useState(0)
  // Gestion des pages
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 7;
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const filteredClients = clients.filter((client) =>
    [client.name, client.surname, client.phone, client.address]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data: Client[] = await window.sqliteClients.getClients();
        const ClientsNumber = await window.sqliteStatistics.getNumClients();
        setNbrClients(ClientsNumber);
        setClients(data);
      } catch (err) {
        window.alert(`Error: ${err}`);
        window.electron.fixFocus();
      }
    };
  
    fetchClients();
  }, []);
  

  // Page numbers pour la pagination
  const pageNumbers = [];
  const totalPages = clients ? Math.ceil(clients.length / clientsPerPage) : 0;
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  // Ouvrir la modale pour ajouter un client
  const openAddForm = () => {
    setIsEditMode(false);
    setNewClient({ name: '', surname: '', address: '', phone: '' });
    setIsModalOpen(true);
  };

  const opendEditForm = (client:Client) => {
    setIsEditMode(true);
    setNewClient(client);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewClient({ name: '', surname: '', address: '', phone: '' });
    localStorage.removeItem('newClient');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();  
    const { name, value } = e.target;
  
    setNewClient((prev) => {
      let formattedValue = value;
  
      if (name === 'phone') {
        // Format phone numbers (limit to 10 digits with spaces)
        formattedValue = value.replace(/\D/g, '').slice(0, 10).replace(/(\d{2})(?=\d)/g, '$1 ').trim();
      }
  
      return { ...prev, [name]: formattedValue };
    });
  };  

  // ajouter ou modifier un client
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const { id, name, surname, phone, address } = newClient;
    let updatedClients = [...clients];
  
    try {
      if (isEditMode) {
        const data = await window.sqliteClients.editClient(id as number, name, surname, phone, address);
        updatedClients = clients.map(client => (client.id === id ? newClient : client));
        window.alert(`Client ${data.clientId} was edited successfully`);
      } else {
        const data = await window.sqliteClients.createClient(name, surname, phone, address);
        updatedClients = [...clients, { ...newClient, id: data.clientId }];
        window.alert(`Client ${data.clientId} was created successfully`);
      }
      window.electron.fixFocus();
      // Update client state and reset form
      setClients(updatedClients);
      resetFormState();
    } catch (error) {
      console.error("Error while submitting client:", error);
      window.alert("An error occurred while processing the request.");
    }
  };

  // Reset form state and close modal
  const resetFormState = () => {
    setNewClient({ id: 0, name: '', surname: '', address: '', phone: '' });
    localStorage.removeItem('newClient');
    setIsModalOpen(false);
  };

  // Supprimer un client
  const handleDeleteClient = async (id: number) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?");
    if (confirmDelete) {
      try {
        const data = await window.sqliteClients.deleteClient(id);
        window.alert(data.message)
        const updatedClients = clients.filter((client) => client.id !== id);
        setClients(updatedClients);
      } catch (e) {
        console.error(e);
      }
    }
    window.electron.fixFocus();
  };  

  // Supprimer tous les clients
  const handleDeleteAll = async() => {
    const confirmDeleteAll = window.confirm("Êtes-vous sûr de vouloir supprimer tous les clients ?");
    if (confirmDeleteAll) {
      try{
          const data = await window.sqliteClients.deleteAllClients();
          setClients([]);
          window.alert(data.message)
      }catch(e){
        console.log(e)
      }
    }
    window.electron.fixFocus();
  };

  return (
    <div className="main-container2">
      <div className="header-cl">
        <h3>GESTION DES CLIENTS</h3>
        <span className="client-count">Tous les clients : {nbrClients && nbrClients}</span>
      </div>
      <div className="footer-buttons">
        <button className="add-client-btn" onClick={openAddForm}>Ajouter un client</button>
        <button className="delete-all-btn" onClick={handleDeleteAll}>Supprimer tout</button>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCloseModal}>&times;</span>
            <h3>{isEditMode ? 'Modifier un client' : 'Ajouter un client'}</h3>
            <form onSubmit={handleSubmit}>
              {isEditMode && (
                <div>
                  <label>ID:</label>
                  <input
                    type="number"
                    name="id"
                    value={newClient.id}
                    onChange={handleInputChange}
                    readOnly
                  />
                </div>
              )}
              <label>Nom:</label>
              <input
                type="text"
                name="name"
                value={newClient.name || ''}
                onChange={handleInputChange}
                required
              />
              <label>Prénom:</label>
              <input
                type="text"
                name="surname"
                value={newClient.surname || ''}
                onChange={handleInputChange}
                required
              />
              <label>Numéro de téléphone:</label>
              <input
                type="tel"
                name="phone"
                value={newClient.phone || ''}
                onChange={handleInputChange}
                required
                placeholder="Ex: 06 56 62 49 81"
              />
              <label>Adresse:</label>
              <input
                type="text"
                name="address"
                value={newClient.address || ''}
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

      <table className="clients-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Adresse</th>
            <th>Téléphone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentClients.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center' }}>Aucun client ajouté</td>
            </tr>
          ) : (
            currentClients.map((client:any) => (
              <React.Fragment key={client.id}>
                <tr>
                  <td>{client.id}</td>
                  <td>{client.name}</td>
                  <td>{client.surname}</td>
                  <td>{client.address}</td>
                  <td>{client.phone}</td>
                  <td>
                    <FaEdit
                      className="action-icon edit-icon"
                      title="Modifier"
                      onClick={() => opendEditForm(client)}
                    />
                    <FaTrash
                      className="action-icon delete-icon"
                      title="Supprimer"
                      onClick={() => handleDeleteClient(client.id)}
                    />
                  </td>
                </tr>
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        <span className="page-info">
          {Math.min(indexOfLastClient, (clients || []).length)} sur {(clients || []).length} clients
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

export default MainClient;