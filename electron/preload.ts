import { contextBridge, ipcRenderer } from "electron";

import {
  getReservations,
  createReservation,
  editReservation,
  deleteReservation,
  deleteAllReservations,
  searchReservations
} from "./controllers/reservationsController";

import {
  getClients,
  createClient,
  editClient,
  deleteClient,
  deleteAllClients,
  searchClients
} from "./controllers/clientsController";

import {
  getNumClients,
  getNumReservation,
  getNumPendingPayments,
  getNumConfirmPayments,
  getNumReceipts,
  getNumProducts,
} from "./controllers/statisticsController";

import {
  getPaiments,
  createPaiment,
  editPaiment,
  deletePaiment,
  deleteAllPaiments,
  searchPaiments,
  getConfirmedPaimentsCount,
  getWaitedPaimentsCount
} from "./controllers/paimentsController";

import {
  getProducts,
  createProduct,
  editProduct,
  deleteProduct,
  deleteAllProducts,
  searchProducts,
  getPaidProductsCount,
  getNotPaidProductsCount,
  getTotalAmount
} from "./controllers/productsController";

import {
  getReceipts,
  deleteReceipt,
  deleteAllReceipts,
  createReceipt,
  searchReceipts
} from "./controllers/receiptsController";

contextBridge.exposeInMainWorld("electron", {
  send: (channel: string, data: any) => ipcRenderer.send(channel, data),
  receive: (channel: string, callback: (arg0: any) => void) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
});

contextBridge.exposeInMainWorld("sqliteClients", {
  getClients: (page: number) => getClients(page),
  createClient: (name: string, surname: string, phone: string, address: string) =>
    createClient(name, surname, phone, address),
  editClient: (id: number, name: string, surname: string, phone: string, address: string) =>
    editClient(id, name, surname, phone, address),
  deleteClient: (id: number) => deleteClient(id),
  deleteAllClients: () => deleteAllClients(),
  searchClients: (searchItem: string,page:number) => searchClients(searchItem, page)
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
    client_id: number,
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
    client_id: number,
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
  searchReservations: (searchItem: string,page:number) => searchReservations(searchItem, page)
});

contextBridge.exposeInMainWorld("sqlitePaiment", {
  getPaiments: (page: number) => getPaiments(page),
  getConfirmedPaimentsCount: () => getConfirmedPaimentsCount(),
  getWaitedPaimentsCount: () => getWaitedPaimentsCount(),
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
    client_id: number,
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
  searchPaiments: (searchItem: string,page:number) => searchPaiments(searchItem, page)
});

contextBridge.exposeInMainWorld("sqliteProduct", {
  getProducts: (page: number) => getProducts(page),
  getPaidProductsCount: () => getPaidProductsCount(),
  getNotPaidProductsCount: () => getNotPaidProductsCount(),
  getTotalAmount: () => getTotalAmount(),
  createProduct: (
    name: string,
    unique_price: number,
    quantity: number,
    total_amount: number,
    status: 'paid' | 'not-paid'
  ) => createProduct(name, unique_price, quantity, total_amount, status),
  editProduct: (
    id: number,
    name: string,
    unique_price: number,
    quantity: number,
    total_amount: number,
    status: 'paid' | 'not-paid'
  ) => editProduct(id, name, unique_price, quantity, total_amount, status),
  deleteProduct: (id: number) => deleteProduct(id),
  deleteAllProducts: () => deleteAllProducts(),
  searchProducts: (searchItem: string,page:number) => searchProducts(searchItem, page)
});

contextBridge.exposeInMainWorld("sqliteReceipt", {
  getReceipts: (page: number) => getReceipts(page),
  createReceipt: (
    client_id: number,
    reservation_id: number,
    paiment_id: number,
    pdf_path: string
  ) => createReceipt(client_id, reservation_id, paiment_id, pdf_path),
  // editReceipt: (
  //   id: number,
  //   name: string,
  //   unique_price: number,
  //   quantity: number,
  //   total_amount: number,
  //   status: 'waiting' | 'confirmed'
  // ) =>
  //   editReceipt(
  //     id,
  //     name,
  //     unique_price,
  //     quantity,
  //     total_amount,
  //     status
  //   ),
  deleteReceipt: (id: number) => deleteReceipt(id),
  deleteAllReceipts: () => deleteAllReceipts(),
  searchReceipts: (searchItem: string,page:number) => searchReceipts(searchItem, page),   
  uploadPDF: (pdfData: File, client_id: number,
    reservation_id: number,
    paiment_id: number,) =>
    ipcRenderer.invoke("uploadPDF", pdfData, client_id, reservation_id, paiment_id),
});
