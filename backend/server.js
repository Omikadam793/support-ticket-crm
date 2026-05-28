import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8080;
// // Middleware
app.use(cors());
app.use(express.json());

// In-memory data store
let ticketsDatabase = [
    { id: 1, title: "Screen is broken", customer: "John Doe", status: "open", email: "john@example.com", description: "Glass shattered" }
];

// Routes
app.get('/', (req, res) => {
    res.send('Support CRM Backend API is Running!');
});

app.get('/api/tickets', (req, res) => {
    res.status(200).json(ticketsDatabase);
});

app.post('/api/tickets', (req, res) => {
    const newTicket = {
        id: ticketsDatabase.length + 1,
        title: req.body.title,
        customer: req.body.customer,
        email: req.body.email,
        description: req.body.description,
        status: req.body.status || "open"
    };
    
    ticketsDatabase.push(newTicket);
    console.log("New Ticket Saved:", newTicket);
    res.status(201).json(newTicket);
});

// 4. PUT Route: Update a specific ticket's details
app.put('/api/tickets/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const ticket = ticketsDatabase.find(t => t.id === id);
    
    if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
    }
    
    // Read updates sent from the frontend and update our database object
    if (req.body.status) ticket.status = req.body.status;
    if (req.body.notes !== undefined) ticket.notes = req.body.notes;
    
    console.log(`Ticket #${id} updated in DB successfully:`, ticket);
    res.status(200).json(ticket);
});

app.listen(PORT, () => {
    console.log(`🚀 Backend engine spinning smoothly on http://localhost:${PORT}`);
});