import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  // State for storing data from the backend
  const [tickets, setTickets] = useState([]);
  
  // States for handling search inputs and dropdowns
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Step 1: Fetch all tickets from the backend on page load
  useEffect(() => {
    axios.get("https://support-crm-backend.onrender.com/api/tickets")   
       .then(res => {
        setTickets(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch tickets:", err);
      });
  }, []);

  // Step 2: Filter tickets dynamically as user types or clicks
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilter = 
      statusFilter === "all" || ticket.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      <h2>Support Tickets Dashboard</h2>

      {/* --- Search and Filter Controls --- */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search by title or customer..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* --- The Data Display Table --- */}
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '12px' }}>ID</th>
            <th style={{ padding: '12px' }}>Title</th>
            <th style={{ padding: '12px' }}>Customer</th>
            <th style={{ padding: '12px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredTickets.length > 0 ? (
            filteredTickets.map(ticket => (
              <tr key={ticket.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>{ticket.id}</td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{ticket.title}</td>
                <td style={{ padding: '12px' }}>{ticket.customer}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px',
                    backgroundColor: ticket.status === 'open' ? '#ffeec2' : '#d2f8d2',
                    color: ticket.status === 'open' ? '#b7791f' : '#22543d'
                  }}>
                    {ticket.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ padding: '12px', textAlign: 'center', color: '#888' }}>
                No tickets found matching your criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}