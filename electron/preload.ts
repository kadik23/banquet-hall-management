const { contextBridge } = require("electron");

const {
  getReservations,
  createReservation,
  editReservation,
  deleteReservation,
  deleteAllReservations,
} = require("./controllers/reservationsController");

const {
  getClients,
  createClient,
  editClient,
  deleteClient,
  deleteAllClients,
} = require("./controllers/clientsController");

const {
  getNumClients,
  getNumReservation,
  getNumPendingPayments,
  getNumConfirmPayments,
  getNumReceipts,
  getNumProducts,
} = require("./controllers/statisticsController");

const {
  getPaiments,
  createPaiment,
  editPaiment,
  deletePaiment,
  deleteAllPaiments,
} = require("./controllers/reservationsController");

const {
  getProducts,
  createProduct,
  editProduct,
  deleteProduct,
  deleteAllProducts,
} = require("./controllers/productsController");

contextBridge.exposeInMainWorld("sqliteClients", {
  getClients: (page: number) => getClients(page),
  createClient: (name: string, email: string, phone: string) =>
    createClient(name, email, phone),
  editClient: (id: number, name: string, email: string, phone: string) =>
    editClient(id, name, email, phone),
  deleteClient: (id: number) => deleteClient(id),
  deleteAllClients: () => deleteAllClients(),
});

contextBridge.exposeInMainWorld("sqliteStatistics", {
  getNumClients: () => getNumClients(),
  getNumReservation: () => getNumReservation(),
  getNumPendingPayments: () => getNumPendingPayments(),
  getNumConfirmPayments: () => getNumConfirmPayments(),
  getNumReceipts: () => getNumReceipts(),
  getNumProducts: () => getNumProducts(),
});

contextBridge.exposeInMainWorld("sqliteReservation", {
  getReservations: (page: number) => getReservations(page),
  createReservation: (
    client_id: Number,
    start_date: string,
    period: "morning" | "evening",
    start_hour: string,
    end_hour: string,
    nbr_invites: number,
    date_reservation: string
  ) =>
    createReservation(
      client_id,
      start_date,
      period,
      start_hour,
      end_hour,
      nbr_invites,
      date_reservation
    ),
  editReservation: (
    id: number,
    client_id: Number,
    start_date: string,
    period: "morning" | "evening",
    start_hour: string,
    end_hour: string,
    nbr_invites: number,
    date_reservation: string
  ) =>
    editReservation(
      id,
      client_id,
      start_date,
      period,
      start_hour,
      end_hour,
      nbr_invites,
      date_reservation
    ),
  deleteReservation: (id: number) => deleteReservation(id),
  deleteAllReservations: () => deleteAllReservations(),
});

contextBridge.exposeInMainWorld("sqlitePaiment", {
  getPaiments: (page: number) => getPaiments(page),
  createPaiment: (
    client_id: number,
    reservation_id: number,
    total_amount: number,
    amount_paid: number,
    remaining_balance: number,
    payment_date: string,
    status: "waiting" | "confirmed"
  ) =>
    createPaiment(
      client_id,
      reservation_id,
      total_amount,
      amount_paid,
      remaining_balance,
      payment_date,
      status
    ),
  editPaiment: (
    id: number,
    client_id: Number,
    reservation_id: number,
    total_amount: number,
    amount_paid: number,
    remaining_balance: number,
    payment_date: string,
    status: "waiting" | "confirmed"
  ) =>
    editPaiment(
      id,
      client_id,
      reservation_id,
      total_amount,
      amount_paid,
      remaining_balance,
      payment_date,
      status
    ),
  deletePaiment: (id: number) => deletePaiment(id),
  deleteAllPaiments: () => deleteAllPaiments(),
});

contextBridge.exposeInMainWorld("sqliteProduct", {
  getProducts: (page: number) => getProducts(page),
  createProduct: (
    name: string,
    unique_price: number,
    quantity: number,
    total_amount: number,
    status: 'waiting' | 'confirmed'
  ) =>
    createProduct(
      name,
      unique_price,
      quantity,
      total_amount,
      status
    ),
  editProduct: (
    id: number,
    name: string,
    unique_price: number,
    quantity: number,
    total_amount: number,
    status: 'waiting' | 'confirmed'
  ) =>
    editProduct(
      id,
      name,
      unique_price,
      quantity,
      total_amount,
      status
    ),
  deleteProduct: (id: number) => deleteProduct(id),
  deleteAllProducts: () => deleteAllProducts(),
});
