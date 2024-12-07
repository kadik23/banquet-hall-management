import {db} from "./dbManager";
const database = db;

export const getClients = (page = 1) => {
  const limit = 10;
  const offset = (page - 1) * limit;
  const qry = `SELECT * FROM clients LIMIT ? OFFSET ?`;
  const stmt = database.prepare(qry);
  const res = stmt.all(limit, offset);
  return res;
};

export const createClient = (name: string, surname: string, phone: string, address: string) => {
  const qry = `INSERT INTO clients (name, surname, phone, address) VALUES (?, ?, ?, ?)`;
  const stmt = database.prepare(qry);
  const info = stmt.run(name, surname, phone, address);
  console.log(info)
  return { success: true, clientId: info.lastInsertRowid };
};

export const editClient = (
  id: number,
  name: string,
  surname: string,
  phone: string,
  address: string
) => {
  const qry = `UPDATE clients SET name = ?, surname = ?, phone = ?, address = ? WHERE id = ?`;
  const stmt = database.prepare(qry);
  const info = stmt.run(name, surname, phone, address, id);
  if (info.changes === 0) {
    return { success: false, message: "Client not found or no changes made" };
  }
  return { success: true, message: "Client updated successfully" };
};

export const deleteClient = (id: number) => {
  const qry = `DELETE FROM clients WHERE id = ?`;
  const stmt = database.prepare(qry);
  const info = stmt.run(id);
  if (info.changes === 0) {
    return { success: false, message: "Client not found", clientId:id };
  }
  return { success: true, message: `Client ${id} deleted successfully` };
};

export const deleteAllClients = () => {
  const qry = `DELETE FROM clients`;
  const stmt = database.prepare(qry);
  const info = stmt.run();
  return {
    success: true,
    message: `${info.changes} clients deleted successfully`,
  };
};

export const searchClients = (searchTerm:string, page = 1) => {
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