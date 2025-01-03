import * as reservationMgr from "../models/reservationManager";

export const getReservations = () => {
  return reservationMgr.getReservations();
};

export const getReservationsByClientId = (client_id: number) => {
  return reservationMgr.getReservationsByClientId(client_id);
};

export const createReservation = (
  client_id: number,
  start_date: string,
  period: "morning" | "evening",
  start_hour: string,
  end_hour: string,
  nbr_invites: number,
  date_reservation: string,
) => {
  if (
    !client_id ||
    !start_date ||
    !period ||
    !start_date ||
    !end_hour ||
    !nbr_invites ||
    !date_reservation
  ) {
    return { success: false, message: "missing required data" };
  }
  return reservationMgr.createReservation(
    client_id,
    start_date,
    period,
    start_hour,
    end_hour,
    nbr_invites,
    date_reservation,
  );
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
) => {
  return reservationMgr.editReservation(
    id,
    client_id,
    start_date,
    period,
    start_hour,
    end_hour,
    nbr_invites,
    date_reservation
  );
};

export const deleteReservation = (id: number) => {
  return reservationMgr.deleteReservation(id);
};

export const deleteAllReservations = () => {
  return reservationMgr.deleteAllReservations();
};

export const searchReservations = (searchItem: string) => {
  return reservationMgr.searchReservations(searchItem);
};