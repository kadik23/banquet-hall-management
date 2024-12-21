interface Reservation {
    id?: number;
    client_id: number;
    name?:string;
    surname?: string;
    start_date: string;
    period: "morning" | "evening";
    start_hour: string;
    end_hour: string;
    nbr_invites: number;
    date_reservation: string;
}