const Database = require("better-sqlite3");

const db = new Database("myDb.db", { verbose: console.log });

const createTable = () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        surname TEXT NOT NULL UNIQUE,
        phone TEXT NOT NULL, 
        address TEXT NOT NULL
      );
    `;
    db.prepare(createTableQuery).run();  

    const insertSampleClient = db.prepare(`
      INSERT INTO clients (name, surname, phone, address) 
      VALUES ('John', 'Doe', '123456789', 'medea 26')
    `);
    insertSampleClient.run(); 

    console.log("Table created and sample data inserted.");

  } catch (error) {
    console.error("Error creating table or inserting sample data:", error);
  }
};

createTable();

exports.db = db;
