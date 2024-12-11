import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { BsSearch } from 'react-icons/bs';
import Header from './Header';


interface Client {
  id: number;
  nom: string;
  prenom: string;
  adresse: string;
  telephone: string;
}

function MainClient() {


  const loadClientsFromLocalStorage = () => {
    const savedClients = localStorage.getItem('clients');
    return savedClients ? JSON.parse(savedClients) : [];
  };

  const loadFormStateFromLocalStorage = () => {
    const savedFormState = localStorage.getItem('newClient');
    return savedFormState ? JSON.parse(savedFormState) : { id: '', nom: '', prenom: '', adresse: '', telephone: '' };
  };

  const [clients, setClients] = useState<Client[]>(loadClientsFromLocalStorage());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newClient, setNewClient] = useState<Client>(loadFormStateFromLocalStorage());
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [nbrClients, setNbrClients] = useState(0);

  const clientsPerPage = 8;
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;

  const filteredClients = clients.filter((client) =>
    [client.nom, client.prenom, client.telephone, client.adresse]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data: Client[] = await window.sqliteClients.getClients(14);
        const ClientsNumber = await window.sqliteStatistics.getNumClients(14);
        setNbrClients(ClientsNumber);
        setClients(data);
      } catch (err) {
        alert(`Error: ${err}`);
      }
    };

    fetchClients();
  }, [currentPage]);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredClients.length / clientsPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleAddClientClick = (clientToEdit: Client | null) => {
    if (clientToEdit) {
      setIsEditMode(true);
      setNewClient(clientToEdit);
    } else {
      setIsEditMode(false);
      const newId = clients.length ? Math.max(...clients.map((client) => client.id)) + 1 : 1;
      setNewClient({ id: newId, nom: '', prenom: '', adresse: '', telephone: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewClient({ nom: '', prenom: '', adresse: '', telephone: '' });
    localStorage.removeItem('newClient');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'telephone') {
      let formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 10) {
        formattedValue = formattedValue.slice(0, 10);
      }
      setNewClient({ ...newClient, telephone: formattedValue });
    } else {
      setNewClient({ ...newClient, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedClients: Client[];
    if (isEditMode) {
      updatedClients = clients.map((client) => client.id === newClient.id ? newClient : client);
      try {
        const data = await window.sqliteClients.editClient(newClient.id, newClient.nom, newClient.prenom, newClient.telephone, newClient.adresse);
        alert(`Client ${data.clientId} a été modifié avec succès`);
      } catch (e) {
        console.log(e);
      }
    } else {
      updatedClients = [...clients, newClient];
      try {
        const data = await window.sqliteClients.createClient(newClient.nom, newClient.prenom, newClient.telephone, newClient.adresse);
        alert(`Client ${data.clientId} a été ajouté avec succès`);
        newClient.id = data.clientId;
      } catch (e) {
        console.log(e);
      }
    }
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
    setNewClient({ nom: '', prenom: '', adresse: '', telephone: '' });
    localStorage.removeItem('newClient');
    setIsModalOpen(false);
  };

  const handleDeleteClient = async (id: number) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?");
    if (confirmDelete) {
      const updatedClients = clients.filter((client) => client.id !== id);
      setClients(updatedClients);
      localStorage.setItem('clients', JSON.stringify(updatedClients));
      try {
        const data = await window.sqliteClients.deleteClient(id);
        alert(data.message);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleDeleteAll = async () => {
    const confirmDeleteAll = window.confirm("Êtes-vous sûr de vouloir supprimer tous les clients ?");
    if (confirmDeleteAll) {
      setClients([]);
      localStorage.removeItem('clients');
      try {
        const data = await window.sqliteClients.deleteAllClients();
        alert(data.message);
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <div className="main-container2">

    <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    


      <div className="header-cl">
        <h3>GESTION DES CLIENTS</h3>
        <span className="client-count">Tous les clients : {clients.length}</span>
      </div>
      <div className="footer-buttons">
        <button className="add-client-btn" onClick={() => handleAddClientClick(null)}>Ajouter un client</button>
        <button className="delete-all-btn" onClick={handleDeleteAll}>Supprimer tous les clients</button>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCloseModal}>&times;</span>
            <h3>{isEditMode ? 'Modifier un client' : 'Ajouter un client'}</h3>
            <form onSubmit={handleSubmit}>
              <label>Nom:</label>
              <input
                type="text"
                name="nom"
                value={newClient.nom}
                onChange={handleInputChange}
                required
              />
              <label>Prénom:</label>
              <input
                type="text"
                name="prenom"
                value={newClient.prenom}
                onChange={handleInputChange}
                required
              />
              <label>Numéro de téléphone:</label>
              <input
                type="tel"
                name="telephone"
                value={newClient.telephone}
                onChange={handleInputChange}
                required
                placeholder="Ex: 06 56 62 49 81"
              />
              <label>Adresse:</label>
              <input
                type="text"
                name="adresse"
                value={newClient.adresse}
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
          {currentClients.map((client) => (
            <tr key={client.id}>
              <td>{client.id}</td>
              <td>{client.nom}</td>
              <td>{client.prenom}</td>
              <td>{client.adresse}</td>
              <td>{client.telephone}</td>
              <td>
                <FaEdit className="action-icon edit-icon" onClick={() => handleAddClientClick(client)} />
                <FaTrash className="action-icon delete-icon" onClick={() => handleDeleteClient(client.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>&lt;</button>
        {pageNumbers.map((number) => (
          <button key={number} onClick={() => paginate(number)}>{number}</button>
        ))}
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === pageNumbers.length}>&gt;</button>
      </div>
    </div>
  );
}

export default MainClient;
