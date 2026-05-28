import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

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

  // CRITICAL FIX: Define filteredTickets here so the component can read it below
  const filteredTickets = tickets.filter(ticket => {
    const searchLower = searchTerm.toLowerCase();
    return (
      ticket.customer.toLowerCase().includes(searchLower) ||
      ticket.title.toLowerCase().includes(searchLower) ||
      ticket.id.toString().includes(searchLower)
    );
  });

  if (loading) return <div style={{ padding: '24px' }}>Loading CRM Dashboard...</div>;

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h2>Support Agent Command Center</h2>

      {/* --- Search Filter Controls --- */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search by Ticket ID, Customer Name, or Subject..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px', width: '100%', maxWidth: '400px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      {/* --- CRM Metrics Overview Ribbons --- */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
        <div style={{ padding: '16px', backgroundColor: '#ebf8ff', borderRadius: '6px', flex: 1, borderLeft: '4px solid #3182ce' }}>
          <strong>Total Managed Cases</strong>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '4px' }}>{tickets.length}</div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#fffaf0', borderRadius: '6px', flex: 1, borderLeft: '4px solid #dd6b20' }}>
          <strong>Active / Open Tickets</strong>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '4px' }}>
            {tickets.filter(t => t.status !== 'resolved').length}
          </div>
        </div>
      </div>

      {/* --- Tickets Data Table Workspace --- */}
      {filteredTickets.length === 0 ? (
        <p>No matching tickets found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>ID</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Customer</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Title</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Status</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map(ticket => (
              <tr key={ticket.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>#{ticket.id}</td>
                <td style={{ padding: '12px' }}>{ticket.customer}</td>
                <td style={{ padding: '12px' }}>{ticket.title}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: ticket.status === 'resolved' ? '#e6fce6' : '#fff3cd',
                    color: ticket.status === 'resolved' ? '#006600' : '#856404'
                  }}>{ticket.status}</span>
                </td>
                <td style={{ padding: '12px' }}>
                  <Link 
                    to={`/ticket/${ticket.id}`} 
                    style={{ 
                      color: '#2b6cb0', 
                      textDecoration: 'none', 
                      fontWeight: 'bold',
                      border: '1px solid #2b6cb0',
                      padding: '4px 8px',
                      borderRadius: '4px'
                    }}
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}