import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

function MainClient() {
  // Charger les clients depuis le localStorage
  const loadClientsFromLocalStorage = () => {
    const savedClients = localStorage.getItem('clients');
    return savedClients ? JSON.parse(savedClients) : [];
  };

  // Charger les données du formulaire depuis le localStorage
  const loadFormStateFromLocalStorage = () => {
    const savedFormState = localStorage.getItem('newClient');
    return savedFormState ? JSON.parse(savedFormState) : { id: '', nom: '', prenom: '', adresse: '', telephone: '' };
  };

  const [clients, setClients] = useState(loadClientsFromLocalStorage());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newClient, setNewClient] = useState(loadFormStateFromLocalStorage());

  // Gestion des pages
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 8;
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Page numbers pour la pagination
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(clients.length / clientsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Ouvrir la modale pour ajouter un client
  const handleAddClientClick = () => {
    setIsEditMode(false);
    const newId = clients.length ? Math.max(...clients.map(client => client.id)) + 1 : 1;
    setNewClient({ id: newId, nom: '', prenom: '', adresse: '', telephone: '' });
    setIsModalOpen(true);
  };

  // Ouvrir la modale pour modifier un client
  const handleEditClientClick = (client) => {
    setIsEditMode(true);
    setNewClient(client);
    setIsModalOpen(true);
  };

  // Fermer la modale
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewClient({ nom: '', prenom: '', adresse: '', telephone: '' });
    localStorage.removeItem('newClient'); // Réinitialiser l'état du formulaire
  };

  // Sauvegarder l'état du formulaire dans le localStorage
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'telephone') {
      let formattedValue = value.replace(/\D/g, ''); // Retirer tout sauf les chiffres
      if (formattedValue.length > 10) {
        formattedValue = formattedValue.slice(0, 10); // Limiter à 10 chiffres
      }
      formattedValue = formattedValue.replace(/(\d{2})(?=\d)/g, '$1 ').trim(); // Formater avec des espaces
      setNewClient({
        ...newClient,
        [name]: formattedValue
      });
      localStorage.setItem('newClient', JSON.stringify({ ...newClient, [name]: formattedValue }));
    } else {
      setNewClient({
        ...newClient,
        [name]: value
      });
      localStorage.setItem('newClient', JSON.stringify({ ...newClient, [name]: value }));
    }
  };

  // Soumettre le formulaire (ajouter ou modifier un client)
  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedClients;
    if (isEditMode) {
      updatedClients = clients.map(client => client.id === newClient.id ? newClient : client);
    } else {
      updatedClients = [...clients, newClient];
    }
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
    setNewClient({ nom: '', prenom: '', adresse: '', telephone: '' });
    localStorage.removeItem('newClient'); // Réinitialiser l'état du formulaire après soumission
    setIsModalOpen(false);
  };

  // Supprimer un client
  const handleDeleteClient = (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?");
    if (confirmDelete) {
      const updatedClients = clients.filter(client => client.id !== id);
      setClients(updatedClients);
      localStorage.setItem('clients', JSON.stringify(updatedClients));
    }
  };

  // Supprimer tous les clients
  const handleDeleteAll = () => {
    const confirmDeleteAll = window.confirm("Êtes-vous sûr de vouloir supprimer tous les clients ?");
    if (confirmDeleteAll) {
      setClients([]);
      localStorage.removeItem('clients');
    }
  };

  useEffect(() => {
    // Lors du montage, on récupère les clients et l'état du formulaire
    setNewClient(loadFormStateFromLocalStorage());
  }, []);

  return (
    <div className="main-container2">
      <div className="header-cl">
        <h3>GESTION DES CLIENTS</h3>
        <span className="client-count">Tous les clients : {clients.length}</span>
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
              <td colSpan="6" style={{ textAlign: 'center' }}>Aucun client ajouté</td>
            </tr>
          ) : (
            currentClients.map((client) => (
              <React.Fragment key={client.id}>
                <tr>
                  <td>{client.id}</td>
                  <td>{client.nom}</td>
                  <td>{client.prenom}</td>
                  <td>{client.adresse}</td>
                  <td>{client.telephone}</td>
                  <td>
                    <FaEdit
                      className="action-icon edit-icon"
                      title="Modifier"
                      onClick={() => handleEditClientClick(client)}
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
          {Math.min(indexOfLastClient, clients.length)} sur {clients.length} clients
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
