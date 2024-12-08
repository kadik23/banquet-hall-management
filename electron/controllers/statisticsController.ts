import * as statisticsMgr from "../models/statisticsManager";

export const getNumClients = () => {
  return statisticsMgr.getNumClients;
};

export const getNumReservation = () => {
  return statisticsMgr.getNumReservation;
};

export const getNumPendingPayments = () => {
  return statisticsMgr.getNumPendingPayments;
};

export const getNumConfirmPayments = () => {
  return statisticsMgr.getNumConfirmPayments;
};

export const getNumReceipts = () => {
  return statisticsMgr.getNumReceipts;
};

export const getNumProducts = () => {
  return statisticsMgr.getNumProducts;
};

export const globalSearch = (searchItem: string, page: 1) => {
  return statisticsMgr.globalSearch(searchItem,page);
};
