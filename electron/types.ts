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

export interface ProductResponse {
  success: boolean;
  message?: string;
  productId?: number;
}

export type Product = {
  id?: number;
  name: string;
  unique_price: number,
  quantity: number,
  total_amount: number,
  status: 'paid' | 'not-paid',
  date: string
};

export interface Receipt{
  id:number;
  name: string;
  surname: string;
  date_reservation: string;
  payment_date: string;
  total_amount: number;
  amount_paid: number;
  remaining_balance: number;
  pdf_path: number
  status: 'waiting' | 'confirmed';
}

export interface ReceiptResponse {
  success: boolean;
  message?: string;
  receiptId?: number;
  receipt?: Receipt
}