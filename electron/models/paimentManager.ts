import { Paiment, PaimentResponse } from "../types";

import { db as database } from "./dbManager";

export const getPaiments = (): Paiment[] => {
  const qry = `
    SELECT p.*, c.name, c.surname 
    FROM payments p
    JOIN clients c ON p.client_id = c.id
  `;
  const stmt = database.prepare(qry);
  const res = stmt.all();
  return res;
};

export const getPaimentsByReservationId = (reservation_id: number) => { 
  console.log(reservation_id)
  const qry =  `
    SELECT p.*, c.name, c.surname 
    FROM payments p
    JOIN clients c ON p.client_id = c.id
    WHERE p.reservation_id = ?
  `;
  const stmt = database.prepare(qry);
  const res = stmt.all(reservation_id);
  console.table(res)
  return res;
}

export const getConfirmedPaimentsCount = () => {
  const qry = `
   SELECT COUNT(*) as count 
   FROM payments
   WHERE status = 'confirmed'
  `;
  const countStmt = database.prepare(qry);
  const countResult = countStmt.get();

  return countResult.count;
};

export const getWaitedPaimentsCount = () => {
  const qry = `
    SELECT COUNT(*) as count 
    FROM payments 
    WHERE status = 'waiting'
  `;
  const countStmt = database.prepare(qry);
  const countResult = countStmt.get();

  return countResult.count;
};

export const createPaiment = (
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

export const editPaiment = (
  id: number,
  client_id: number | null,
  reservation_id: number | null,
  total_amount: number | null,
  amount_paid: number | null,
  remaining_balance: number | null,
  payment_date: string | null,
  status: "waiting" | "confirmed" | null
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
      message: "Payment not found or no changes made",
    };
  }

  return { success: true, message: "Payment updated successfully",  };
};

export const deletePaiment = (id: number): PaimentResponse => {
  const qry = `DELETE FROM payments WHERE id = ?`;
  const stmt = database.prepare(qry);
  const info = stmt.run(id);
  if (info.changes === 0) {
    return { success: false, message: "Payment not found" };
  }
  return { success: true, message: "Payment deleted successfully" };
};

export const deleteAllPaiments = (): PaimentResponse => {
  database.prepare("BEGIN TRANSACTION").run();
  try {
    const deleteQry = `DELETE FROM payments`;
    const deleteStmt = database.prepare(deleteQry);
    const deleteInfo = deleteStmt.run();

    const resetQry = `DELETE FROM sqlite_sequence WHERE name = 'payments'`;
    database.prepare(resetQry).run();

    database.prepare("COMMIT").run();

    return {
      success: true,
      message: `${deleteInfo.changes} payments deleted successfully, and ID reset.`,
    };
  } catch (error: any) {
    database.prepare("ROLLBACK").run();

    return {
      success: false,
      message: `Error deleting payments: ${error.message}`,
    };
  }
};

export const searchPayments = (searchTerm: string) => {
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
    `%${searchTerm}%`
  );

  return res;
};
