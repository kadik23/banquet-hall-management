import { Paiment, PaimentResponse } from "../types";

const dbmgr = require("./dbManager");
const database = dbmgr.db;

exports.getPaiments = (page = 1): Paiment[] => {
  const limit = 10;
  const offset = (page - 1) * limit;
  const qry = `SELECT * FROM paiments LIMIT ? OFFSET ?`;
  let stmt = database.prepare(qry);
  let res = stmt.all(limit, offset);
  return res;
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
    INSERT INTO paiments 
    (client_id, reservation_id, total_amount, amount_paid, remaining_balance, payment_date, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  let stmt = database.prepare(qry);
  let info = stmt.run(
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
  client_id: Number | null,
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
      UPDATE paiments
      SET ${setClause} 
      WHERE id = ?
    `;
  valuesToUpdate.push(id);

  let stmt = database.prepare(qry);
  let info = stmt.run(...valuesToUpdate);

  if (info.changes === 0) {
    return {
      success: false,
      message: "Paiment not found or no changes made",
    };
  }

  return { success: true, message: "Paiment updated successfully" };
};

exports.deletePaiment = (id: number): PaimentResponse => {
  const qry = `DELETE FROM paiments WHERE id = ?`;
  let stmt = database.prepare(qry);
  let info = stmt.run(id);
  if (info.changes === 0) {
    return { success: false, message: "Paiment not found" };
  }
  return { success: true, message: "Paiment deleted successfully" };
};

exports.deleteAllPaiments = (): PaimentResponse => {
  const qry = `DELETE FROM paiments`;
  let stmt = database.prepare(qry);
  let info = stmt.run();
  return {
    success: true,
    message: `${info.changes} paiments deleted successfully`,
  };
};
