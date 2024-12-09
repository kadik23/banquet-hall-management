import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

function MainClient() {
  // Charger les clients depuis le localStorage
  // const loadClientsFromLocalStorage = () => {
  //   const savedClients = localStorage.getItem('clients');
  //   return savedClients ? JSON.parse(savedClients) : [];
  // };

  // Charger les données du formulaire depuis le localStorage
  const loadFormStateFromLocalStorage = () => {
    const savedFormState = localStorage.getItem('newClient');
    return savedFormState ? JSON.parse(savedFormState) : { id: '', name: '', surname: '', address: '', phone: '' };
  };

  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newClient, setNewClient] = useState(loadFormStateFromLocalStorage());

  // Gestion des pages
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 8;
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients =  (clients || []).slice(indexOfFirstClient, indexOfLastClient);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const [nbrClients, setNbrClients] = useState(0)
  useEffect(()=>{
    const fetchClients = async () => {
      try {
        const data: Client[] = await window.sqliteClients.getClients();
        const ClientsNumber= await window.sqliteStatistics.getNumClients();
        setNbrClients(ClientsNumber)
        setClients(data);
      } catch (err) {
        alert(`Error: ${err}`);
      }
    };

    fetchClients();
  },[])

  // Page numbers pour la pagination
  const pageNumbers = [];
  const totalPages = clients ? Math.ceil(clients.length / clientsPerPage) : 0;
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  // Ouvrir la modale pour ajouter un client
  const handleAddClientClick = () => {
    setIsEditMode(false);
    setNewClient({ name: '', surname: '', address: '', phone: '' });
    setIsModalOpen(true);
  };

  // Ouvrir la modale pour modifier un client
  const handleEditClientClick = (client:any) => {
    setIsEditMode(true);
    setNewClient(client);
    setIsModalOpen(true);
  };

  // Fermer la modale
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewClient({ name: '', surname: '', address: '', phone: '' });
    localStorage.removeItem('newClient'); // Réinitialiser l'état du formulaire
  };

  // Sauvegarder l'état du formulaire dans le localStorage
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    if (name === 'phone') {
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
  const handleSubmit = async(e:any) => {
    e.preventDefault();
    let updatedClients: Client[];
    if (isEditMode) {
      try{
        const data = await window.sqliteClients.editClient(newClient.id, newClient.name,newClient.surname,newClient.phone,newClient.address);
        
        alert(`Client ${data.clientId} was edited successfuly`)
        updatedClients = clients.map((client:any) => client.id === newClient.id ? newClient : client);
      }catch(e){
        console.log(e)
      }
    } else {
      try{
        const data = await window.sqliteClients.createClient(newClient.name,newClient.surname,newClient.phone, newClient.address);
        alert(`Client ${data.clientId} was created successfuly`)
        newClient.id = data.clientId
        updatedClients = [...clients, newClient];
      }catch(e){
        console.log(e)
      }
    }
    setClients(updatedClients);
    // localStorage.setItem('clients', JSON.stringify(updatedClients));
    setNewClient({ name: '', surname: '', address: '', phone: '' });
    localStorage.removeItem('newClient'); // Réinitialiser l'état du formulaire après soumission
    setIsModalOpen(false);
  };

  // Supprimer un client
  const handleDeleteClient = async(id:number) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?");
    if (confirmDelete) {
      try{
        const data = await window.sqliteClients.deleteClient(id);
        alert(data.message)
        const updatedClients = clients.filter((client:any) => client.id !== id);
        setClients(updatedClients);
        // localStorage.setItem('clients', JSON.stringify(updatedClients));
      }catch(e){
        console.log(e)
      }
    }
  };

  // Supprimer tous les clients
  const handleDeleteAll = async() => {
    const confirmDeleteAll = window.confirm("Êtes-vous sûr de vouloir supprimer tous les clients ?");
    if (confirmDeleteAll) {
      try{
          const data = await window.sqliteClients.deleteAllClients();
          setClients([]);
          alert(data.message)
          // localStorage.removeItem('clients');
      }catch(e){
        console.log(e)
      }
    }
  };

  // useEffect(() => {
  //   // Lors du montage, on récupère les clients et l'état du formulaire
  //   setNewClient(loadFormStateFromLocalStorage());
  // }, []);

  return (
    <div className="main-container2">
      <div className="header-cl">
        <h3>GESTION DES CLIENTS</h3>
        <span className="client-count">Tous les clients : {nbrClients && nbrClients}</span>
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
                name="name"
                value={newClient.name}
                onChange={handleInputChange}
                required
              />
              <label>Prénom:</label>
              <input
                type="text"
                name="surname"
                value={newClient.surname}
                onChange={handleInputChange}
                required
              />
              <label>Numéro de téléphone:</label>
              <input
                type="tel"
                name="phone"
                value={newClient.phone}
                onChange={handleInputChange}
                required
                placeholder="Ex: 06 56 62 49 81"
              />
              <label>Adresse:</label>
              <input
                type="text"
                name="address"
                value={newClient.address}
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
