import {db} from "./dbManager";
const database = db;

export const getClients = () => {
  return database.prepare("SELECT * FROM clients").all();
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
  database.prepare('BEGIN TRANSACTION').run();

  try {
    const deleteQry = `DELETE FROM clients`;
    const deleteStmt = database.prepare(deleteQry);
    const deleteInfo = deleteStmt.run();

    const resetQry = `DELETE FROM sqlite_sequence WHERE name = 'clients'`;
    database.prepare(resetQry).run();

    database.prepare('COMMIT').run();

    return {
      success: true,
      message: `${deleteInfo.changes} clients deleted successfully, and ID reset.`,
    };
  } catch (error:any) {
    database.prepare('ROLLBACK').run();

    return {
      success: false,
      message: `Error deleting clients: ${error.message}`,
    };
  }
};


export const searchClients = (searchTerm: string): Client[] => {
  const qry = `
    SELECT * FROM clients 
    WHERE 
      id = CAST(? AS INTEGER) OR
      name LIKE ? OR 
      surname LIKE ? OR 
      phone LIKE ? OR 
      address LIKE ?
  `;
  
  const stmt = database.prepare(qry);
  const res = stmt.all(
    `%${searchTerm}%`, 
    `%${searchTerm}%`, 
    `%${searchTerm}%`, 
    `%${searchTerm}%`, 
    `%${searchTerm}%`
  );
  
  return res;
};
