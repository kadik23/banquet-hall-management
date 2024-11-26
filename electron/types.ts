export type ReservationPeriod = "morning" | "evening";

export interface Reservation {
  id: number;
  client_id: number;
  start_date: string;
  period: ReservationPeriod;
  start_hour: string;
  end_hour: string;
  nbr_invites: number;
  date_reservation: string;
}

export interface ReservationResponse {
  success: boolean;
  message?: string;
  reservationId?: number;
}
