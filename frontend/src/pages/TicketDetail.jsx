import { useState, useEffect } from 'react';
import axios from 'axios';
// Import the URL parameter reader hook from React Router
import { useParams, Link } from 'react-router-dom';

export default function TicketDetail() {
  // Read the dynamic :id parameter straight out of the active browser URL path
  const { id } = useParams(); 
  const ticketId = parseInt(id); // Convert the text parameter ID into a clean number

  // States for storing data from the backend
  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState("Open");
  const [notes, setNotes] = useState("");
  
  // Feedback states for the user
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Step 1: Fetch the single ticket's current details on page load using its direct ID route
  useEffect(() => {
    setLoading(true);
    // UPDATE: Pointing to your local single ticket endpoint on port 5000
    axios.get(`http://localhost:5000/api/tickets/${ticketId}`)
      .then(res => {
        setTicket(res.data);
        setStatus(res.data.status || "Open");
        setNotes(res.data.notes || ""); // Default to empty string if no notes exist yet
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching ticket detail:", err);
        setLoading(false);
      });
  }, [ticketId]);

  // Step 2: Handle the PUT Request Update
  const handleUpdate = () => {
    setIsUpdating(true);
    const updatedData = {
      status: status,
      notes: notes
    };

    // UPDATE: Triggering the HTTP PUT request to modify the specific PostgreSQL row locally
    axios.put(`http://localhost:5000/api/tickets/${ticketId}`, updatedData)
      .then(res => {
        setMessage("Ticket updated successfully inside Supabase!");
        setIsUpdating(false);
        // Clear message after 3 seconds
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(err => {
        console.error("Error updating ticket:", err);
        setMessage("Failed to update ticket parameter sequences.");
        setIsUpdating(false);
      });
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', fontFamily: '"Inter", sans-serif', color: '#4a5568' }}>Loading ticket details from cloud indexes...</div>;
  if (!ticket) return <div style={{ padding: '40px', textAlign: 'center', fontFamily: '"Inter", sans-serif', color: '#c53030' }}>⚠️ Ticket tracking parameter not found.</div>;

  return (
    <div style={{ padding: '24px', fontFamily: '"Inter", sans-serif', maxWidth: '600px', margin: '0 auto', color: '#2d3748' }}>
      
      <div style={{ marginBottom: '16px' }}>
        <Link to="/" style={{ color: '#2b6cb0', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>← Return to Command Center</Link>
      </div>

      {/* UPDATE: Cleanly rendering customized ticket_id string along with raw serial key */}
      <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>Ticket Deep Dive ({ticket.ticket_id || `#${ticket.id}`})</h2>
      <p style={{ color: '#718096', fontSize: '14px', marginBottom: '24px' }}>Modify live operational attributes, attach administrative troubleshooting notes, and adjust lifecycle flags.</p>
      
      {message && (
        <div style={{ padding: '12px 16px', marginBottom: '20px', backgroundColor: '#def7ec', color: '#03543f', borderRadius: '6px', fontSize: '14px', fontWeight: '500', border: '1px solid #bfefed' }}>
          {message}
        </div>
      )}

      {/* --- Ticket Information Display Card --- */}
      {/* UPDATE: Realigned template properties to map directly to your PostgreSQL schema column fields */}
      <div style={{ backgroundColor: '#f7fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px', fontSize: '14px', lineHeight: '1.6' }}>
        <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: '#4a5568' }}>Customer Name:</strong> {ticket.customer_name}</p>
        <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: '#4a5568' }}>Email Address:</strong> {ticket.customer_email}</p>
        <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: '#4a5568' }}>Subject Title:</strong> {ticket.subject}</p>
        <p style={{ whiteSpace: 'pre-line', margin: '0' }}><strong style={{ color: '#4a5568' }}>Issue Description:</strong><br />{ticket.description}</p>
      </div>

      {/* --- Admin Control Panel --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0' }}>Agent Workspace Actions</h3>
        
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>Update Status:</label>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            disabled={isUpdating}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', width: '220px', fontSize: '14px', outline: 'none', backgroundColor: '#fff' }}
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed / Resolved</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>Troubleshooting Internal Notes:</label>
          <textarea 
            rows="5"
            value={notes} 
            onChange={(e) => setNotes(e.target.value)}
            disabled={isUpdating}
            placeholder="Type private admin notes here regarding steps taken to solve this issue..."
            style={{ width: '100%', padding: '10px 12px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
          />
        </div>

        <button 
          onClick={handleUpdate}
          disabled={isUpdating}
          style={{ 
            padding: '12px', 
            backgroundColor: isUpdating ? '#a0aec0' : '#2b6cb0', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: isUpdating ? 'not-allowed' : 'pointer',
            fontWeight: '700',
            fontSize: '15px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            transition: 'background-color 0.2s',
            marginTop: '8px'
          }}
        >
          {isUpdating ? "Saving Structural Modifications..." : "Save Ticket Changes"}
        </button>
      </div>
    </div>
  );
}