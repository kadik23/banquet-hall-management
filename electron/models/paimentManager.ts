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
  console.log(`ID de réservation : ${reservation_id}`);
  const qry =  `
    SELECT p.*, c.name, c.surname 
    FROM payments p
    JOIN clients c ON p.client_id = c.id
    WHERE p.reservation_id = ?
  `;
  const stmt = database.prepare(qry);
  const res = stmt.all(reservation_id);
  console.table(res);
  return res;
};

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
  try {
    database.prepare("BEGIN TRANSACTION").run();

    const checkQry = `
      SELECT COUNT(*) as count 
      FROM payments 
      WHERE client_id = ? AND reservation_id = ?
    `;
    const checkStmt = database.prepare(checkQry);
    const { count } = checkStmt.get(client_id, reservation_id);

    if (count > 0) {
      database.prepare("ROLLBACK").run();
      return {
        success: false,
        message: "Un paiement existe déjà pour ce client et cette réservation.",
      };
    }

    const insertQry = `
      INSERT INTO payments 
      (client_id, reservation_id, total_amount, amount_paid, remaining_balance, payment_date, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const insertStmt = database.prepare(insertQry);
    const info = insertStmt.run(
      client_id,
      reservation_id,
      total_amount,
      amount_paid,
      remaining_balance,
      payment_date,
      status
    );

    database.prepare("COMMIT").run();

    return { success: true, paimentId: info.lastInsertRowid };
  } catch (error: any) {
    database.prepare("ROLLBACK").run();
    return {
      success: false,
      message: `Erreur lors de la création du paiement : ${error.message}`,
    };
  }
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
    return { success: false, message: "Aucune mise à jour fournie" };
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
      message: "Paiement introuvable ou aucune modification effectuée",
    };
  }

  return { success: true, message: "Paiement mis à jour avec succès" };
};

export const deletePaiment = (id: number): PaimentResponse => {
  database.prepare("BEGIN TRANSACTION").run();
  try {
    database.prepare(`DELETE FROM receipts WHERE payment_id = ?`).run(id);

    const qry = `DELETE FROM payments WHERE id = ?`;
    const stmt = database.prepare(qry);
    const info = stmt.run(id);
    if (info.changes === 0) {
      return { success: false, message: "Paiement introuvable" };
    }
    database.prepare("COMMIT").run();

    return { success: true, message: "Paiement supprimé avec succès" };

  } catch (error: any) {
    database.prepare("ROLLBACK").run();

    return {
      success: false,
      message: `Erreur lors de la suppression du paiement : ${error.message}`,
    };
  }
};

export const deleteAllPaiments = (): PaimentResponse => {
  database.prepare("BEGIN TRANSACTION").run();
  try {
    database.prepare(`DELETE FROM receipts`).run();

    const deleteQry = `DELETE FROM payments`;
    const deleteStmt = database.prepare(deleteQry);
    const deleteInfo = deleteStmt.run();

    const resetQry = `DELETE FROM sqlite_sequence WHERE name = 'payments'`;
    database.prepare(resetQry).run();

    database.prepare("COMMIT").run();

    return {
      success: true,
      message: `${deleteInfo.changes} paiements supprimés avec succès et ID réinitialisé.`,
    };
  } catch (error: any) {
    database.prepare("ROLLBACK").run();

    return {
      success: false,
      message: `Erreur lors de la suppression des paiements : ${error.message}`,
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

  console.log(`Résultats de recherche pour "${searchTerm}" :`, res);
  return res;
};
