import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { BsSearch } from 'react-icons/bs';

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

  const [clients, setClients] = useState<Client[]>(loadClientsFromLocalStorage());
  const [newClient, setNewClient] = useState<Client>({ id: 0, nom: '', prenom: '', adresse: '', telephone: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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
        setClients(data);
      } catch (err) {
        alert(`Error: ${err}`);
      }
    };

    // Charger depuis localStorage ou API si vide
    if (!localStorage.getItem('clients')) {
      fetchClients();
    }
  }, [currentPage]);

  const handleAddClientClick = (clientToEdit: Client | null) => {
    setIsEditMode(!!clientToEdit);
    setNewClient(clientToEdit || { id: clients.length + 1, nom: '', prenom: '', adresse: '', telephone: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewClient({ id: 0, nom: '', prenom: '', adresse: '', telephone: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClient({ ...newClient, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedClients: Client[];
    if (isEditMode) {
      updatedClients = clients.map((client) => client.id === newClient.id ? newClient : client);
    } else {
      updatedClients = [...clients, newClient];
    }

    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));

    // On réinitialise le formulaire et on ferme le modal
    setNewClient({ id: 0, nom: '', prenom: '', adresse: '', telephone: '' });
    setIsModalOpen(false);
  };

  const handleDeleteClient = async (id: number) => {
    const updatedClients = clients.filter((client) => client.id !== id);
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  };

  const handleDeleteAll = async () => {
    setClients([]);
    localStorage.removeItem('clients');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Réinitialiser la pagination lors de la recherche
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredClients.length / clientsPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="main-container2">
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

      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Rechercher un client..."
        />
        <BsSearch className="search-icon" />
      </div>

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
