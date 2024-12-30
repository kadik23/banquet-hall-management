import { Product, ProductResponse } from "../types";
import { db as database } from "./dbManager";

export const getProducts = (): Product[] => {
  const qry = `SELECT * FROM products`;
  const stmt = database.prepare(qry);
  const res = stmt.all() as Product[];
  console.table(res);
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
  date: string
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
    return { success: false, message: "Aucune mise à jour fournie" };
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
      message: "Produit introuvable ou aucune modification effectuée",
    };
  }

  return { success: true, message: "Produit mis à jour avec succès", productId: id };
};

export const deleteProduct = (id: number): ProductResponse => {
  const qry = `DELETE FROM products WHERE id = ?`;
  const stmt = database.prepare(qry);
  const info = stmt.run(id);
  if (info.changes === 0) {
    return { success: false, message: "Produit introuvable" };
  }
  return { success: true, message: "Produit supprimé avec succès" };
};

export const deleteAllProducts = (): ProductResponse => {
  database.prepare("BEGIN TRANSACTION").run();
  try {
    const deleteProductsQuery = `DELETE FROM products`;
    const deleteStmt = database.prepare(deleteProductsQuery);
    const info = deleteStmt.run();
    
    const resetQry = `DELETE FROM sqlite_sequence WHERE name = 'products'`;
    database.prepare(resetQry).run();

    database.prepare("COMMIT").run();
    return {
      success: true,
      message: `${info.changes} produits supprimés avec succès`,
    };
  } catch (error: any) {
    database.prepare("ROLLBACK").run();

    return {
      success: false,
      message: `Erreur lors de la suppression des produits : ${error.message}`,
    };
  }
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

  console.log(`Résultats de recherche pour "${searchTerm}" :`, res);
  return res;
};
