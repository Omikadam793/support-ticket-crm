import { useState, useEffect } from 'react';
import axios from 'axios';
// Import the URL parameter reader and navigation hooks from React Router
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function TicketDetail() {
  // Read the dynamic :id parameter straight out of the active browser URL path
  const { id } = useParams(); 
  const ticketId = parseInt(id); // Convert the text parameter ID into a clean number
  const navigate = useNavigate(); // Hook instance initialization for safe redirection

  // Dynamic Base URL configuration tracker
  // Falls back to localhost if the environment variable isn't set in your local system
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // States for storing data from the backend
  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState("Open");
  const [notes, setNotes] = useState("");
  
  // Feedback states for the user
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // Flag tracking system delete request

  // Step 1: Fetch the single ticket's current details on page load
  useEffect(() => {
    setLoading(true);
    // Updated: Using the dynamic variable base pipeline
    axios.get(`${API_BASE_URL}/api/tickets/${ticketId}`)
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
  }, [ticketId, API_BASE_URL]);

  // Step 2: Handle the PUT Request Update
  const handleUpdate = () => {
    setIsUpdating(true);
    const updatedData = {
      status: status,
      notes: notes
    };

    // Updated: Triggering dynamic endpoint route maps safely
    axios.put(`${API_BASE_URL}/api/tickets/${ticketId}`, updatedData)
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

  // Step 3: Handle the DELETE Request Purge Pipeline
  const handleDelete = () => {
    // Inject a native window confirm check to prevent accidental agent clicks
    const confirmPurge = window.confirm(
      "⚠️ Operational Hazard Warning: Are you absolutely certain you want to permanently purge this support record? This action removes the data row entirely from your Supabase PostgreSQL cloud index and cannot be undone."
    );
    
    if (!confirmPurge) return;

    setIsDeleting(true);
    setMessage("Initializing records purge pipeline tracking execution...");

    // Updated: Triggering dynamic HTTP DELETE matching the target architecture
    axios.delete(`${API_BASE_URL}/api/tickets/${ticketId}`)
      .then(res => {
        setMessage("Success! Row completely dropped. Redirecting back to home control panel...");
        setTimeout(() => {
          setIsDeleting(false);
          navigate("/"); // Securely kick back to the operational main board grid
        }, 1500);
      })
      .catch(err => {
        console.error("Network interface error deleting structural index:", err);
        setMessage("Failed to apply destructive action. Verify local express connectivity routing maps.");
        setIsDeleting(false);
      });
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', fontFamily: '"Inter", sans-serif', color: '#4a5568' }}>Loading ticket details from cloud indexes...</div>;
  if (!ticket) return <div style={{ padding: '40px', textAlign: 'center', fontFamily: '"Inter", sans-serif', color: '#c53030' }}>⚠️ Ticket tracking parameter not found.</div>;

  return (
    <div style={{ padding: '24px', fontFamily: '"Inter", sans-serif', maxWidth: '600px', margin: '0 auto', color: '#2d3748' }}>
      
      {/* Return Navigation Anchor link */}
      <div style={{ marginBottom: '16px' }}>
        <Link to="/" style={{ color: '#2b6cb0', textDecoration: 'none', fontSize: '14px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          ← Return to Command Center
        </Link>
      </div>

      {/* Header Info Banner Section */}
      <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>Ticket Deep Dive ({ticket.ticket_id || `#${ticket.id}`})</h2>
      <p style={{ color: '#718096', fontSize: '14px', marginBottom: '24px' }}>Modify live operational attributes, attach administrative troubleshooting notes, and adjust lifecycle flags.</p>
      
      {/* Dynamic Success / Failure Banner notifications */}
      {message && (
        <div style={{ 
          padding: '12px 16px', 
          marginBottom: '20px', 
          backgroundColor: message.includes("Failed") ? '#fff5f5' : '#def7ec', 
          color: message.includes("Failed") ? '#c53030' : '#03543f', 
          borderRadius: '6px', 
          fontSize: '14px', 
          fontWeight: '500', 
          border: message.includes("Failed") ? '1px solid #fed7d7' : '1px solid #bfefed' 
        }}>
          {message}
        </div>
      )}

      {/* --- Ticket Information Display Card --- */}
      <div style={{ backgroundColor: '#f7fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px', fontSize: '14px', lineHeight: '1.6' }}>
        <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: '#4a5568' }}>Customer Name:</strong> {ticket.customer_name}</p>
        <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: '#4a5568' }}>Email Address:</strong> {ticket.customer_email}</p>
        <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: '#4a5568' }}>Subject Title:</strong> {ticket.subject}</p>
        
        {/* Priority Badge Mapping Integration Row */}
        <p style={{ margin: '0 0 14px 0' }}>
          <strong style={{ color: '#4a5568' }}>Priority Matrix Status:</strong>{' '}
          <span style={{ 
            fontSize: '11px', 
            fontWeight: '700', 
            backgroundColor: ticket.priority?.toLowerCase() === 'high' ? '#fed7d7' : ticket.priority?.toLowerCase() === 'low' ? '#e2e8f0' : '#feebc8',
            color: ticket.priority?.toLowerCase() === 'high' ? '#9b2c2c' : ticket.priority?.toLowerCase() === 'low' ? '#4a5568' : '#c05621',
            padding: '4px 10px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'inline-block',
            border: ticket.priority?.toLowerCase() === 'high' ? '1px solid #feb2b2' : ticket.priority?.toLowerCase() === 'low' ? '1px solid #cbd5e0' : '1px solid #fbd38d'
          }}>
            {ticket.priority || 'Medium'}
          </span>
        </p>

        <p style={{ whiteSpace: 'pre-line', margin: '0' }}><strong style={{ color: '#4a5568' }}>Issue Description:</strong><br />{ticket.description}</p>
      </div>

      {/* --- Admin Control Panel Form Actions --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0' }}>Agent Workspace Actions</h3>
        
        {/* Status Dropdown Picker Configuration Container */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>Update Status:</label>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            disabled={isUpdating || isDeleting}
            style={{ 
              padding: '10px 14px', 
              borderRadius: '6px', 
              border: '1px solid #cbd5e0', 
              width: '220px', 
              fontSize: '14px', 
              outline: 'none', 
              backgroundColor: '#fff',
              cursor: isUpdating || isDeleting ? 'not-allowed' : 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              fontWeight: '500'
            }}
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Admin Troubleshooting Textarea Container */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>Troubleshooting Internal Notes:</label>
          <textarea 
            rows="5"
            value={notes} 
            onChange={(e) => setNotes(e.target.value)}
            disabled={isUpdating || isDeleting}
            placeholder="Type private admin notes here regarding steps taken to solve this issue..."
            style={{ width: '100%', padding: '10px 12px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none', fontFamily: 'inherit', lineHeight: '1.4' }}
          />
        </div>

        {/* Combined Layout Flex Row Action Buttons Grid */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
          
          {/* Main Action PUT saving handler logic */}
          <button 
            onClick={handleUpdate}
            disabled={isUpdating || isDeleting}
            style={{ 
              flex: '2',
              minWidth: '200px',
              padding: '12px', 
              backgroundColor: isUpdating ? '#a0aec0' : '#2b6cb0', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: isUpdating || isDeleting ? 'not-allowed' : 'pointer',
              fontWeight: '700',
              fontSize: '15px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => { if(!isDeleting && !isUpdating) e.target.style.backgroundColor = '#2c5282' }}
            onMouseLeave={(e) => { if(!isDeleting && !isUpdating) e.target.style.backgroundColor = '#2b6cb0' }}
          >
            {isUpdating ? "Saving Structural Modifications..." : "Save Ticket Changes"}
          </button>

          {/* Destructive Action DELETE pipeline tracking logic */}
          <button 
            onClick={handleDelete}
            disabled={isUpdating || isDeleting}
            style={{ 
              flex: '1',
              minWidth: '130px',
              padding: '12px', 
              backgroundColor: isDeleting ? '#a0aec0' : '#e53e3e', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: isUpdating || isDeleting ? 'not-allowed' : 'pointer',
              fontWeight: '700',
              fontSize: '15px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => { if(!isDeleting && !isUpdating) e.target.style.backgroundColor = '#c53030' }}
            onMouseLeave={(e) => { if(!isDeleting && !isUpdating) e.target.style.backgroundColor = '#e53e3e' }}
          >
            {isDeleting ? "Purging Row..." : "Delete Ticket"}
          </button>

        </div>

      </div>
    </div>
  );
}