import * as productMgr from "../models/productsManager";

export const getProducts = (page = 1) => {
  return productMgr.getProducts(page);
};

export const getPaidProductsCount = () => {
  return productMgr.getPaidProductsCount();
};

export const getNotPaidProductsCount = () => {
  return productMgr.getNotPaidProductsCount();
};

export const getTotalAmount = () => {
  return productMgr.getTotalAmount();
};

export const createProduct = (
  name: string,
  unique_price: number,
  quantity: number,
  total_amount: number,
  status: 'paid' | 'not-paid'
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
  status: 'paid' | 'not-paid'
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

export const deleteProduct = (id: number) => {
  return productMgr.deleteProduct(id);
};

export const deleteAllProducts = () => {
  return productMgr.deleteAllProducts();
};

export const searchProducts = (searchItem: string, page = 1) => {
  return productMgr.searchProducts(searchItem, page);
};
