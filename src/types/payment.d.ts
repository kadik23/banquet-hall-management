interface Payment{
    id?:number;
    client_id: number;
    reservation_id: number;
    total_amount: number;
    amount_paid: number;
    remaining_balance: number;
    payment_date: string;
    status: 'waiting' | 'confirmed';
}