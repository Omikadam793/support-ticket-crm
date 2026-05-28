import { useState, useEffect } from 'react';
import axios from 'axios';
// 1. Import the URL parameter reader hook
import { useParams } from 'react-router-dom';

export default function TicketDetail() {
  // 2. Read the dynamic :id parameter straight out of the active browser link
  const { id } = useParams(); 
  const ticketId = parseInt(id); // Convert the text ID into a clean number

  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState("open");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
}
  // ... rest of your code handles the data fetch and PUT requests exactly the same way!
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TicketDetail() {
  // Hardcoded for now until we hook up React Router navigation in the next steps
  const ticketId = 2; 

  // States for storing data from the backend
  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState("open");
  const [notes, setNotes] = useState("");
  
  // Feedback states for the user
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Step 1: Fetch the single ticket's current details on page load
  useEffect(() => {
    axios.get("https://support-crm-backend.onrender.com/api/tickets")
      .then(res => {
        // Since we are using an in-memory array backend, let's find our specific ticket
        const foundTicket = res.data.find(t => t.id === ticketId);
        if (foundTicket) {
          setTicket(foundTicket);
          setStatus(foundTicket.status);
          setNotes(foundTicket.notes || ""); // Default to empty string if no notes exist yet
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching ticket detail:", err);
        setLoading(false);
      });
  }, [ticketId]);

  // Step 2: Handle the PUT Request Update
  const handleUpdate = () => {
    const updatedData = {
      status: status,
      notes: notes
    };

    // Triggering the HTTP PUT request to modify the specific data record
    axios.put(`https://support-crm-backend.onrender.com/api/tickets/${ticketId}`, updatedData)
      .then(res => {
        setMessage("Ticket updated successfully!");
        // Clear message after 3 seconds
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(err => {
        console.error("Error updating ticket:", err);
        setMessage("Failed to update ticket.");
      });
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading ticket details...</div>;
  if (!ticket) return <div style={{ padding: '24px' }}>Ticket not found.</div>;

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Ticket Deep Dive (ID: #{ticket.id})</h2>
      
      {message && (
        <div style={{ padding: '12px', marginBottom: '16px', backgroundColor: '#e6fce6', color: '#006600', borderRadius: '4px' }}>
          {message}
        </div>
      )}

      {/* --- Ticket Information Display Card --- */}
      <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #eee', marginBottom: '24px' }}>
        <p><strong>Customer Name:</strong> {ticket.customer}</p>
        <p><strong>Email Address:</strong> {ticket.email}</p>
        <p><strong>Subject Title:</strong> {ticket.title}</p>
        <p style={{ whiteSpace: 'pre-line' }}><strong>Issue Description:</strong><br />{ticket.description}</p>
      </div>

      {/* --- Admin Control Panel --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
        <h3>Agent Workspace Actions</h3>
        
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Update Status:</label>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '200px' }}
          >
            <option value="open">Open</option>
            <option value="pending">Pending Agent Action</option>
            <option value="resolved">Resolved / Closed</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Troubleshooting Internal Notes:</label>
          <textarea 
            rows="4"
            value={notes} 
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Type private admin notes here regarding steps taken to solve this issue..."
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <button 
          onClick={handleUpdate}
          style={{ 
            padding: '12px', 
            backgroundColor: '#2b6cb0', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px'
          }}
        >
          Save Ticket Changes
        </button>
      </div>
    </div>
  );
}