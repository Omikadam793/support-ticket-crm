import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './database.js'; // Imports your connection pool configuration

dotenv.config();

const app = express();
// Render assigns a dynamic port; fallback to 5000 for local development
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows your Vercel frontend to communicate with this API
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

// 3. POST Route: Initialize record logs securely
app.post('/api/tickets', async (req, res) => {
    const { customer_name, customer_email, subject, description, notes, priority } = req.body;
    
    // Generate a unique reference ticket string
    const ticket_id = `TKT-${Date.now().toString().slice(-7)}`;
    const ticketPriority = priority || 'Medium';

    try {
        const queryText = `
            INSERT INTO tickets (ticket_id, customer_name, customer_email, subject, description, priority, status, notes)
            VALUES ($1, $2, $3, $4, $5, $6, 'Open', $7)
            RETURNING *;
        `;
        const values = [ticket_id, customer_name, customer_email, subject, description, ticketPriority, notes || ''];
        
        const result = await db.query(queryText, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error writing to database sequence:', error);
        res.status(500).json({ error: 'Failed to create new live cloud record' });
    }
});

// 4. PUT Route: Update a specific ticket
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
        
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error writing updates to cloud database:', error);
        res.status(500).json({ error: 'Failed to apply structural parameter changes' });
    }
});

// 5. DELETE Route: Permanently purge a ticket
app.delete('/api/tickets/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const queryText = 'DELETE FROM tickets WHERE id = $1 RETURNING *;';
        const result = await db.query(queryText, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Ticket record identifier not found in database registry." });
        }

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
// '0.0.0.0' allows external connections, required by Render
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is successfully running on port ${PORT}`);
    console.log(`📡 Connected to your Supabase PostgreSQL cloud database!`);
});