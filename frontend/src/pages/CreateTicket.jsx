import { useState } from 'react';
import axios from 'axios';

export default function CreateTicket() {
  // 1. Set up state variables to track every input field live
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  
  // States for tracking user feedback
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // 2. Handle the Form Submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the browser from reloading the entire page

    // Basic validation check
    if (!name || !email || !subject || !description) {
      setIsError(true);
      setMessage("Please fill out all required fields.");
      return;
    }

    // Pack the state variables into a structured object matching what the backend expects
    const ticketData = {
      customer: name, // Maps 'name' to the 'customer' field in your database
      email: email,
      title: subject, // Maps 'subject' to the 'title' field in your database
      description: description,
      status: "open"  // New tickets default to an 'open' status
    };

    // 3. Fire the POST request over to the backend server
    axios.post("https://support-crm-backend.onrender.com/api/tickets", ticketData)      .then((response) => {
        setIsError(false);
        setMessage("Ticket created successfully! Ticket ID: " + response.data.id);
        
        // Clear out the form inputs so the user can type a fresh ticket if they want
        setName("");
        setEmail("");
        setSubject("");
        setDescription("");
      })
      .catch((error) => {
        console.error("Error creating ticket:", error);
        setIsError(true);
        setMessage("Failed to create ticket. Is your backend server running?");
      });
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Submit a New Support Ticket</h2>
      
      {/* --- Success or Error Alert Message Banner --- */}
      {message && (
        <div style={{
          padding: '12px',
          marginBottom: '16px',
          borderRadius: '4px',
          backgroundColor: isError ? '#ffebeb' : '#e6fce6',
          color: isError ? '#cc0000' : '#006600',
          border: isError ? '1px solid #ffcccc' : '1px solid #b3ffb3'
        }}>
          {message}
        </div>
      )}

      {/* --- The Form --- */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Your Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
            placeholder="John Doe"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Email Address:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Subject / Issue Title:</label>
          <input 
            type="text" 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
            placeholder="Screen is broken / Software crashing"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Detailed Description:</label>
          <textarea 
            rows="5"
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
            placeholder="Provide as much details about the issue as possible..."
          />
        </div>

        <button 
          type="submit" 
          style={{ 
            padding: '12px', 
            backgroundColor: '#0066cc', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px' 
          }}
        >
          Submit Ticket
        </button>
      </form>
    </div>
  );
}