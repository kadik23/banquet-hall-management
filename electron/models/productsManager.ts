import { Product, ProductResponse } from "../types";

import {db as database} from "./dbManager";

export const getProducts = (): Product[] => {
  const qry = `SELECT * FROM products`;
  const stmt = database.prepare(qry);
  const res = stmt.all() as Product[];
  return res;
};

export const getPaidProductsCount = () => {
  const qry = `
   SELECT COUNT(*) as count 
   FROM products 
   WHERE status = 'paid'
  `;
  const countStmt = database.prepare(qry);
  const countResult = countStmt.get();

  return countResult.count;
};

export const getNotPaidProductsCount = () => {
  const qry = `
  SELECT COUNT(*) as count 
  FROM products 
  WHERE status = 'not-paid'
 `;
  const countStmt = database.prepare(qry);
  const countResult = countStmt.get();

  return countResult.count;
};

export const getTotalAmount = () => {
  const qry = `
    SELECT SUM(total_amount) as total 
    FROM products 
  `;
  const stmt = database.prepare(qry);
  const result = stmt.get();
  return result.total || 0;
};

export const createProduct = (
  name: string,
  unique_price: number,
  quantity: number,
  total_amount: number,
  status: "paid" | "not-paid",
  date:string,
): ProductResponse => {
  const qry = `
    INSERT INTO products 
    (name, unique_price, quantity, total_amount, status, date) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const stmt = database.prepare(qry);
  const info = stmt.run(name, unique_price, quantity, total_amount, status, date);
  return { success: true, productId: info.lastInsertRowid };
};

export const editProduct = (
  id: number,
  name: string,
  unique_price: number,
  quantity: number,
  total_amount: number,
  status: "paid" | "not-paid"
): ProductResponse => {
  const updates = {
    name,
    unique_price,
    quantity,
    total_amount,
    status,
  };
  const keysToUpdate = Object.keys(updates).filter(
    (key) => updates[key] !== null
  );
  const valuesToUpdate = keysToUpdate.map((key) => updates[key]);
  if (keysToUpdate.length === 0) {
    return { success: false, message: "No updates provided" };
  }
  const setClause = keysToUpdate.map((key) => `${key} = ?`).join(", ");
  const qry = `
      UPDATE products 
      SET ${setClause} 
      WHERE id = ?
    `;
  valuesToUpdate.push(id);

  const stmt = database.prepare(qry);
  const info = stmt.run(...valuesToUpdate);

  if (info.changes === 0) {
    return {
      success: false,
      message: "Product not found or no changes made",
    };
  }

  return { success: true, message: "Product updated successfully",productId: id  };
};

export const deleteProduct = (id: number): ProductResponse => {
  const qry = `DELETE FROM products WHERE id = ?`;
  const stmt = database.prepare(qry);
  const info = stmt.run(id);
  if (info.changes === 0) {
    return { success: false, message: "Product not found" };
  }
  return { success: true, message: "Product deleted successfully" };
};

export const deleteAllProducts = (): ProductResponse => {
  const qry = `DELETE FROM products`;
  const stmt = database.prepare(qry);
  const info = stmt.run();
  return {
    success: true,
    message: `${info.changes} products deleted successfully`,
  };
};

export const searchProducts = (searchTerm: string) => {
  const qry = `
    SELECT * FROM products 
    WHERE 
      id = CAST(? AS INTEGER) OR
      name LIKE ? OR
      unique_price = CAST(? AS INTEGER) OR
      quantity = CAST(? AS INTEGER) OR
      total_amount = CAST(? AS INTEGER) OR
      status LIKE ? OR
      date LIKE ?
  `;

  const stmt = database.prepare(qry);
  const res = stmt.all(
    searchTerm,
    `%${searchTerm}%`,
    searchTerm,
    searchTerm,
    searchTerm,
    `%${searchTerm}%`,
    `%${searchTerm}%`
  );

  return res;
};
