import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config();

// Create a connection pool targeting your cloud PostgreSQL instance
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necessary for cloud databases like Supabase/Neon
  }
});

// Verify connection capability on startup
db.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client database connection:", err.stack);
  }
  console.log("Successfully connected to cloud PostgreSQL instance!");
  release();
});

// Clean ES Module Export
export default db;