const paimentMgr = require("../models/paimentManager");

export const getPaiments = (page = 1) => {
  return paimentMgr.getPaiments(page);
};

export const getWaitedPaimentsCount = () => {
  return paimentMgr.getWaitedPaimentsCount();
};

export const getConfirmedPaimentsCount = () => {
  return paimentMgr.getConfirmedPaimentsCount();
};

export const createPaiment = (
  client_id: number,
  reservation_id: number,
  total_amount: number,
  amount_paid: number,
  remaining_balance: number,
  payment_date: string,
  status: "waiting" | "confirmed"
) => {
  if (
    !client_id ||
    !reservation_id ||
    !total_amount ||
    !amount_paid ||
    !remaining_balance ||
    !payment_date ||
    !status
  ) {
    return { success: false, message: "missing required data" };
  }
  return paimentMgr.createPaiment(
    client_id,
    reservation_id,
    total_amount,
    amount_paid,
    remaining_balance,
    payment_date,
    status
  );
};

export const editPaiment = (
  id: number,
  client_id: Number | null,
  reservation_id: number | null,
  total_amount: number | null,
  amount_paid: number | null,
  remaining_balance: number | null,
  payment_date: string | null,
  status: "waiting" | "confirmed" | null
) => {
  return paimentMgr.editPaiment(
    id,
    client_id,
    reservation_id,
    total_amount,
    amount_paid,
    remaining_balance,
    payment_date,
    status
  );
};

export const deletePaiment = (id: string) => {
  return paimentMgr.deletePaiment(id);
};

export const deleteAllPaiments = () => {
  return paimentMgr.deleteAllPaiments();
};

export const searchPaiments = (searchItem: string, page = 1) => {
  return paimentMgr.searchPayments(searchItem, page);
};
