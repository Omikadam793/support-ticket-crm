import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [hoveredRowId, setHoveredRowId] = useState(null); // Track mouse position for row highlight

  // Fetch all tickets on component load
  useEffect(() => {
    axios.get("https://support-crm-backend.onrender.com/api/tickets")
      .then(res => {
        setTickets(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  // Filter logic for quick searching
  const filteredTickets = tickets.filter(ticket => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (ticket.customer && ticket.customer.toLowerCase().includes(searchLower)) ||
      (ticket.title && ticket.title.toLowerCase().includes(searchLower)) ||
      (ticket.id && ticket.id.toString().includes(searchLower))
    );
  });

  // Helper function to return beautiful, modern status badge styles
  const getStatusBadgeStyles = (status) => {
    const base = {
      padding: '4px 12px',
      borderRadius: '50px', // Complete round capsule pill
      fontSize: '12px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      display: 'inline-block',
      letterSpacing: '0.5px'
    };

    if (status === 'resolved' || status === 'Closed') {
      return { ...base, backgroundColor: '#def7ec', color: '#03543f' }; // Deep emerald green
    } else if (status === 'pending' || status === 'In Progress') {
      return { ...base, backgroundColor: '#fef3c7', color: '#92400e' }; // Deep amber yellow
    } else {
      return { ...base, backgroundColor: '#e1effe', color: '#1e429f' }; // Corporate indigo blue
    }
  };

  if (loading) return <div style={{ padding: '32px', fontFamily: 'sans-serif', color: '#4a5568' }}>Loading CRM Dashboard...</div>;

  return (
    <div style={{ fontFamily: '"Inter", sans-serif', padding: '10px 0', color: '#2d3748' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '6px' }}>Support Agent Command Center</h2>
      <p style={{ color: '#718096', marginBottom: '24px', fontSize: '14px' }}>Monitor operational metrics, search active support payloads, and modify customer workspace accounts.</p>

      {/* --- Search Filter Controls --- */}
      <div style={{ marginBottom: '24px' }}>
        <input 
          type="text" 
          placeholder="Search by Ticket ID, Customer Name, or Subject..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            padding: '12px 16px', 
            width: '100%', 
            maxWidth: '450px', 
            borderRadius: '6px', 
            border: '1px solid #cbd5e0',
            fontSize: '14px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
        />
      </div>

      {/* --- CRM Metrics Overview Ribbons --- */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <div style={{ padding: '20px', backgroundColor: '#f7fafc', borderRadius: '8px', flex: '1 1 200px', border: '1px solid #e2e8f0', borderLeft: '4px solid #2b6cb0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <strong style={{ color: '#4a5568', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Managed Cases</strong>
          <div style={{ fontSize: '28px', fontWeight: '800', marginTop: '6px', color: '#1a202c' }}>{tickets.length}</div>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#f7fafc', borderRadius: '8px', flex: '1 1 200px', border: '1px solid #e2e8f0', borderLeft: '4px solid #dd6b20', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <strong style={{ color: '#4a5568', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active / Open Tickets</strong>
          <div style={{ fontSize: '28px', fontWeight: '800', marginTop: '6px', color: '#1a202c' }}>
            {tickets.filter(t => t.status !== 'resolved' && t.status !== 'Closed').length}
          </div>
        </div>
      </div>

      {/* --- Tickets Data Table Workspace --- */}
      {filteredTickets.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#718096' }}>
          No matching records located within this data partition.
        </div>
      ) : (
        /* RESPONSIVE DIV CONTAINER WRAPPER */
        <div style={{ 
          width: '100%', 
          overflowX: 'auto', 
          WebkitOverflowScrolling: 'touch', // Smooth touch swiping for mobile devices
          border: '1px solid #e2e8f0', 
          borderRadius: '8px', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' 
        }}>
          <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', backgroundColor: '#ffffff', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #edf2f7' }}>
                <th style={{ padding: '16px', fontWeight: '600', color: '#4a5568' }}>ID</th>
                <th style={{ padding: '16px', fontWeight: '600', color: '#4a5568' }}>Customer</th>
                <th style={{ padding: '16px', fontWeight: '600', color: '#4a5568' }}>Title</th>
                <th style={{ padding: '16px', fontWeight: '600', color: '#4a5568' }}>Status</th>
                <th style={{ padding: '16px', fontWeight: '600', color: '#4a5568', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map(ticket => (
                <tr 
                  key={ticket.id} 
                  onMouseEnter={() => setHoveredRowId(ticket.id)}
                  onMouseLeave={() => setHoveredRowId(null)}
                  style={{ 
                    borderBottom: '1px solid #edf2f7',
                    backgroundColor: hoveredRowId === ticket.id ? '#f8fafc' : '#ffffff', // Dynamic row highlighting
                    transition: 'background-color 0.15s ease'
                  }}
                >
                  <td style={{ padding: '16px', fontWeight: '600', color: '#718096' }}>#{ticket.id}</td>
                  <td style={{ padding: '16px', fontWeight: '500' }}>{ticket.customer}</td>
                  <td style={{ padding: '16px', color: '#4a5568' }}>{ticket.title}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={getStatusBadgeStyles(ticket.status)}>
                      {ticket.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <Link 
                      to={`/ticket/${ticket.id}`} 
                      style={{ 
                        color: '#ffffff', 
                        backgroundColor: '#2b6cb0',
                        textDecoration: 'none', 
                        fontWeight: '600',
                        padding: '6px 14px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        display: 'inline-block',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#2c5282'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#2b6cb0'}
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}