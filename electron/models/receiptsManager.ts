import { Receipt, ReceiptResponse } from "../types";

import {db as database} from "./dbManager";

export const getReceipts = (): Receipt[] => {
  const qry = `
    SELECT 
      r.id,
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
    JOIN payments p ON r.payment_id = p.id;
  `;
  let stmt = database.prepare(qry);
  let res = stmt.all() as Receipt[];
  return res;
};

export const createReceipt = (
  client_id: number,
  reservation_id: number,
  paiment_id: number,
  pdf_path: string
): ReceiptResponse => {
  const receiptQuery = `
  INSERT INTO receipts 
  (client_id, reservation_id, payment_id, pdf_path) 
  VALUES (?, ?, ?, ?)
`;
  const receiptStmt = database.prepare(receiptQuery);
  const info = receiptStmt.run(client_id, reservation_id, paiment_id, pdf_path);
  const receiptId = info.lastInsertRowid;

  const fetchQuery = `
    SELECT 
      r.id,
      c.name,
      c.surname,
      res.date_reservation,
      res.start_date,
      p.status,
      p.total_amount,
      p.amount_paid,
      p.remaining_balance
    FROM receipts r
    JOIN clients c ON r.client_id = c.id
    JOIN reservations res ON r.reservation_id = res.id
    JOIN payments p ON r.payment_id = p.id
    WHERE r.id = ?;
  `;
  const fetchStmt = database.prepare(fetchQuery);
  const receipt = fetchStmt.get(receiptId);
  return { success: true, receipt};
};

export const deleteReceipt = (id: number): ReceiptResponse => {
  const qry = `DELETE FROM receipts WHERE id = ?`;
  let stmt = database.prepare(qry);
  let info = stmt.run(id);
  if (info.changes === 0) {
    return { success: false, message: "Receipt not found" };
  }
  return { success: true, message: "Receipt deleted successfully" };
};

export const deleteAllReceipts = (): ReceiptResponse => {
  const qry = `DELETE FROM receipts`;
  let stmt = database.prepare(qry);
  let info = stmt.run();
  return {
    success: true,
    message: `${info.changes} receipts deleted successfully`,
  };
};

export const searchReceipts = (searchTerm: string, page = 1) => {
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
