import { Product, ProductResponse } from "../types";

const dbmgr = require("./dbManager");
const database = dbmgr.db;

exports.getProducts = (page = 1): Product[] => {
  const limit = 10;
  const offset = (page - 1) * limit;
  const qry = `SELECT * FROM products LIMIT ? OFFSET ?`;
  let stmt = database.prepare(qry);
  let res = stmt.all(limit, offset);
  return res;
};

exports.createProduct = (
  name: string,
  unique_price: number,
  quantity: number,
  total_amount: number,
  status: 'waiting' | 'confirmed'
): ProductResponse => {
  const qry = `
    INSERT INTO products 
    (name, unique_price, quantity, total_amount, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  let stmt = database.prepare(qry);
  let info = stmt.run(
    name,
    unique_price,
    quantity,
    total_amount,
    status
  );
  return { success: true, productId: info.lastInsertRowid };
};

exports.editProduct = (
  id: number,
  name: string,
  unique_price: number,
  quantity: number,
  total_amount: number,
  status: 'waiting' | 'confirmed'
): ProductResponse  => {
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

  let stmt = database.prepare(qry);
  let info = stmt.run(...valuesToUpdate);

  if (info.changes === 0) {
    return {
      success: false,
      message: "Product not found or no changes made",
    };
  }

  return { success: true, message: "Product updated successfully" };
};

exports.deleteProduct = (id: number): ProductResponse  => {
  const qry = `DELETE FROM products WHERE id = ?`;
  let stmt = database.prepare(qry);
  let info = stmt.run(id);
  if (info.changes === 0) {
    return { success: false, message: "Product not found" };
  }
  return { success: true, message: "Product deleted successfully" };
};

exports.deleteAllProducts = (): ProductResponse  => {
  const qry = `DELETE FROM products`;
  let stmt = database.prepare(qry);
  let info = stmt.run();
  return {
    success: true,
    message: `${info.changes} products deleted successfully`,
  };
};
