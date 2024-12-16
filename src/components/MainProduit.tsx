import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import '../App.css';

function MainProduit() {
  const [productsByDate, setProductsByDate] = useState({});
  const [currentDate, setCurrentDate] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [nextId, setNextId] = useState(1); // Compteur pour l'ID
  const [deletedIds, setDeletedIds] = useState([]); // Suivi des IDs supprimés
  const [newProduct, setNewProduct] = useState({
    id: null,
    nom: '',
    prixUnitaire: '',
    quantite: '',
    montantTotal: '',
    statut: '',
    date: ''
  });
  const productsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setCurrentDate(today);
    setSelectedDate(today);

    const storedProducts = JSON.parse(localStorage.getItem('productsByDate')) || {};
    setProductsByDate(storedProducts);

    const storedNextId = localStorage.getItem('nextId');
    if (storedNextId) {
      setNextId(parseInt(storedNextId, 10));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('productsByDate', JSON.stringify(productsByDate));
  }, [productsByDate]);

  useEffect(() => {
    localStorage.setItem('nextId', nextId); // Sauvegarder le compteur d'ID
  }, [nextId]);

  const formatDate = (date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('fr-FR');
  };

  const handleFilterDateChange = (e) => {
    const selected = e.target.value;
    if (selected <= currentDate) {
      setSelectedDate(selected);
      setCurrentPage(1);  // Réinitialiser la page quand une nouvelle date est sélectionnée
    } else {
      alert("Vous ne pouvez pas sélectionner une date future !");
    }
  };
  

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleAddProductClick = () => {
    setIsEditMode(false);
    setNewProduct({
      id: null,
      nom: '',
      prixUnitaire: '',
      quantite: '',
      montantTotal: '',
      statut: 'Payé',
      date: currentDate
    });
    setIsModalOpen(true);
  };

  const handleEditProductClick = (product) => {
    setIsEditMode(true);
    setNewProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProductsByDate = { ...productsByDate };

    let newProductWithId;
    if (isEditMode) {
      // Modifier un produit existant
      const updatedProducts = productsByDate[selectedDate].map((product) =>
        product.id === newProduct.id ? newProduct : product
      );
      updatedProductsByDate[selectedDate] = updatedProducts;
    } else {
      // Ajouter un nouveau produit
      const currentProducts = productsByDate[selectedDate] || [];
      
      let newId;
      if (deletedIds.length > 0) {
        // Réutiliser un ID supprimé s'il y en a
        newId = deletedIds[0];  // Utilise le premier ID supprimé disponible
        setDeletedIds(deletedIds.slice(1)); // Retirer l'ID utilisé de la liste
      } else {
        // Si aucun ID supprimé n'est disponible, utilise nextId
        newId = nextId;
        setNextId(nextId + 1); // Incrémenter nextId
      }
      
      newProductWithId = { ...newProduct, id: newId };
      updatedProductsByDate[currentDate] = [
        ...(productsByDate[currentDate] || []),
        newProductWithId
      ];
    }

    setProductsByDate(updatedProductsByDate);
    setIsModalOpen(false);
  };

  const handleDeleteProduct = (id) => {
    const updatedProducts = {
      ...productsByDate,
      [selectedDate]: productsByDate[selectedDate].filter((product) => product.id !== id)
    };

    // Ajouter l'ID supprimé dans deletedIds
    setDeletedIds([...deletedIds, id]);

    setProductsByDate(updatedProducts);
  };

  const handleDeleteAll = () => {
    const updatedProducts = {
      ...productsByDate,
      [selectedDate]: []
    };
    setProductsByDate(updatedProducts);
    setNextId(1);  // Réinitialiser le compteur d'ID à 1
    setDeletedIds([]); // Réinitialiser la liste des IDs supprimés
  };

  const currentProducts = productsByDate[selectedDate] || [];
  const filteredProducts = currentProducts.filter((product) => {
    if (selectedStatus && product.statut !== selectedStatus) {
      return false;
    }
    return true;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const displayedProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredProducts.length / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPaid = filteredProducts.filter((product) => product.statut === 'Payé')
    .reduce((sum, product) => sum + parseFloat(product.montantTotal), 0);
  const totalRemaining = filteredProducts.filter((product) => product.statut === 'Non payé')
    .reduce((sum, product) => sum + parseFloat(product.montantTotal), 0);
  const total = totalPaid + totalRemaining;

  useEffect(() => {
    // Si le prix unitaire et la quantité sont renseignés, calculer le montant total
    if (newProduct.prixUnitaire && newProduct.quantite) {
      const total = parseFloat(newProduct.prixUnitaire) * parseFloat(newProduct.quantite);
      setNewProduct(prevState => ({
        ...prevState,
        montantTotal: total.toFixed(2) // Format du montant total avec 2 décimales
      }));
    }
  }, [newProduct.prixUnitaire, newProduct.quantite]); // Ce useEffect s'exécute lorsque le prixUnitaire ou la quantité changent

  return (
    <div className="main-container2">
      <div className="header-cl">
        <h3>GESTION DES PRODUITS POUR LE : {formatDate(selectedDate)}</h3>
        <span className="product-count">
          {filteredProducts.length === 0
            ? 'Aucun produit ajouté aujourd\'hui'
            : `Nombre de produits : ${filteredProducts.length}`}
        </span>
      </div>

      <div className="footer-buttons">
        <div className="left-buttons">
          <button className="add-product-btn" onClick={handleAddProductClick}>
            Ajouter un produit
          </button>
          <div className="filter-buttons">
            <div className="filter-status">
              <label htmlFor="filter-select" className="filt">Filtrer par statut :</label>
              <select id="filter-select" value={selectedStatus} onChange={handleStatusChange}>
                <option value="">Tous</option>
                <option value="Non payé">Non payé</option>
                <option value="Payé">Payé</option>
              </select>
            </div>
          </div>
        </div>
        <div className="right-buttons">
          <div className="filter-date">
            <label htmlFor="filter-date" className="filt">Filtrer par date :</label>
            <input
              type="date"
              id="filter-date"
              value={selectedDate}
              onChange={handleFilterDateChange}
              max={currentDate}  // Empêcher la sélection d'une date future
            />
          </div>
          <button onClick={handleDeleteAll} className="delete-all-btn">
            Supprimer tout
          </button>
        </div>

      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCloseModal}>&times;</span>
            <h3>{isEditMode ? 'Modifier un produit' : 'Ajouter un produit'}</h3>
            <form onSubmit={handleSubmit}>
              <label>Nom du produit:</label>
              <input
                type="text"
                name="nom"
                value={newProduct.nom}
                onChange={handleInputChange}
                placeholder='Veuillez entrer le nom du produit'
                required
              />
             <label>Prix unitaire:</label>
             <div className="input-container">
                <input
                  type="text" // Utilisation de "text" pour afficher "DA" à l'intérieur de l'input
                  name="prixUnitaire"
                  placeholder="Veuillez entrer le prix du produit"
                  value={newProduct.prixUnitaire} // Affiche le prix sans "DA" pendant la saisie
                  onChange={handleInputChange} // Gère la modification du prix
                  onBlur={(e) => { // Quand l'utilisateur sort de l'input
                    const value = e.target.value;
                    // Si la valeur n'est pas vide, ajoute " DA" à la fin
                    const valueWithDA = value && !value.includes("DA") ? `${value} DA` : value;
                    setNewProduct({
                      ...newProduct,
                      prixUnitaire: valueWithDA
                    });
                  }}
                  onFocus={(e) => { // Lorsque l'utilisateur clique dans l'input, retirer "DA"
                    if (e.target.value.includes(" DA")) {
                      setNewProduct({
                        ...newProduct,
                        prixUnitaire: e.target.value.replace(" DA", "")
                      });
                    }
                  }}
                  required
                />
              </div>

              <label>Quantité:</label>
              <input
                type="number"
                name="quantite"
                placeholder='Veuillez entrer le nom du produit'
                value={newProduct.quantite}
                onChange={handleInputChange}
                required
              />
              <label>Montant total:</label>
              <input
                type="text" // Change to "text" pour pouvoir afficher " DA"
                name="montantTotal"
                value={`${newProduct.montantTotal} DA`} // Ajoute " DA" à la valeur affichée
                onChange={handleInputChange} // Gère les autres champs normalement
                disabled // Désactive la modification manuelle
                required
              />


              <label>Statut de paiement:</label>
              <select
                name="statut"
                value={newProduct.statut || 'Payé'} 
                onChange={handleInputChange}
                required
              >
                {/* <option value="choisir l'etat"></option> */}
                <option value="Payé">Payé</option>
                <option value="Non payé">Non payé</option>
              </select>
              <div className="modal-buttons">
                <button type="submit">{isEditMode ? 'Modifier' : 'Ajouter'}</button>
                <button type="button" onClick={handleCloseModal}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="balance-line">
        <div className="balance-item">
          <strong>Solde payé :</strong> {totalPaid} DA
        </div>
        <div className="balance-item">
          <strong>Solde restant :</strong> {totalRemaining} DA
        </div>
        <div className="balance-item">
          <strong>Solde total :</strong> {total} DA
        </div>
      </div>

      <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom du produit</th>
              <th>Prix unitaire</th>
              <th>Quantité</th>
              <th>Montant total</th>
              <th>Statut de paiement</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedProducts.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center' }}>Aucun produit trouvé</td>
              </tr>
            ) : (
              displayedProducts.map((product:any) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.nom}</td>
                  <td>{product.prixUnitaire} </td>
                  <td>{product.quantite}</td>
                  <td>{product.montantTotal} DA</td>
                  <td>{product.statut}</td>
                  <td>
                    <FaEdit
                      className="action-icon edit-icon"
                      title="Éditer"
                      onClick={() => handleEditProductClick(product)}
                    />
                    <FaTrash
                      className="action-icon delete-icon"
                      title="Supprimer"
                      onClick={() => handleDeleteProduct(product.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
      </table>

      <div className="pagination">
        <span className="page-info">
        {Math.min(indexOfLastProduct, filteredProducts.length)} sur {filteredProducts.length} produits
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

export default MainProduit;
