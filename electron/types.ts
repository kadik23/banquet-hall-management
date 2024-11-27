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

export interface PaimentResponse {
    success: boolean;
    message?: string;
    paimentId?: number;
}

export interface Paiment{
    id:number;
    client_id: number;
    reservation_id: number;
    total_amount: number;
    amount_paid: number;
    remaining_balance: number;
    payment_date: string;
    status: 'waiting' | 'confirmed';
}