import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

function MainClient() {
  const [clients, setClients] = useState([
    { id: 1, nom: 'Dupont', prenom: 'Jean', adresse: '123 Rue A', telephone: '123456789' },
    { id: 2, nom: 'Martin', prenom: 'Marie', adresse: '456 Rue B', telephone: '987654321' },
    { id: 3, nom: 'Lemoine', prenom: 'Pierre', adresse: '789 Rue C', telephone: '564738291' },
    { id: 4, nom: 'Durand', prenom: 'Sophie', adresse: '321 Rue D', telephone: '849204712' },
    { id: 5, nom: 'Leclerc', prenom: 'Julien', adresse: '654 Rue E', telephone: '123123123' },
    { id: 6, nom: 'Boulanger', prenom: 'Claire', adresse: '987 Rue F', telephone: '789789789' },
    { id: 7, nom: 'Lemoine', prenom: 'Lucie', adresse: '654 Rue G', telephone: '456456456' },
    { id: 8, nom: 'Dupuis', prenom: 'Marc', adresse: '432 Rue H', telephone: '321321321' },
    { id: 9, nom: 'Muller', prenom: 'Anne', adresse: '876 Rue I', telephone: '654654654' },
    { id: 10, nom: 'Perrin', prenom: 'Paul', adresse: '234 Rue J', telephone: '987987987' },
    { id: 11, nom: 'Leblanc', prenom: 'Emilie', adresse: '123 Rue K', telephone: '876876876' },
    { id: 12, nom: 'Leblanc', prenom: 'Emilie', adresse: '123 Rue K', telephone: '876876876' },
    // Ajoute plus de clients pour tester la pagination
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false); // Gérer l'état du modal
  const [isEditMode, setIsEditMode] = useState(false); // Gérer le mode édition
  const [newClient, setNewClient] = useState({
    id: null,
    nom: '',
    prenom: '',
    adresse: '',
    telephone: ''
  });

  const [currentPage, setCurrentPage] = useState(1); // Page courante
  const clientsPerPage = 8; // Nombre de clients par page

  // Calculer l'index des premiers et derniers clients à afficher pour la pagination
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);

  // Fonction pour changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculer le nombre de pages
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(clients.length / clientsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Ouvrir le modal pour ajouter un client
  const handleAddClientClick = () => {
    setIsEditMode(false); // Assurer qu'on est en mode ajout
    setNewClient({ id: null, nom: '', prenom: '', adresse: '', telephone: '' }); // Réinitialiser le formulaire
    setIsModalOpen(true);
  };

  // Ouvrir le modal pour modifier un client
  const handleEditClientClick = (client) => {
    setIsEditMode(true); // Passer en mode édition
    setNewClient(client); // Remplir le formulaire avec les données du client sélectionné
    setIsModalOpen(true);
  };

  // Fermer le modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient({
      ...newClient,
      [name]: value
    });
  };

  // Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      // Mise à jour d'un client existant
      setClients(clients.map(client => client.id === newClient.id ? newClient : client));
    } else {
      // Ajouter un nouveau client avec un ID unique
      const newClientWithId = {
        id: Date.now(), // Utiliser l'heure actuelle pour un ID unique
        ...newClient
      };
      setClients(prevClients => [...prevClients, newClientWithId]);
    }
    setNewClient({ nom: '', prenom: '', adresse: '', telephone: '' });
    setIsModalOpen(false); // Fermer le modal après soumission
  };

  // Supprimer un client spécifique
  const handleDeleteClient = (id) => {
    setClients(clients.filter(client => client.id !== id));
  };

  // Supprimer tous les clients
  const handleDeleteAll = () => {
    setClients([]); // Vide la liste des clients
  };

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

      {/* Modal Formulaire */}
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
                type="text"
                name="telephone"
                value={newClient.telephone}
                onChange={handleInputChange}
                required
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
              <td colSpan="6" style={{ textAlign: 'center' }}>Aucun client disponible</td>
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
                  <td className="status-column">
                    <FaEdit
                      className="action-icon edit-icon"
                      title="Éditer"
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

      {/* Pagination */}
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
