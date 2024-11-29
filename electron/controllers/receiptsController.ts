const receiptMgr = require("../models/receiptsManager");

export const getReceipts = (page = 1) => {
  return receiptMgr.getReceipts(page);
};

export const createPaiment = (
  client_id: number,
  reservation_id: number,
  paiment_id: number,
  pdf_path: string
) => {
  if (
    !client_id ||
    !reservation_id ||
    !paiment_id ||
    !pdf_path
  ) {
    return { success: false, message: "missing required data" };
  }
  return receiptMgr.createPaiment(
    client_id,
    reservation_id,
    paiment_id,
    pdf_path
  );
};

// export const editPaiment = (
//   id: number,
//   client_id: Number | null,
//   reservation_id: number| null,
//   total_amount: number| null,
//   amount_paid: number| null,
//   remaining_balance: number| null,
//   payment_date: string| null,
//   status: "waiting" | "confirmed"| null
// ) => {
//   return receiptMgr.editPaiment(
//     id,
//     client_id,
//     reservation_id,
//     total_amount,
//     amount_paid,
//     remaining_balance,
//     payment_date,
//     status,
//   );
// };

export const deletePaiment = (id: string) => {
  return receiptMgr.deletePaiment(id);
};

export const deleteAllPaiments = () => {
  return receiptMgr.deleteAllPaiments();
};
