import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import '../App.css';

function MainProduit({searchTerm}:{searchTerm:string}) {
  const [productsByDate, setProductsByDate] = useState<Product[]>([]);
  const [currentDate, setCurrentDate] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newProduct, setNewProduct] = useState<Product>({
    name: '',
    unique_price: null,
    quantity: null,
    total_amount: null,
    status: 'not-paid',
    date: currentDate
  });
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;


 

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setCurrentDate(today);
    setSelectedDate(today);
    const fetchProducts = async () => {
      try {
        const data: Product[] = await window.sqliteProduct.getProducts();
        setProductsByDate(data);
        console.log(data)
      } catch (err) {
        alert(`Error: ${err}`);
      }
    };

    fetchProducts();
  }, []);  

  const formatDate = (date:string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('fr-FR');
  };

  const handleFilterDateChange = (e:any) => {
    const selected = e.target.value;
    if (selected <= currentDate) {
      setSelectedDate(selected);
      setCurrentPage(1);  // Réinitialiser la page quand une nouvelle date est sélectionnée
    } else {
      alert("Vous ne pouvez pas sélectionner une date future !");
    }
  };
  

  const handleStatusChange = (e:any) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleAddProductClick = () => {
    setIsEditMode(false);
    setNewProduct({
      name: '',
      unique_price: null,
      quantity: null,
      total_amount: null,
      status: 'not-paid',
      date: '' // Initialise avec une valeur vide ou une autre valeur par défaut si nécessaire
    });
    setIsModalOpen(true);
  };
  

  const handleEditProductClick = (product: Product) => {
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

  const resetFormState = () => {
    setNewProduct({
      name: '',
      unique_price: 0,
      quantity: 0,
      total_amount: 0,
      status: 'not-paid',
      date: ''
    });
    localStorage.removeItem('newClient');
    setIsModalOpen(false);
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
  
    let updatedProducts = [...productsByDate];
    try {

      if (isEditMode) {
        // Edit an existing product
        const data = await window.sqliteProduct.editProduct(newProduct.id as number, newProduct.name, newProduct.unique_price, newProduct.quantity, newProduct.total_amount, newProduct.status);
          updatedProducts = updatedProducts.map((product: Product) =>
            product.id === newProduct.id ? newProduct : product
        );
        window.alert(`Product ${data.productId} was edited successfully`);
      } else {
        // Add a new product
        const data = await window.sqliteProduct.createProduct(newProduct.name, newProduct.unique_price, newProduct.quantity, newProduct.total_amount, newProduct.status, newProduct.date);
        console.log(data)
        updatedProducts.push(newProduct);
        updatedProducts = [...currentProducts, { ...newProduct, id: data.productId }];
        window.alert(`Product ${data.productId} was created successfully`);
      }
      window.electron.fixFocus();
      setProductsByDate(updatedProducts);
      resetFormState();
    } catch (error) {
      console.error("Error while submitting product:", error);
      window.alert("An error occurred while processing the request.");
    }
  }

  const handleDeleteProduct = async(id:number) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?");
    if (confirmDelete) {
      try {
        const data = await window.sqliteProduct.deleteProduct(id);
        window.alert(data.message)
        const updatedProducts = productsByDate.filter(
          (product) => product.id !== id || product.date !== selectedDate
        );
        setProductsByDate(updatedProducts);
      } catch (e) {
        console.error(e);
      }
    }
    window.electron.fixFocus();
  };

  const handleDeleteAll = async() => {
    const confirmDeleteAll = window.confirm("Êtes-vous sûr de vouloir supprimer tous les produits ?");
    if (confirmDeleteAll) {
      try{
        const data = await window.sqliteProduct.deleteAllProducts();
        // const updatedProducts = {
        //   ...productsByDate,
        //   [selectedDate]: []
        // };
        window.alert(data.message)

        setProductsByDate([]);
      }catch(e){
        console.log(e)
      }
    }
    window.electron.fixFocus();
  };

  const currentProducts = productsByDate.filter(
    (product) => product.date === selectedDate
  );
  const filteredProducts = currentProducts.filter((product: Product) => {
    const matchesSearchTerm = [product.name, product.quantity, product.total_amount, product.unique_price]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  
    const matchesStatus = !selectedStatus || product.status === selectedStatus;
  
    return matchesSearchTerm && matchesStatus;
  });
  

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const displayedProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredProducts.length / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber:number) => setCurrentPage(pageNumber);

  const totalPaid = filteredProducts.filter((product:Product) => product.status === 'paid')
    .reduce((sum:number, product:Product) => sum + parseFloat(product.total_amount.toString()), 0);
  const totalRemaining = filteredProducts.filter((product:Product) => product.status === 'not-paid')
    .reduce((sum:number, product:Product) => sum + parseFloat(product.total_amount.toString()), 0);
  const total = totalPaid + totalRemaining;

  useEffect(() => {
    // Si le prix unitaire et la quantité sont renseignés, calculer le montant total
    if (newProduct.unique_price && newProduct.quantity) {
      const total = parseFloat(newProduct.unique_price.toString()) * parseFloat(newProduct.quantity.toString());
      setNewProduct(prevState => ({
        ...prevState,
        total_amount: parseInt(total.toFixed(2)) // Format du montant total avec 2 décimales
      }));
    }
  }, [newProduct.unique_price, newProduct.quantity]); // Ce useEffect s'exécute lorsque le prixUnitaire ou la quantité changent

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
                <option value="not-paid">Non payé</option>
                <option value="paid">Payé</option>
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
          name="name"
          value={newProduct.name}
          onChange={handleInputChange}
          placeholder='Veuillez entrer le nom du produit'
          required
        />
        <label>Prix unitaire:</label>
        <div className="input-container">
          <input
            type="text"
            name="unique_price"
            placeholder="Veuillez entrer le prix du produit"
            value={newProduct.unique_price}
            onChange={handleInputChange}
            onBlur={(e) => {
              const value = e.target.value;
              const valueWithDA = value && !value.includes("DA") ? `${value} DA` : value;
              setNewProduct({
                ...newProduct,
                unique_price: parseFloat(value)
              });
            }}
            onFocus={(e) => {
              if (e.target.value.includes(" DA")) {
                setNewProduct({
                  ...newProduct,
                  unique_price: parseFloat(e.target.value.replace(" DA", ""))
                });
              }
            }}
            required
          />
        </div>

        <label>Quantité:</label>
        <input
          type="number"
          name="quantity"
          placeholder='Veuillez entrer la quantité du produit'
          value={newProduct.quantity}
          onChange={handleInputChange}
          required
        />

        <label>Montant total:</label>
        <input
          type="text"
          name="total_amount"
          placeholder="Montant total"
          value={newProduct.total_amount ? `${newProduct.total_amount} DA` : ''} // Affiche la valeur si elle existe, sinon laisse vide
          onChange={handleInputChange}
          disabled
          required
        />


        <label>Statut de paiement:</label>
        <select
          name="status"
          value={newProduct.status || 'paid'}
          onChange={handleInputChange}
          required
        >
          <option value="paid">Payé</option>
          <option value="not-paid">Non payé</option>
        </select>

        {/* Nouveau champ de date d'ajout */}
        <label>Date d'ajout:</label>
        <input
          type="date"
          name="date"
          value={newProduct.date}
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
              {/* <th>ID</th> */}
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
              displayedProducts.map((product:Product) => (
                <tr key={product.id}>
                  {/* <td>{product.id}</td> */}
                  <td>{product.name}</td>
                  <td>{product.unique_price} </td>
                  <td>{product.quantity}</td>
                  <td>{product.total_amount} DA</td>
                  <td>{product.status=='not-paid' ?'Not payé':'Payé'}</td>
                  <td>
                    <FaEdit
                      className="action-icon edit-icon"
                      title="Éditer"
                      onClick={() => handleEditProductClick(product)}
                    />
                    <FaTrash
                      className="action-icon delete-icon"
                      title="Supprimer"
                      onClick={() => handleDeleteProduct(product.id as number)}
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