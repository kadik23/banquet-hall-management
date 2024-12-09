import Database from "better-sqlite3";

export const db = new Database("myDb.db", { verbose: console.log });

db.pragma("foreign_keys = ON");

const createTables = () => {
  try {
    // db.prepare(`DROP TABLE IF EXISTS clients;`).run();
    db.prepare(`
      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        surname TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL
      );
    `).run();

    // db.prepare(`DROP TABLE IF EXISTS reservations;`).run();
    db.prepare(`
      CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        start_date TEXT NOT NULL,
        period TEXT NOT NULL,
        start_hour TEXT NOT NULL,
        end_hour TEXT NOT NULL,
        nbr_invites INTEGER NOT NULL,
        date_reservation TEXT NOT NULL,
        FOREIGN KEY (client_id) REFERENCES clients (id)
      );
    `).run();

    // db.prepare(`DROP TABLE IF EXISTS payments;`).run();
    db.prepare(`
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        reservation_id INTEGER NOT NULL,
        total_amount INTEGER NOT NULL,
        amount_paid INTEGER NOT NULL,
        remaining_balance INTEGER NOT NULL,
        payment_date TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('waiting', 'confirmed')),
        FOREIGN KEY (client_id) REFERENCES clients (id),
        FOREIGN KEY (reservation_id) REFERENCES reservations (id)
      );
    `).run();

    // db.prepare(`DROP TABLE IF EXISTS receipts;`).run();
    db.prepare(`
      CREATE TABLE IF NOT EXISTS receipts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        reservation_id INTEGER NOT NULL,
        payment_id INTEGER,
        pdf_path TEXT NOT NULL,
        FOREIGN KEY (client_id) REFERENCES clients (id),
        FOREIGN KEY (reservation_id) REFERENCES reservations (id),
        FOREIGN KEY (payment_id) REFERENCES payments (id)
      );
    `).run();

    // db.prepare(`DROP TABLE IF EXISTS products;`).run();
    db.prepare(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        unique_price INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        total_amount INTEGER NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('paid', 'not-paid')),
        date TEXT NOT NULL
      );
    `).run();

    const insertSampleProduct = db.prepare(`
      INSERT INTO products (name, unique_price, quantity, total_amount, status, date) 
      VALUES ('product', 2000, 2, 4000, 'not-paid', '2024-09-12')
    `);
    insertSampleProduct.run();

    console.log("Tables created and sample data inserted successfully.");
  } catch (error) {
    console.error("Error creating tables or inserting sample data:", error);
  }
};

createTables();
