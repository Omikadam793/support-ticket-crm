import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateTicket() {
  const navigate = useNavigate();
  
  // Dynamic Base URL configuration tracker
  // Falls back to localhost port 5000 if the environment variable isn't set in your local system
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  
  // Form input fields state
  const [customer, setCustomer] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium"); // State for tracking ticket urgency

  // Operational pipeline feedback states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [apiError, setApiError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");
    setApiError("");

    // Front-end Form Input Validation Error Checks
    if (!customer.trim() || !email.trim() || !title.trim() || !description.trim()) {
      setValidationError("Invalid form data. Please fill out all input parameters completely before submitting.");
      return;
    }

    if (!email.includes("@")) {
      setValidationError("Invalid email formatting. Please enter a qualified email reference link.");
      return;
    }

    // Prepare data keys matching your PostgreSQL database column requirements
    const newTicket = {
      customer_name: customer.trim(),
      customer_email: email.trim(),
      subject: title.trim(),
      description: description.trim(),
      priority: priority // Sending chosen priority flag to express controller
    };

    setIsSubmitting(true);

    // Updated: Pushing payload dynamically using the environment configuration fallback
    axios.post(`${API_BASE_URL}/api/tickets`, newTicket)
      .then(res => {
        setIsSubmitting(false);
        // Navigate securely back to main operational panel on success
        navigate("/");
      })
      .catch(err => {
        console.error("Failed to post payload:", err);
        setApiError("Failed API network request. Secure routing pipelines could not finalize records. Please verify server status.");
        setIsSubmitting(false);
      });
  };

  return (
    <div style={{ maxWidth: '550px', margin: '20px auto', fontFamily: '"Inter", sans-serif', padding: '0 10px', color: '#2d3748' }}>
      <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '6px' }}>Initialize New Support Case</h2>
      <p style={{ color: '#718096', fontSize: '14px', marginBottom: '24px' }}>Log user incoming tickets securely straight down into our core operational indexing service database stack.</p>

      {/* ERROR HANDLER A: Form Field Invalidation Warn Box */}
      {validationError && (
        <div style={{ padding: '12px 16px', backgroundColor: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', borderRadius: '6px', fontSize: '14px', marginBottom: '20px', fontWeight: '500' }}>
          ❌ {validationError}
        </div>
      )}

      {/* ERROR HANDLER B: Server API Endpoint Exception Alert Box */}
      {apiError && (
        <div style={{ padding: '12px 16px', backgroundColor: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', borderRadius: '6px', fontSize: '14px', marginBottom: '20px', fontWeight: '500' }}>
          ⚠️ {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#4a5568' }}>Customer Name:</label>
          <input 
            type="text" 
            value={customer} 
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="e.g. Rahul Sharma"
            disabled={isSubmitting}
            style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#4a5568' }}>Email Address:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. rahul@example.com"
            disabled={isSubmitting}
            style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#4a5568' }}>Subject Title:</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief operational issue summary..."
            disabled={isSubmitting}
            style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none' }}
          />
        </div>

        {/* PRIORITY SELECTION DROPDOWN LAYOUT */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#4a5568' }}>Ticket Priority Level:</label>
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
            disabled={isSubmitting}
            style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none', backgroundColor: '#fff', cursor: 'pointer' }}
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#4a5568' }}>Issue Description:</label>
          <textarea 
            rows="5" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide complete comprehensive troubleshooting context parameters here..."
            disabled={isSubmitting}
            style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{ 
            backgroundColor: isSubmitting ? '#a0aec0' : '#2b6cb0', 
            color: 'white', 
            border: 'none', 
            padding: '12px', 
            borderRadius: '6px', 
            fontWeight: '700', 
            fontSize: '15px', 
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            marginTop: '8px',
            transition: 'background-color 0.2s'
          }}
        >
          {isSubmitting ? "Processing Ticket Payload..." : "Dispatch System Ticket"}
        </button>
      </form>
    </div>
  );
}