import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPrint } from 'react-icons/fa';


function MainRecu() {
  const [clients, setClients] = useState([
    { id: 1, nom: 'Dupont', prenom: 'Jean', dateReservation: '2024-11-01', dateDebut: '2024-11-10', total: 500, montantPaye: 300, soldeRestant: 200, statut: 'En attente' },
    { id: 2, nom: 'Martin', prenom: 'Marie', dateReservation: '2024-11-02', dateDebut: '2024-11-12', total: 600, montantPaye: 600, soldeRestant: 0, statut: 'Payé' },
    { id: 3, nom: 'Lemoine', prenom: 'Pierre', dateReservation: '2024-11-03', dateDebut: '2024-11-15', total: 700, montantPaye: 500, soldeRestant: 200, statut: 'En attente' },
    { id: 4, nom: 'Durand', prenom: 'Sophie', dateReservation: '2024-11-04', dateDebut: '2024-11-16', total: 550, montantPaye: 550, soldeRestant: 0, statut: 'Payé' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalitesFile, setModalitesFile] = useState(null); // Pour stocker le fichier téléchargé
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 9;

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddModalitesClick = () => {
    setIsModalOpen(true); // Ouvre le modal pour télécharger un fichier
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Ferme le modal
  };

  const handleFileChange = (e) => {
    setModalitesFile(e.target.files[0]); // Enregistre le fichier téléchargé
  };

  const handleFileDelete = () => {
    setModalitesFile(null); // Supprime le fichier téléchargé
  };

  const handleSaveFile = (e) => {
    e.preventDefault();
    // Simuler un enregistrement de fichier ici (par exemple, en l'envoyant à un backend)
    console.log('Fichier enregistré:', modalitesFile.name); // Par exemple, enregistrer le fichier
    setIsModalOpen(false); // Ferme le modal après l'enregistrement
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(clients.length / clientsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="main-container2">
      <div className="header-cl">
        <h3>GESTION DES REÇUS</h3>
        <span className="client-count">Tous les reçus : {clients.length}</span>
      </div>
      <div className="footer-buttons">
        <button className="add-client-btn" onClick={handleAddModalitesClick}>
          {modalitesFile ? 'Imprimer les modalités' : 'Ajouter les modalités'}
        </button>
      </div>

      {isModalOpen && !modalitesFile && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCloseModal}>&times;</span>
            <h3>Ajouter un fichier de modalités</h3>
            <form onSubmit={handleSaveFile}>
              <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} required />
              <div className="modal-buttons">
                <button type="submit">Enregistrer</button>
                <button type="button" onClick={handleCloseModal}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalitesFile && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCloseModal}>&times;</span>
            <h3>Fichier téléchargé</h3>
            <p>Le fichier des modalités a été téléchargé avec succès.</p>
            <div className="modal-buttons">
              <button type="button" onClick={handleFileDelete}>
                <FaTrash /> Supprimer
              </button>
              <button type="button" onClick={handleSaveFile}>
                <FaPrint /> Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="clients-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Date de réservation</th>
            <th>Date de début</th>
            <th>Total</th>
            <th>Montant payé</th>
            <th>Solde restant</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentClients.length === 0 ? (
            <tr>
              <td colSpan="10" style={{ textAlign: 'center' }}>Aucun client disponible</td>
            </tr>
          ) : (
            currentClients.map((client) => (
              <tr key={client.id}>
                <td>{client.id}</td>
                <td>{client.nom}</td>
                <td>{client.prenom}</td>
                <td>{client.dateReservation}</td>
                <td>{client.dateDebut}</td>
                <td>{client.total}</td>
                <td>{client.montantPaye}</td>
                <td>{client.soldeRestant}</td>
                <td>{client.statut}</td>
                <td>
                  <FaEdit className="action-icon edit-icon" title="Éditer" />
                  <FaTrash className="action-icon delete-icon" title="Supprimer" />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        <span className="page-info">{indexOfFirstClient + 1} sur {clients.length} clients</span>
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>&lt;</button>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === pageNumbers.length}>&gt;</button>
      </div>
    </div>
  );
}

export default MainRecu;
