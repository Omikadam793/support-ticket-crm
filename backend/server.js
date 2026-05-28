import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store
let ticketsDatabase = [
    { id: 1, title: "Screen is broken", customer: "John Doe", status: "open", email: "john@example.com", description: "Glass shattered", notes: "" }
];

// Routes
app.get('/', (req, res) => {
    res.send('Support CRM Backend API is Running!');
});

// 1. GET Route: Fetch all entries
app.get('/api/tickets', (req, res) => {
    res.status(200).json(ticketsDatabase);
});

// 2. GET Route: Fetch a single ticket by ID (Critical for the Detail Workspace view)
app.get('/api/tickets/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const ticket = ticketsDatabase.find(t => t.id === id);
    
    if (!ticket) {
        return res.status(404).json({ message: "Ticket not found within tracking index." });
    }
    res.status(200).json(ticket);
});

// 3. POST Route: Initialize record logs securely
app.post('/api/tickets', (req, res) => {
    // SECURITY FIX: Generate an absolute monotonic auto-incrementing integer key
    const nextId = ticketsDatabase.length > 0 
        ? Math.max(...ticketsDatabase.map(t => t.id)) + 1 
        : 1;

    const newTicket = {
        id: nextId,
        title: req.body.title,
        customer: req.body.customer,
        email: req.body.email,
        description: req.body.description,
        status: req.body.status || "open",
        notes: req.body.notes || ""
    };
    
    ticketsDatabase.push(newTicket);
    console.log("New Ticket Saved to Memory Sequence:", newTicket);
    res.status(201).json(newTicket);
});

// 4. PUT Route: Update a specific ticket's details
app.put('/api/tickets/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const ticket = ticketsDatabase.find(t => t.id === id);
    
    if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
    }
    
    // Read updates sent from the frontend and update our database object securely
    if (req.body.status) ticket.status = req.body.status;
    if (req.body.notes !== undefined) ticket.notes = req.body.notes;
    
    console.log(`Ticket #${id} updated in DB successfully:`, ticket);
    res.status(200).json(ticket);
});

app.listen(PORT, () => {
    console.log(`🚀 Backend engine spinning smoothly on http://localhost:${PORT}`);
});