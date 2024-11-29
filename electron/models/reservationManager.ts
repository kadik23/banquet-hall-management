import { Reservation, ReservationResponse } from "../types";

const dbmgr = require("./dbManager");
const database = dbmgr.db;

exports.getReservations = (page = 1): Reservation[] => {
  const limit = 10;
  const offset = (page - 1) * limit;
  const qry = `SELECT * FROM reservations LIMIT ? OFFSET ?`;
  let stmt = database.prepare(qry);
  let res = stmt.all(limit, offset);
  return res;
};

exports.createReservation = (
  client_id: number,
  start_date: string,
  period: "morning" | "evening",
  start_hour: string,
  end_hour: string,
  nbr_invites: number,
  date_reservation: string,
  pdf_path: string
): { success: boolean; reservationId?: number; message?: string } => {
  try {
    let reservationId: number | undefined;

    database.transaction(() => {
      const reservationQuery = `
        INSERT INTO reservations 
        (client_id, start_date, period, start_hour, end_hour, nbr_invites, date_reservation) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const reservationStmt = database.prepare(reservationQuery);
      const reservationInfo = reservationStmt.run(
        client_id,
        start_date,
        period,
        start_hour,
        end_hour,
        nbr_invites,
        date_reservation
      );

      reservationId = reservationInfo.lastInsertRowid;

      const receiptQuery = `
        INSERT INTO receipts 
        (client_id, reservation_id, pdf_path) 
        VALUES (?, ?, ?)
      `;
      const receiptStmt = database.prepare(receiptQuery);
      receiptStmt.run(client_id, reservationId, pdf_path);

    })();

    return {
      success: true,
      reservationId,
      message: "Reservation and receipt created successfully.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Error creating reservation and receipt: ${error.message}`,
    };
  }
};

exports.editReservation = (
  id: number,
  client_id: Number | null,
  start_date: string | null,
  period: "morning" | "evening" | null,
  start_hour: string | null,
  end_hour: string | null,
  nbr_invites: number | null,
  date_reservation: string | null
): ReservationResponse => {
  const updates = {
    client_id,
    start_date,
    period,
    start_hour,
    end_hour,
    nbr_invites,
    date_reservation,
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
      UPDATE reservations 
      SET ${setClause} 
      WHERE id = ?
    `;
  valuesToUpdate.push(id);

  let stmt = database.prepare(qry);
  let info = stmt.run(...valuesToUpdate);

  if (info.changes === 0) {
    return {
      success: false,
      message: "Reservation not found or no changes made",
    };
  }

  return { success: true, message: "Reservation updated successfully" };
};

exports.deleteReservation = (id: number): ReservationResponse => {
  const qry = `DELETE FROM reservations WHERE id = ?`;
  let stmt = database.prepare(qry);
  let info = stmt.run(id);
  if (info.changes === 0) {
    return { success: false, message: "Reservation not found" };
  }
  return { success: true, message: "Reservation deleted successfully" };
};

exports.deleteAllReservations = (): ReservationResponse => {
  const qry = `DELETE FROM reservations`;
  let stmt = database.prepare(qry);
  let info = stmt.run();
  return {
    success: true,
    message: `${info.changes} reservations deleted successfully`,
  };
};
