interface Receipt {
    id?: number
    client_id: number;
    reservation_id: number;
    paiment_id: number;
    reservation_date: string;
    name: string;
    surname: string;
    start_date: string;
    total_amount?: number;
    status?: string;
    amount_paid: number;
    remaining_balance: number;
}