const dbmgr = require("./dbManager");
const database = dbmgr.db;

exports.getClients = (page = 1) => {
  const limit = 10;
  const offset = (page - 1) * limit;
  const qry = `SELECT * FROM clients LIMIT ? OFFSET ?`;
  const stmt = database.prepare(qry);
  const res = stmt.all(limit, offset);
  return res;
};

exports.createClient = (name: string, email: string, phone: string, address: string) => {
  const qry = `INSERT INTO clients (name, email, phone, address) VALUES (?, ?, ?)`;
  const stmt = database.prepare(qry);
  const info = stmt.run(name, email, phone, address);
  return { success: true, clientId: info.lastInsertRowid };
};

exports.editClient = (
  id: number,
  name: string,
  email: string,
  phone: string,
  address: string
) => {
  const qry = `UPDATE clients SET name = ?, email = ?, phone = ?, address = ?, WHERE id = ?`;
  const stmt = database.prepare(qry);
  const info = stmt.run(name, email, phone, address, id);
  if (info.changes === 0) {
    return { success: false, message: "Client not found or no changes made" };
  }
  return { success: true, message: "Client updated successfully" };
};

exports.deleteClient = (id: number) => {
  const qry = `DELETE FROM clients WHERE id = ?`;
  const stmt = database.prepare(qry);
  const info = stmt.run(id);
  if (info.changes === 0) {
    return { success: false, message: "Client not found" };
  }
  return { success: true, message: "Client deleted successfully" };
};

exports.deleteAllClients = () => {
  const qry = `DELETE FROM clients`;
  const stmt = database.prepare(qry);
  const info = stmt.run();
  return {
    success: true,
    message: `${info.changes} clients deleted successfully`,
  };
};

exports.searchClients = (searchTerm:string, page = 1) => {
  const limit = 10;
  const offset = (page - 1) * limit;
  
  const qry = `
    SELECT * FROM clients 
    WHERE 
      id = CAST(? AS INTEGER) OR
      name LIKE ? OR 
      surname LIKE ? OR 
      phone LIKE ? OR 
      address LIKE ?
    LIMIT ? OFFSET ?
  `;
  
  const stmt = database.prepare(qry);
  const res = stmt.all(
    `%${searchTerm}%`, 
    `%${searchTerm}%`, 
    `%${searchTerm}%`, 
    `%${searchTerm}%`, 
    `%${searchTerm}%`, 
    limit, 
    offset
  );
  
  return res;
};