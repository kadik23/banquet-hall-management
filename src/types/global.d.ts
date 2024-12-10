export {};

declare global {
  interface Window {
    electron: {
      send: (channel: string, data: any) => void;
      receive: (channel: string, callback: (data: any) => void) => void;
    };
    sqliteClients: {
      getClients: () => Promise<any>;
      createClient: (name: string, surname: string, phone: string, address: string) => Promise<any>;
      editClient: (id: number, name: string, surname: string, phone: string, address: string) => Promise<any>;
      deleteClient: (id: number) => Promise<any>;
      deleteAllClients: () => Promise<any>;
      searchClients: (searchItem: string) => Promise<any>;
    };
    sqliteStatistics: {
      getNumClients: () => Promise<number>;
      getNumReservation: () => Promise<number>;
      getNumPendingPayments: () => Promise<number>;
      getNumConfirmPayments: () => Promise<number>;
      getNumReceipts: () => Promise<number>;
      getNumProducts: () => Promise<number>;
    };
    sqliteReservation: {
      getReservations: () => Promise<any>;
      createReservation: (
        client_id: number,
        start_date: string,
        period: "morning" | "evening",
        start_hour: string,
        end_hour: string,
        nbr_invites: number,
        date_reservation: string
      ) => Promise<any>;
      editReservation: (
        id: number,
        client_id: number,
        start_date: string,
        period: "morning" | "evening",
        start_hour: string,
        end_hour: string,
        nbr_invites: number,
        date_reservation: string
      ) => Promise<any>;
      deleteReservation: (id: number) => Promise<any>;
      deleteAllReservations: () => Promise<any>;
      searchReservations: (searchItem: string) => Promise<any>;
    };
    sqlitePaiment: {
      getPaiments: () => Promise<any>;
      getConfirmedPaimentsCount: () => Promise<number>;
      getWaitedPaimentsCount: () => Promise<number>;
      createPaiment: (
        client_id: number,
        reservation_id: number,
        total_amount: number,
        amount_paid: number,
        remaining_balance: number,
        payment_date: string,
        status: "waiting" | "confirmed",
      ) => Promise<any>;
      editPaiment: (
        id: number,
        client_id: number,
        reservation_id: number,
        total_amount: number,
        amount_paid: number,
        remaining_balance: number,
        payment_date: string,
        status: "waiting" | "confirmed"
      ) => Promise<any>;
      deletePaiment: (id: number) => Promise<any>;
      deleteAllPaiments: () => Promise<any>;
      searchPaiments: (searchItem: string) => Promise<any>;
    };
    sqliteProduct: {
      getProducts: () => Promise<any>;
      getPaidProductsCount: () => Promise<number>;
      getNotPaidProductsCount: () => Promise<number>;
      getTotalAmount: () => Promise<number>;
      createProduct: (
        name: string,
        unique_price: number,
        quantity: number,
        total_amount: number,
        status: "paid" | "not-paid",
        date: string
      ) => Promise<any>;
      editProduct: (
        id: number,
        name: string,
        unique_price: number,
        quantity: number,
        total_amount: number,
        status: "paid" | "not-paid"
      ) => Promise<any>;
      deleteProduct: (id: number) => Promise<any>;
      deleteAllProducts: () => Promise<any>;
      searchProducts: (searchItem: string) => Promise<any>;
    };
    sqliteReceipt: {
      getReceipts: (page: number) => Promise<any>;
      createReceipt: (
        client_id: number,
        reservation_id: number,
        paiment_id: number,
        pdf_path: string
      ) => Promise<any>;
      deleteReceipt: (id: number) => Promise<any>;
      deleteAllReceipts: () => Promise<any>;
      searchReceipts: (searchItem: string, page: number) => Promise<any>;
      uploadPDF: (
        pdfData: File,
        client_id: number,
        reservation_id: number,
        paiment_id: number
      ) => Promise<any>;
    };
  }
}
