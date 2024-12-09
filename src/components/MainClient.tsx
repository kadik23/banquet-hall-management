import React, { useState, useEffect, useContext } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { SearchContext } from './SearchContext'; // Importez le contexte de recherche

function MainClient() {
  const { searchTerm } = useContext(SearchContext); // Utilisez le contexte pour accéder au terme de recherche

  const [clients, setClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newClient, setNewClient] = useState({ id: '', nom: '', prenom: '', adresse: '', telephone: '' });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 8;
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;

  // Filtrage des clients en fonction du terme de recherche
  const filteredClients = clients.filter((client) =>
    [client.nom, client.prenom, client.telephone, client.adresse]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredClients.length / clientsPerPage); i++) {
    pageNumbers.push(i);
  }

  const fetchClients = async (page = 1) => {
    const response = await fetch(`/api/clients?page=${page}`);
    const data = await response.json();
    setClients(data);
  };

  useEffect(() => {
    fetchClients();
  }, []); // Charge les clients une seule fois lors du montage du composant

  const handleAddClientClick = () => {
    setIsEditMode(false);
    setNewClient({ id: '', nom: '', prenom: '', adresse: '', telephone: '' });
    setIsModalOpen(true);
  };

  const handleEditClientClick = (client) => {
    setIsEditMode(true);
    setNewClient(client);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewClient({ id: '', nom: '', prenom: '', adresse: '', telephone: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'telephone') {
      let formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 10) {
        formattedValue = formattedValue.slice(0, 10);
      }
      formattedValue = formattedValue.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
      setNewClient({
        ...newClient,
        [name]: formattedValue
      });
    } else {
      setNewClient({
        ...newClient,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;
    if (isEditMode) {
      // Mise à jour du client
      response = await fetch(`/api/clients/${newClient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient)
      });
    } else {
      // Ajout du client
      response = await fetch(`/api/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient)
      });
    }

    if (response.ok) {
      fetchClients(currentPage); // Rafraîchit la liste des clients
    }

    setNewClient({ id: '', nom: '', prenom: '', adresse: '', telephone: '' });
    setIsModalOpen(false);
  };

  const handleDeleteClient = async (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?");
    if (confirmDelete) {
      const response = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchClients(currentPage); // Rafraîchit la liste des clients
      }
    }
  };

  const handleDeleteAll = async () => {
    const confirmDeleteAll = window.confirm("Êtes-vous sûr de vouloir supprimer tous les clients ?");
    if (confirmDeleteAll) {
      const response = await fetch(`/api/clients`, { method: 'DELETE' });
      if (response.ok) {
        fetchClients(currentPage); // Rafraîchit la liste des clients
      }
    }
  };

  return (
    <div className="main-container2">
      <div className="header-cl">
        <h3>GESTION DES CLIENTS</h3>
        <span className="client-count">Tous les clients : {filteredClients.length}</span>
      </div>
      <div className="footer-buttons">
        <button className="add-client-btn" onClick={handleAddClientClick}>Ajouter un client</button>
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
                  <input type="number" name="id" value={newClient.id} readOnly />
                </div>
              )}
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
          {currentClients.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>Aucun client trouvé</td>
            </tr>
          ) : (
            currentClients.map((client) => (
              <tr key={client.id}>
                <td>{client.id}</td>
                <td>{client.nom}</td>
                <td>{client.prenom}</td>
                <td>{client.adresse}</td>
                <td>{client.telephone}</td>
                <td>
                  <FaEdit className="action-icon edit-icon" title="Modifier" onClick={() => handleEditClientClick(client)} />
                  <FaTrash className="action-icon delete-icon" title="Supprimer" onClick={() => handleDeleteClient(client.id)} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
  
      <div className="pagination">
        <span className="page-number">
          {pageNumbers.map(number => (
            <button key={number} onClick={() => paginate(number)}>{number}</button>
          ))}
        </span>
      </div>
    </div>
  );
  
}

export default MainClient;
