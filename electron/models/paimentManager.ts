import { Paiment, PaimentResponse } from "../types";

const dbmgr = require("./dbManager");
const database = dbmgr.db;

exports.getPaiments = (page = 1): Paiment[] => {
  const limit = 10;
  const offset = (page - 1) * limit;
  const qry = `
    SELECT p.*, c.name, c.surname 
    FROM payments p
    JOIN clients c ON p.client_id = c.id
    LIMIT ? OFFSET ?
  `; 
  const stmt = database.prepare(qry);
  const res = stmt.all(limit, offset);
  return res;
};

exports.getConfirmedPaimentsCount = () => {
  const qry = `
   SELECT COUNT(*) as count 
   FROM payments
   WHERE status = 'confirmed'
  `;
  const countStmt = database.prepare(qry);
  const countResult = countStmt.get();

  return countResult.count;
};

exports.getWaitedPaimentsCount = () => {
  const qry = `
    SELECT COUNT(*) as count 
    FROM payments 
    WHERE status = 'waiting'
  `;
  const countStmt = database.prepare(qry);
  const countResult = countStmt.get();

  return countResult.count;
};

exports.createPaiment = (
  client_id: number,
  reservation_id: number,
  total_amount: number,
  amount_paid: number,
  remaining_balance: number,
  payment_date: string,
  status: "waiting" | "confirmed"
): PaimentResponse => {
  const qry = `
    INSERT INTO payments 
    (client_id, reservation_id, total_amount, amount_paid, remaining_balance, payment_date, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const stmt = database.prepare(qry);
  const info = stmt.run(
    client_id,
    reservation_id,
    total_amount,
    amount_paid,
    remaining_balance,
    payment_date,
    status
  );
  return { success: true, paimentId: info.lastInsertRowid };
};

exports.editPaiment = (
  id: number,
  client_id: number | null,
  reservation_id: number| null,
  total_amount: number| null,
  amount_paid: number| null,
  remaining_balance: number| null,
  payment_date: string| null,
  status: "waiting" | "confirmed"| null
): PaimentResponse => {
  const updates = {
    client_id,
    reservation_id,
    total_amount,
    amount_paid,
    remaining_balance,
    payment_date,
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
      UPDATE payments
      SET ${setClause} 
      WHERE id = ?
    `;
  valuesToUpdate.push(id);

  const stmt = database.prepare(qry);
  const info = stmt.run(...valuesToUpdate);

  if (info.changes === 0) {
    return {
      success: false,
      message: "Paiment not found or no changes made",
    };
  }

  return { success: true, message: "Paiment updated successfully" };
};

exports.deletePaiment = (id: number): PaimentResponse => {
  const qry = `DELETE FROM payments WHERE id = ?`;
  const stmt = database.prepare(qry);
  const info = stmt.run(id);
  if (info.changes === 0) {
    return { success: false, message: "Payments not found" };
  }
  return { success: true, message: "Payments deleted successfully" };
};

exports.deleteAllPaiments = (): PaimentResponse => {
  const qry = `DELETE FROM payments`;
  const stmt = database.prepare(qry);
  const info = stmt.run();
  return {
    success: true,
    message: `${info.changes} payments deleted successfully`,
  };
};

exports.searchPayments = (searchTerm: string, page = 1) => {
  const limit = 10;
  const offset = (page - 1) * limit;
  
  const qry = `
    SELECT * FROM payments 
    WHERE 
      id = CAST(? AS INTEGER) OR
      client_id = CAST(? AS INTEGER) OR
      reservation_id = CAST(? AS INTEGER) OR
      total_amount = CAST(? AS INTEGER) OR 
      amount_paid = CAST(? AS INTEGER) OR 
      remaining_balance = CAST(? AS INTEGER) OR 
      payment_date LIKE ? OR
      status LIKE ?
    LIMIT ? OFFSET ?
  `;
  
  const stmt = database.prepare(qry);
  const res = stmt.all(
    searchTerm, 
    searchTerm, 
    searchTerm, 
    searchTerm, 
    searchTerm, 
    searchTerm, 
    `%${searchTerm}%`, 
    `%${searchTerm}%`, 
    limit, 
    offset
  );
  
  return res;
};