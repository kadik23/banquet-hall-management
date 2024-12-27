import { Reservation, ReservationResponse } from "../types";

import { db as database } from "./dbManager";

export const getReservations = (): Reservation[] => {
  const qry = `
    SELECT r.*, c.name, c.surname 
    FROM reservations r
    JOIN clients c ON r.client_id = c.id
  `;
  const stmt = database.prepare(qry);
  const res = stmt.all() as Reservation[];
  return res;
};

export const getReservationsByClientId = (client_id: number): Reservation[] => {
  const qry = `
    SELECT r.*, c.name, c.surname 
    FROM reservations r
    JOIN clients c ON r.client_id = c.id
    WHERE r.client_id = ?;
  `;
  const stmt = database.prepare(qry);
  const res = stmt.all(client_id) as Reservation[];
  return res;
};

export const createReservation = (
  client_id: number,
  start_date: string,
  period: "morning" | "evening",
  start_hour: string,
  end_hour: string,
  nbr_invites: number,
  date_reservation: string
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
  } catch (error: any) {
    return {
      success: false,
      message: `Error creating reservation and receipt: ${error.message}`,
    };
  }
};

export const editReservation = (
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

export const deleteReservation = (id: number): ReservationResponse => {
  database.prepare("BEGIN TRANSACTION").run();

  try {
    database.prepare(`DELETE FROM receipts WHERE reservation_id = ?`).run(id);
    database.prepare(`DELETE FROM payments WHERE reservation_id = ?`).run(id);
    const qry = `DELETE FROM reservations WHERE id = ?`;
    const stmt = database.prepare(qry);
    const info = stmt.run(id);
    if (info.changes === 0) {
      database.prepare("ROLLBACK").run();
      return { success: false, message: "Reservation not found" };
    }
    database.prepare("COMMIT").run();

    return { success: true, message: "Reservation deleted successfully" };
  } catch (error: any) {
    database.prepare("ROLLBACK").run();
    return {
      success: false,
      message: `Error deleting client: ${error.message}`,
    };
  }
};

export const deleteAllReservations = (): ReservationResponse => {
  database.prepare("BEGIN TRANSACTION").run();

  try {
    database.prepare(`DELETE FROM receipts`).run();
    database.prepare(`DELETE FROM payments`).run();
    const deleteQry = `DELETE FROM reservations`;
    const deleteStmt = database.prepare(deleteQry);
    const deleteInfo = deleteStmt.run();

    const resetQry = `DELETE FROM sqlite_sequence WHERE name = 'reservations'`;
    database.prepare(resetQry).run();

    database.prepare("COMMIT").run();

    return {
      success: true,
      message: `${deleteInfo.changes} reservations deleted successfully, and ID reset.`,
    };
  } catch (error: any) {
    database.prepare("ROLLBACK").run();

    return {
      success: false,
      message: `Error deleting reservations: ${error.message}`,
    };
  }
};

export const searchReservations = (searchTerm: string) => {
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
    `%${searchTerm}%`
  );

  return res;
};
