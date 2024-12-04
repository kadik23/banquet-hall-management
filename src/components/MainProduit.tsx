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

    // Charger les produits depuis le stockage local avec des dates exemples
    const storedProducts = JSON.parse(localStorage.getItem('productsByDate')) || {};
    setProductsByDate(storedProducts);
  }, []);

  useEffect(() => {
    localStorage.setItem('productsByDate', JSON.stringify(productsByDate));
  }, [productsByDate]);

  // Ajout des produits d'exemple pour des dates passées
  const addExampleProducts = () => {
    const exampleProducts = {
      [currentDate]: [],
      ['2024-11-25']: [
        {
          id: 1,
          nom: 'Produit Exemple 1',
          prixUnitaire: '100',
          quantite: '5',
          montantTotal: '500',
          statut: 'Payé',
          date: '2024-11-25'
        },
        {
          id: 2,
          nom: 'Produit Exemple 2',
          prixUnitaire: '200',
          quantite: '3',
          montantTotal: '600',
          statut: 'Non payé',
          date: '2024-11-25'
        }
      ],
      ['2024-11-20']: [
        {
          id: 3,
          nom: 'Produit Exemple 3',
          prixUnitaire: '150',
          quantite: '10',
          montantTotal: '1500',
          statut: 'Payé',
          date: '2024-11-20'
        }
      ],
      ['2024-11-29']: [
        {
          id: 4,
          nom: 'Produit Exemple 3',
          prixUnitaire: '150',
          quantite: '10',
          montantTotal: '1500',
          statut: 'Payé',
          date: '2024-11-29'
        }
      ]
    };

    // Fusionner les produits d'exemple avec les produits stockés
    const mergedProducts = { ...exampleProducts, ...productsByDate };
    setProductsByDate(mergedProducts);
  };

  useEffect(() => {
    addExampleProducts();
  }, []);

  // Fonction pour formater la date en format européen
  const formatDate = (date:Date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('fr-FR'); // Format jour/mois/année
  };

  const handleFilterDateChange = (e:any) => {
    setSelectedDate(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e:any) => {
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
      statut: '',
      date: currentDate
    });
    setIsModalOpen(true);
  };

  const handleEditProductClick = (product:any) => {
    setIsEditMode(true);
    setNewProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    const newProductWithId = { ...newProduct, id: Date.now() };
    const updatedProducts = {
      ...productsByDate,
      [currentDate]: [...(productsByDate[currentDate] || []), newProductWithId]
    };
    setProductsByDate(updatedProducts);
    setIsModalOpen(false);
  };

  const handleDeleteProduct = (id:any) => {
    const updatedProducts = {
      ...productsByDate,
      [selectedDate]: productsByDate[selectedDate].filter(product => product.id !== id)
    };
    setProductsByDate(updatedProducts);
  };

  const handleDeleteAll = () => {
    const updatedProducts = {
      ...productsByDate,
      [selectedDate]: []
    };
    setProductsByDate(updatedProducts);
  };

  const currentProducts = productsByDate[selectedDate] || [];
  const filteredProducts = currentProducts.filter((product:any) => {
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

  const paginate = (pageNumber:number) => setCurrentPage(pageNumber);

  // Calcul des soldes
  const totalPaid = filteredProducts.filter((product:any) => product.statut === 'Payé')
    .reduce((sum:any, product:any) => sum + parseFloat(product.montantTotal), 0);
  const totalRemaining = filteredProducts.filter((product:any) => product.statut === 'Non payé')
    .reduce((sum:any, product:any) => sum + parseFloat(product.montantTotal), 0);
  const total = totalPaid + totalRemaining;

  return (
    <div className="main-container2">
      <div className="header-cl">
        <h3>GESTION DES PRODUITS POUR LE :&nbsp;&nbsp; {formatDate(selectedDate)}</h3>
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
            />
          </div>
          <button className="delete-all-btn" onClick={handleDeleteAll}>
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
                required
              />
              <label>Prix unitaire:</label>
              <input
                type="number"
                name="prixUnitaire"
                value={newProduct.prixUnitaire}
                onChange={handleInputChange}
                required
              />
              <label>Quantité:</label>
              <input
                type="number"
                name="quantite"
                value={newProduct.quantite}
                onChange={handleInputChange}
                required
              />
              <label>Montant total:</label>
              <input
                type="number"
                name="montantTotal"
                value={newProduct.montantTotal}
                onChange={handleInputChange}
                required
              />
              <label>Statut de paiement:</label>
              <input
                type="text"
                name="statut"
                value={newProduct.statut}
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

       {/* Ligne de solde */}
       <div className="balance-line">
        <div className="balance-item">
          <strong>Solde payé :</strong> {totalPaid} DA
        </div>
        <div className="balance-item">
          <strong>Solde restant :</strong> {totalRemaining} DA
        </div>
        <div className="balance-item">
          <strong>Total :</strong> {total} DA
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
                <td>{product.prixUnitaire}</td>
                <td>{product.quantite}</td>
                <td>{product.montantTotal}</td>
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
