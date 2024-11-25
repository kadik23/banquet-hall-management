const Database = require("better-sqlite3");

const db = new Database("myDb.db", { verbose: console.log });

db.pragma("foreign_keys = ON");

const createTables = () => {
  try {
    const createClientTableQuery = `
      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        surname TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL
      );
    `;

    const createReservationTableQuery = `
      CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        start_date TEXT NOT NULL,
        period TEXT NOT NULL,
        start_hour TEXT NOT NULL,
        end_hour TEXT NOT NULL,
        nbr_invites INTEGER NOT NULL,
        date_reservation TEXT NOT NULL,
        FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `;

    const createPaymentTableQuery = `
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        reservation_id INTEGER NOT NULL,
        total_amount INTEGER NOT NULL,
        amount_paid INTEGER NOT NULL,
        remaining_balance INTEGER NOT NULL,
        payment_date TEXT NOT NULL,
        status TEXT NOT NULL,
        FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (reservation_id) REFERENCES reservations (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `;

    const createReceiptTableQuery = `
      CREATE TABLE IF NOT EXISTS receipts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        reservation_id INTEGER NOT NULL,
        payment_id INTEGER NOT NULL,
        pdf_path TEXT NOT NULL,
        status TEXT NOT NULL,
        FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (reservation_id) REFERENCES reservations (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (payment_id) REFERENCES payments (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `;

    const createProductTableQuery = `
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        prix INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        total_amount INTEGER NOT NULL,
        status TEXT NOT NULL
      );
    `;

    db.prepare(createClientTableQuery).run();
    db.prepare(createReservationTableQuery).run();
    db.prepare(createPaymentTableQuery).run();
    db.prepare(createReceiptTableQuery).run();
    db.prepare(createProductTableQuery).run();
    const insertSampleClient = db.prepare(`
      INSERT INTO clients (name, surname, phone, address) 
      VALUES ('John', 'Doe', 123456789, 'medea 26')
  `);
    insertSampleClient.run();
    console.log("Tables created successfully.");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};

createTables();

exports.db = db;
