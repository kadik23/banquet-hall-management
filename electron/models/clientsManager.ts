import {db} from "./dbManager";
const database = db;

export const getClients = () => {
  const data = database.prepare("SELECT * FROM clients").all();
  console.log('data:')
  console.log(data)
  return data
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
    return { success: false, message: "Client introuvable ou aucune modification effectuée" };
  }
  return { success: true, message: "Client mis à jour avec succès", clientId: id };
};

export const deleteClient = (id: number) => {
  try {
    database.prepare('BEGIN TRANSACTION').run();

    database.prepare(`DELETE FROM receipts WHERE client_id = ?`).run(id);
    database.prepare(`DELETE FROM payments WHERE client_id = ?`).run(id);
    database.prepare(`DELETE FROM reservations WHERE client_id = ?`).run(id);

    // Delete client
    const qry = `DELETE FROM clients WHERE id = ?`;
    const info = database.prepare(qry).run(id);

    if (info.changes === 0) {
      // Client not found
      database.prepare('ROLLBACK').run();
      return { success: false, message: 'Client introuvable', clientId: id };
    }

    // Commit transaction
    database.prepare('COMMIT').run();
    return { success: true, message: `Client ${id} et ses enregistrements associés supprimés avec succès` };
  } catch (error: any) {
    // Rollback transaction on error
    database.prepare('ROLLBACK').run();
    return { success: false, message: `Erreur lors de la suppression du client : ${error.message}` };
  }
};


export const deleteAllClients = () => {
  database.prepare('BEGIN TRANSACTION').run();

  try {
    database.prepare(`DELETE FROM receipts`).run();
    database.prepare(`DELETE FROM payments`).run();
    database.prepare(`DELETE FROM reservations`).run();
    const deleteQry = `DELETE FROM clients`;
    const deleteStmt = database.prepare(deleteQry);
    const deleteInfo = deleteStmt.run();

    const resetQry = `DELETE FROM sqlite_sequence WHERE name = 'clients'`;
    database.prepare(resetQry).run();

    database.prepare('COMMIT').run();

    return {
      success: true,
      message: `${deleteInfo.changes} clients supprimés avec succès et les ID réinitialisés.`,
    };
  } catch (error:any) {
    database.prepare('ROLLBACK').run();

    return {
      success: false,
      message: `Erreur lors de la suppression des clients : ${error.message}`,
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
