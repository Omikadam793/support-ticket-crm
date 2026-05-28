const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./crm.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id TEXT UNIQUE,
      customer_name TEXT,
      customer_email TEXT,
      subject TEXT,
      description TEXT,
      status TEXT DEFAULT 'Open',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;