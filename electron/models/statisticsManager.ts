import {db as database} from "./dbManager";

export const getNumClients = () => {
  try {
    const qry = "SELECT COUNT(*) AS count FROM clients;";
    const result = database.prepare(qry).get();
    return result.count;
  } catch (error) {
    console.error("Error fetching client count:", error);
    return 0;
  }
};

export const getNumReservation = () => {
  try {
    const qry = "SELECT COUNT(*) AS count FROM reservation;";
    const result = database.prepare(qry).get();
    return result.count;
  } catch (error) {
    console.error("Error fetching reservation count:", error);
    return 0;
  }
};

export const getNumPendingPayments = () => {
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

export const getNumConfirmPayments = () => {
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

export const getNumReceipts = () => {
  try {
    const qry = "SELECT COUNT(*) AS count FROM receipts;";
    const result = database.prepare(qry).get();
    return result.count;
  } catch (error) {
    console.error("Error fetching receipts count:", error);
    return 0;
  }
};

export const getNumProducts = () => {
  try {
    const qry = "SELECT COUNT(*) AS count FROM products;";
    const result = database.prepare(qry).get();
    return result.count;
  } catch (error) {
    console.error("Error fetching receipts count:", error);
    return 0;
  }
};

export const globalSearch = (searchTerm: string, page = 1) => {
  const limit = 10;
  const offset = (page - 1) * limit;
  
  const qry = `
    SELECT 'clients' as table_name, id, name, surname, phone, address, NULL as extra 
    FROM clients 
    WHERE 
      name LIKE ? OR 
      surname LIKE ? OR 
      phone LIKE ? OR 
      address LIKE ? OR 
      id = CAST(? AS INTEGER)
    
    UNION ALL
    
    SELECT 'reservations' as table_name, id, 
      CAST(client_id AS TEXT) as client_id, 
      start_date, 
      period, 
      start_hour, 
      end_hour, 
      CAST(nbr_invites AS TEXT) as nbr_invites
    FROM reservations 
    WHERE 
      id = CAST(? AS INTEGER) OR
      client_id = CAST(? AS INTEGER) OR
      start_date LIKE ? OR
      period LIKE ? OR 
      start_hour LIKE ? OR 
      end_hour LIKE ? OR
      nbr_invites = CAST(? AS INTEGER)
    
    UNION ALL
    
    SELECT 'payments' as table_name, id, 
      CAST(client_id AS TEXT) as client_id, 
      CAST(reservation_id AS TEXT) as reservation_id, 
      CAST(total_amount AS TEXT) as total_amount, 
      CAST(amount_paid AS TEXT) as amount_paid, 
      CAST(remaining_balance AS TEXT) as remaining_balance, 
      payment_date, 
      status
    FROM payments 
    WHERE 
      id = CAST(? AS INTEGER) OR
      client_id = CAST(? AS INTEGER) OR
      reservation_id = CAST(? AS INTEGER) OR
      total_amount = CAST(? AS INTEGER) OR 
      amount_paid = CAST(? AS INTEGER) OR 
      remaining_balance = CAST(? AS INTEGER) OR 
      payment_date LIKE ? OR
      status LIKE ?
    
    UNION ALL
    
    SELECT 'products' as table_name, id, 
      name, 
      CAST(unique_price AS TEXT) as unique_price, 
      CAST(quantity AS TEXT) as quantity, 
      CAST(total_amount AS TEXT) as total_amount, 
      status
    FROM products 
    WHERE 
      id = CAST(? AS INTEGER) OR
      name LIKE ? OR
      unique_price = CAST(? AS INTEGER) OR
      quantity = CAST(? AS INTEGER) OR
      total_amount = CAST(? AS INTEGER) OR
      status LIKE ?
    
    UNION ALL
    
    SELECT 'receipts' as table_name, id, 
      CAST(client_id AS TEXT) as client_id, 
      CAST(reservation_id AS TEXT) as reservation_id, 
      CAST(payment_id AS TEXT) as payment_id, 
      pdf_path, 
      NULL as extra
    FROM receipts 
    WHERE 
      id = CAST(? AS INTEGER) OR
      client_id = CAST(? AS INTEGER) OR
      reservation_id = CAST(? AS INTEGER) OR
      payment_id = CAST(? AS INTEGER) OR
      pdf_path LIKE ?
    
    LIMIT ? OFFSET ?
  `;
  
  const stmt = database.prepare(qry);
  const res = stmt.all(
    // Clients
    `%${searchTerm}%`, 
    `%${searchTerm}%`, 
    `%${searchTerm}%`, 
    `%${searchTerm}%`, 
    searchTerm,
    
    // Reservations
    searchTerm, 
    searchTerm, 
    `%${searchTerm}%`, 
    `%${searchTerm}%`, 
    `%${searchTerm}%`, 
    `%${searchTerm}%`,
    searchTerm,
    
    // Payments
    searchTerm, 
    searchTerm, 
    searchTerm, 
    searchTerm, 
    searchTerm, 
    searchTerm, 
    `%${searchTerm}%`, 
    `%${searchTerm}%`,
    
    // Products
    searchTerm, 
    `%${searchTerm}%`, 
    searchTerm, 
    searchTerm, 
    searchTerm, 
    `%${searchTerm}%`,
    
    // Receipts
    searchTerm, 
    searchTerm, 
    searchTerm, 
    searchTerm, 
    `%${searchTerm}%`,
    
    limit, 
    offset
  );
  
  return res;
};