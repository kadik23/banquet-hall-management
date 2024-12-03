import { Reservation, ReservationResponse } from "../types";

const dbmgr = require("./dbManager");
const database = dbmgr.db;

exports.getReservations = (page = 1): Reservation[] => {
  const limit = 10;
  const offset = (page - 1) * limit;
  const qry = `
    SELECT r.*, c.name, c.surname 
    FROM reservations r
    JOIN clients c ON r.client_id = c.id
    LIMIT ? OFFSET ?
  `;
  const stmt = database.prepare(qry);
  const res = stmt.all(limit, offset);
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
): { success: boolean; reservationId?: number; message?: string } => {
  try {
    let reservationId: number | undefined;

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

      // eslint-disable-next-line prefer-const
      reservationId = reservationInfo.lastInsertRowid;
      
    return {
      success: true,
      reservationId,
      message: "Reservation created successfully.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: `Error creating reservation and receipt: ${error.message}`,
    };
  }
};

exports.editReservation = (
  id: number,
  client_id: number | null,
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

  const stmt = database.prepare(qry);
  const info = stmt.run(...valuesToUpdate);

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
  const stmt = database.prepare(qry);
  const info = stmt.run(id);
  if (info.changes === 0) {
    return { success: false, message: "Reservation not found" };
  }
  return { success: true, message: "Reservation deleted successfully" };
};

exports.deleteAllReservations = (): ReservationResponse => {
  const qry = `DELETE FROM reservations`;
  const stmt = database.prepare(qry);
  const info = stmt.run();
  return {
    success: true,
    message: `${info.changes} reservations deleted successfully`,
  };
};

exports.searchReservations = (searchTerm: string, page = 1) => {
  const limit = 10;
  const offset = (page - 1) * limit;
  
  const qry = `
    SELECT * FROM reservations 
    WHERE 
      id = CAST(? AS INTEGER) OR
      client_id = CAST(? AS INTEGER) OR
      start_date LIKE ? OR
      period LIKE ? OR 
      start_hour LIKE ? OR 
      end_hour LIKE ? OR
      nbr_invites = CAST(? AS INTEGER) OR
      date_reservation LIKE ?
    LIMIT ? OFFSET ?
  `;
  
  const stmt = database.prepare(qry);
  const res = stmt.all(
    searchTerm, 
    searchTerm, 
    `%${searchTerm}%`, 
    `%${searchTerm}%`, 
    `%${searchTerm}%`, 
    `%${searchTerm}%`,
    searchTerm,
    `%${searchTerm}%`,
    limit, 
    offset
  );
  
  return res;
};