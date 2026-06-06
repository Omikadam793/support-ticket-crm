import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './database.js'; // Imports your connection pool configuration

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Main status validation route
app.get('/', (req, res) => {
    res.send('Support CRM Backend API is Running on PostgreSQL cloud sync!');
});

// 1. GET Route: Fetch all entries from the cloud
app.get('/api/tickets', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM tickets ORDER BY created_at DESC;');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ error: 'Internal Server Error while retrieving cloud records' });
    }
});

// 2. GET Route: Fetch a single ticket by ID
app.get('/api/tickets/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM tickets WHERE id = $1;', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Ticket not found within tracking index." });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching ticket detail:', error);
        res.status(500).json({ error: 'Internal Server Error fetching row details' });
    }
});

// 3. POST Route: Initialize record logs securely in Supabase with Priority tracking
app.post('/api/tickets', async (req, res) => {
    // Destructure priority from incoming request body parameters
    const { customer_name, customer_email, subject, description, notes, priority } = req.body;
    
    // Generate a quick unique reference ticket string prefix (e.g., TKT-1717382)
    const ticket_id = `TKT-${Date.now().toString().slice(-7)}`;
    
    // Fallback default setting to safeguard baseline database structure execution
    const ticketPriority = priority || 'Medium';

    try {
        // Included priority column field parameter keys into the INSERT tracking sequence
        const queryText = `
            INSERT INTO tickets (ticket_id, customer_name, customer_email, subject, description, priority, status, notes)
            VALUES ($1, $2, $3, $4, $5, $6, 'Open', $7)
            RETURNING *;
        `;
        const values = [ticket_id, customer_name, customer_email, subject, description, ticketPriority, notes || ''];
        
        const result = await db.query(queryText, values);
        console.log("New Ticket Saved to Supabase Cloud:", result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error writing to database sequence:', error);
        res.status(500).json({ error: 'Failed to create new live cloud record' });
    }
});

// 4. PUT Route: Update a specific ticket's status or agent logs
app.put('/api/tickets/:id', async (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;

    try {
        const queryText = `
            UPDATE tickets 
            SET status = $1, notes = $2
            WHERE id = $3
            RETURNING *;
        `;
        const values = [status, notes, id];
        
        const result = await db.query(queryText, values);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Ticket identifier not found" });
        }
        
        console.log(`Ticket #${id} updated in Supabase successfully:`, result.rows[0]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error writing updates to cloud database:', error);
        res.status(500).json({ error: 'Failed to apply structural parameter changes' });
    }
});

// ==========================================
// FEATURE 3 ADDED: 5. DELETE Route
// Permanently purge an obsolete ticket record from Supabase cloud
// ==========================================
app.delete('/api/tickets/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const queryText = 'DELETE FROM tickets WHERE id = $1 RETURNING *;';
        const result = await db.query(queryText, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Ticket record identifier not found in database registry." });
        }

        console.log(`🗑️ Ticket #${id} permanently deleted from Supabase cloud registry.`);
        res.status(200).json({ 
            message: "Ticket permanently purged from core tracking instance safely.", 
            deletedTicket: result.rows[0] 
        });
    } catch (error) {
        console.error('Error handling database deletion payload:', error);
        res.status(500).json({ error: 'Internal Server Error executing row drop operation' });
    }
});

// Single Unified Execution Listener
app.listen(PORT, () => {
    console.log(`🚀 Server is successfully running locally on port ${PORT}`);
    console.log(`📡 Connected to your Supabase PostgreSQL cloud database!`);
});