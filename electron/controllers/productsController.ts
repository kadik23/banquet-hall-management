const productMgr = require("../models/productsManager");

export const getProducts = (page = 1) => {
  return productMgr.getProducts(page);
};

export const createProduct = (
  name: string,
  unique_price: number,
  quantity: number,
  total_amount: number,
  status: "waiting" | "confirmed"
) => {
  if (!name || !unique_price || !quantity || !total_amount || !status) {
    return { success: false, message: "missing required data" };
  }
  return productMgr.createProduct(
    name,
    unique_price,
    quantity,
    total_amount,
    status
  );
};

export const editProduct = (
  id: number,
  name: string,
  unique_price: number,
  quantity: number,
  total_amount: number,
  status: "waiting" | "confirmed"
) => {
  return productMgr.editProduct(
    id,
    name,
    unique_price,
    quantity,
    total_amount,
    status
  );
};

export const deleteProduct = (id: string) => {
  return productMgr.deleteProduct(id);
};

export const deleteAllProducts = () => {
  return productMgr.deleteAllProducts();
};

export const searchProducts = (searchItem: string, page = 1) => {
  return productMgr.searchProducts(searchItem, page);
};
