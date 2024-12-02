import { Receipt, ReceiptResponse } from "../types";

const dbmgr = require("./dbManager");
const database = dbmgr.db;

exports.getReceipts = (page = 1): Receipt => {
  const limit = 10;
  const offset = (page - 1) * limit;
  const qry = `
    SELECT 
      r.id AS receipt_id,
      c.name,
      c.surname,
      res.date_reservation,
      res.start_date,
      p.status,
      p.total_amount,
      p.amount_paid,
      p.remaining_balance,
      r.pdf_path
    FROM receipts r
    JOIN clients c ON r.client_id = c.id
    JOIN reservations res ON r.reservation_id = res.id
    JOIN payments p ON r.payment_id = p.id
    LIMIT ? OFFSET ?;
  `;
  let stmt = database.prepare(qry);
  let res = stmt.all(limit, offset);
  return res;
};

exports.createReceipt = (
  client_id: number,
  reservation_id: number,
  paiment_id: number,
  pdf_path: string
): ReceiptResponse => {
  const receiptQuery = `
  INSERT INTO receipts 
  (client_id, reservation_id, paiment_id, pdf_path) 
  VALUES (?, ?, ?, ?)
`;
  const receiptStmt = database.prepare(receiptQuery);
  receiptStmt.run(client_id, reservation_id, paiment_id, pdf_path);
  return { success: true, receiptId: receiptStmt.lastInsertRowid };
};

// exports.editProduct = (
//   id: number,
//   name: string,
//   unique_price: number,
//   quantity: number,
//   total_amount: number,
//   status: "waiting" | "confirmed"
// ): ProductResponse => {
//   const updates = {
//     name,
//     unique_price,
//     quantity,
//     total_amount,
//     status,
//   };
//   const keysToUpdate = Object.keys(updates).filter(
//     (key) => updates[key] !== null
//   );
//   const valuesToUpdate = keysToUpdate.map((key) => updates[key]);
//   if (keysToUpdate.length === 0) {
//     return { success: false, message: "No updates provided" };
//   }
//   const setClause = keysToUpdate.map((key) => `${key} = ?`).join(", ");
//   const qry = `
//       UPDATE products
//       SET ${setClause}
//       WHERE id = ?
//     `;
//   valuesToUpdate.push(id);

//   let stmt = database.prepare(qry);
//   let info = stmt.run(...valuesToUpdate);

//   if (info.changes === 0) {
//     return {
//       success: false,
//       message: "Product not found or no changes made",
//     };
//   }

//   return { success: true, message: "Product updated successfully" };
// };

exports.deleteReceipt = (id: number): ReceiptResponse => {
  const qry = `DELETE FROM receipts WHERE id = ?`;
  let stmt = database.prepare(qry);
  let info = stmt.run(id);
  if (info.changes === 0) {
    return { success: false, message: "Receipt not found" };
  }
  return { success: true, message: "Receipt deleted successfully" };
};

exports.deleteAllReceipts = (): ReceiptResponse => {
  const qry = `DELETE FROM receipts`;
  let stmt = database.prepare(qry);
  let info = stmt.run();
  return {
    success: true,
    message: `${info.changes} receipts deleted successfully`,
  };
};

exports.searchReceipts = (searchTerm: string, page = 1) => {
  const limit = 10;
  const offset = (page - 1) * limit;
  const qry = `
    SELECT 
      r.id AS receipt_id,
      c.name,
      c.surname,
      res.date_reservation,
      res.start_date,
      p.status,
      p.total_amount,
      p.amount_paid,
      p.remaining_balance,
      r.pdf_path
    FROM receipts r
    JOIN clients c ON r.client_id = c.id
    JOIN reservations res ON r.reservation_id = res.id
    JOIN payments p ON r.payment_id = p.id
    WHERE 
      c.name LIKE ? OR 
      c.surname LIKE ? OR 
      r.id = CAST(? AS INTEGER) OR 
      r.client_id = CAST(? AS INTEGER) OR 
      r.reservation_id = CAST(? AS INTEGER) OR 
      r.payment_id = CAST(? AS INTEGER) OR 
      res.date_reservation LIKE ? OR 
      res.start_date LIKE ? OR 
      p.status LIKE ? OR 
      p.total_amount = CAST(? AS REAL) OR 
      p.amount_paid = CAST(? AS REAL) OR 
      p.remaining_balance = CAST(? AS REAL) OR 
      r.pdf_path LIKE ?
    LIMIT ? OFFSET ?
  `;
  
  let stmt = database.prepare(qry);
  let res = stmt.all(
    `%${searchTerm}%`,
    `%${searchTerm}%`,
    searchTerm,
    searchTerm,
    searchTerm,
    searchTerm,
    `%${searchTerm}%`,
    `%${searchTerm}%`,
    `%${searchTerm}%`,
    searchTerm,
    searchTerm,
    searchTerm,
    `%${searchTerm}%`,
    limit,
    offset
  );
  
  return res;
};
