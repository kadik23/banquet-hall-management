import React, { useState } from 'react';
import { FaPrint, FaTrash } from 'react-icons/fa';

function MainRecu() {
  const [recus, setRecus] = useState([
    { id: 1, nom: 'Dupont', prenom: 'Jean', dateReservation: '2024-11-01', dateDebut: '2024-11-10', total: 500, montantPaye: 300, soldeRestant: 200, statut: 'En attente' },
    { id: 2, nom: 'Martin', prenom: 'Marie', dateReservation: '2024-11-02', dateDebut: '2024-11-12', total: 600, montantPaye: 600, soldeRestant: 0, statut: 'Payé' },
    // Ajoutez plus de données ici si nécessaire
  ]);

  const [modalitesFile, setModalitesFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const recusPerPage = 8;
  const indexOfLastRecu = currentPage * recusPerPage;
  const indexOfFirstRecu = indexOfLastRecu - recusPerPage;
  const currentRecus = recus.slice(indexOfFirstRecu, indexOfLastRecu);
  const pageNumbers = Array.from({ length: Math.ceil(recus.length / recusPerPage) }, (_, i) => i + 1);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleAddModalitesClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setModalitesFile(file);
    }
  };

  const handleSaveFile = (e: any) => {
    e.preventDefault();
    // Sauvegarder le fichier ou faire l'action désirée
    alert('Le fichier a été enregistré');
    handleCloseModal();
  };

  const handleFileDelete = () => {
    setModalitesFile(null);
    alert('Le fichier des modalités a été supprimé');
  };

  const handleDeleteAll = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer tous les reçus ?')) {
      setRecus([]);
    }
  };

  const handlePrintRecu = (recu: any) => {
    const printWindow = window.open('', '_blank');
    const content = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .recu-container { border: 1px solid #ccc; padding: 20px; max-width: 600px; margin: auto; }
            h2, h4 { text-align: center; margin: 0 0 10px; }
            .details { margin: 20px 0; }
            .details p { margin: 5px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 0.9em; color: #555; }
            .footer p { margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="recu-container">
            <h2>Reçu de Réservation</h2>
            <h4>Salle des Fêtes XYZ</h4>
            <div class="details">
              <p><strong>Nom :</strong> ${recu.nom}</p>
              <p><strong>Prénom :</strong> ${recu.prenom}</p>
              <p><strong>Date de réservation :</strong> ${recu.dateReservation}</p>
              <p><strong>Date de début :</strong> ${recu.dateDebut}</p>
              <p><strong>Total :</strong> ${recu.total} DZD</p>
              <p><strong>Montant payé :</strong> ${recu.montantPaye} DZD</p>
              <p><strong>Solde restant :</strong> ${recu.soldeRestant} DZD</p>
              <p><strong>Statut :</strong> ${recu.statut}</p>
            </div>
            <div class="footer">
              <p>Merci pour votre réservation.</p>
              <p>Salle des Fêtes XYZ, Wilaya de VotreVille</p>
              <p><strong>Contact :</strong> +213 6 1234 5678</p>
            </div>
          </div>
        </body>
      </html>
    `;
    printWindow?.document.open();
    printWindow?.document.write(content);
    printWindow?.document.close();
    printWindow?.print();
  };

  return (
    <div className="main-container2">
      <div className="header-cl">
        <h3>GESTION DES REÇUS</h3>
        <span className="recu-count">Tous les reçus : {recus.length}</span>
      </div>

      <div className="footer-buttons">
        <button className="add-recu-btn" onClick={handleAddModalitesClick}>
          {modalitesFile ? 'Imprimer les modalités' : 'Ajouter les modalités'}
        </button>
        <button className="delete-all-btn" onClick={handleDeleteAll}>
          Supprimer tout
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

      <table className="recus-table">
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
          {currentRecus.length === 0 ? (
            <tr>
              <td colSpan={10} style={{ textAlign: 'center' }}>Aucun reçu disponible</td>
            </tr>
          ) : (
            currentRecus.map((recu) => (
              <tr key={recu.id}>
                <td>{recu.id}</td>
                <td>{recu.nom}</td>
                <td>{recu.prenom}</td>
                <td>{recu.dateReservation}</td>
                <td>{recu.dateDebut}</td>
                <td>{recu.total}</td>
                <td>{recu.montantPaye}</td>
                <td>{recu.soldeRestant}</td>
                <td>{recu.statut}</td>
                <td>
                  <FaPrint
                    className="action-icon"
                    title="Imprimer"
                    onClick={() => handlePrintRecu(recu)}
                  />
                  <FaTrash
                    className="action-icon delete-icon"
                    title="Supprimer"
                    onClick={() =>
                      setRecus(recus.filter((r) => r.id !== recu.id))
                    }
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        <span className="page-info">
          {currentRecus.length} sur {recus.length} reçus
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

export default MainRecu;
