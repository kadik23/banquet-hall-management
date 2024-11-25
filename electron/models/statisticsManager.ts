const dbmgr = require("./dbManager");
const database = dbmgr.db;

exports.getNumClients = () => {
  try {
    const qry = "SELECT COUNT(*) AS count FROM clients;";
    const result = database.prepare(qry).get();
    return result.count;
  } catch (error) {
    console.error("Error fetching client count:", error);
    return 0;
  }
};

exports.getNumReservation = () => {
  try {
    const qry = "SELECT COUNT(*) AS count FROM reservation;";
    const result = database.prepare(qry).get();
    return result.count;
  } catch (error) {
    console.error("Error fetching reservation count:", error);
    return 0;
  }
};

exports.getNumPendingPayments = () => {
  try {
    const qry =
      "SELECT COUNT(*) AS count FROM payments WHERE status = 'pending';";
    const result = database.prepare(qry).get();
    return result.count;
  } catch (error) {
    console.error("Error fetching payments count:", error);
    return 0;
  }
};

exports.getNumConfirmPayments = () => {
  try {
    const qry =
      "SELECT COUNT(*) AS count FROM payments WHERE status = 'confirmed';";
    const result = database.prepare(qry).get();
    return result.count;
  } catch (error) {
    console.error("Error fetching payments count:", error);
    return 0;
  }
};

exports.getNumReceipts = () => {
  try {
    const qry = "SELECT COUNT(*) AS count FROM receipts;";
    const result = database.prepare(qry).get();
    return result.count;
  } catch (error) {
    console.error("Error fetching receipts count:", error);
    return 0;
  }
};

exports.getNumProducts = () => {
  try {
    const qry = "SELECT COUNT(*) AS count FROM products;";
    const result = database.prepare(qry).get();
    return result.count;
  } catch (error) {
    console.error("Error fetching receipts count:", error);
    return 0;
  }
};
