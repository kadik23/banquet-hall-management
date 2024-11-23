const dbmgr = require("./dbManager");
const database = dbmgr.db;

exports.getClients = (page = 1) => {
  const limit = 10;
  const offset = (page - 1) * limit;
  const qry = `SELECT * FROM clients LIMIT ? OFFSET ?`;
  let stmt = database.prepare(qry);
  let res = stmt.all(limit, offset);
  return res;
};

exports.createClient = (name: string, email: string, phone: string) => {
  const qry = `INSERT INTO clients (name, email, phone) VALUES (?, ?, ?)`;
  let stmt = database.prepare(qry);
  let info = stmt.run(name, email, phone);
  return { success: true, clientId: info.lastInsertRowid };
};

exports.editClient = (
  id: number,
  name: string,
  email: string,
  phone: string
) => {
  const qry = `UPDATE clients SET name = ?, email = ?, phone = ? WHERE id = ?`;
  let stmt = database.prepare(qry);
  let info = stmt.run(name, email, phone, id);
  if (info.changes === 0) {
    return { success: false, message: "Client not found or no changes made" };
  }
  return { success: true, message: "Client updated successfully" };
};

exports.deleteClient = (id: number) => {
  const qry = `DELETE FROM clients WHERE id = ?`;
  let stmt = database.prepare(qry);
  let info = stmt.run(id);
  if (info.changes === 0) {
    return { success: false, message: "Client not found" };
  }
  return { success: true, message: "Client deleted successfully" };
};

exports.deleteAllClients = () => {
  const qry = `DELETE FROM clients`;
  let stmt = database.prepare(qry);
  let info = stmt.run();
  return {
    success: true,
    message: `${info.changes} clients deleted successfully`,
  };
};
