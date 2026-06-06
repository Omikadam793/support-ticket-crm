import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null); 
  const [hoveredRowId, setHoveredRowId] = useState(null);

  // Fetch all tickets on component load
  useEffect(() => {
    setLoading(true);
    setApiError(null);
    
    // Pointing to your active local backend engine on port 5000
    axios.get("http://localhost:5000/api/tickets")
      .then(res => {
        setTickets(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setApiError("Failed to fetch tickets from the backend. Ensure your local Node server is running on port 5000.");
        setLoading(false);
      });
  }, []);

  // Filter logic
  const filteredTickets = tickets.filter(ticket => {
    const searchLower = searchTerm.toLowerCase();
    
    // Aligned properties to use database snake_case field keys (customer_name, subject)
    const matchesSearch = 
      (ticket.customer_name && ticket.customer_name.toLowerCase().includes(searchLower)) ||
      (ticket.subject && ticket.subject.toLowerCase().includes(searchLower)) ||
      (ticket.id && ticket.id.toString().includes(searchLower)) ||
      (ticket.ticket_id && ticket.ticket_id.toLowerCase().includes(searchLower));

    let matchesStatus = true;
    if (statusFilter === "open") {
      matchesStatus = ticket.status?.toLowerCase() === "open";
    } else if (statusFilter === "pending") {
      matchesStatus = ticket.status?.toLowerCase() === "pending" || ticket.status?.toLowerCase() === "in progress";
    } else if (statusFilter === "resolved") {
      matchesStatus = ticket.status?.toLowerCase() === "resolved" || ticket.status?.toLowerCase() === "closed";
    }

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeStyles = (status) => {
    const base = { padding: '4px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', display: 'inline-block', letterSpacing: '0.5px' };
    const statusLower = status?.toLowerCase();
    if (statusLower === 'resolved' || statusLower === 'closed') return { ...base, backgroundColor: '#def7ec', color: '#03543f' };
    if (statusLower === 'pending' || statusLower === 'in progress') return { ...base, backgroundColor: '#fef3c7', color: '#92400e' };
    return { ...base, backgroundColor: '#e1effe', color: '#1e429f' };
  };

  // Helper function to stylize custom priority levels dynamically
  const getPriorityBadgeStyles = (priority) => {
    const base = { padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', display: 'inline-block', letterSpacing: '0.5px' };
    const priorityLower = priority?.toLowerCase();
    if (priorityLower === 'high') return { ...base, backgroundColor: '#fed7d7', color: '#9b2c2c', border: '1px solid #feb2b2' };
    if (priorityLower === 'low') return { ...base, backgroundColor: '#e2e8f0', color: '#4a5568', border: '1px solid #cbd5e0' };
    return { ...base, backgroundColor: '#feebc8', color: '#c05621', border: '1px solid #fbd38d' }; // Medium Default
  };

  // ==========================================
  // FEATURE 2 ADDED: REAL-TIME ANALYTICS MATH CALCULATIONS
  // ==========================================
  const totalCount = tickets.length;
  
  const openCount = tickets.filter(t => {
    const s = t.status?.toLowerCase();
    return s !== 'resolved' && s !== 'closed';
  }).length;
  
  const closedCount = totalCount - openCount;

  // Safeguard against Division-by-Zero errors if the database table is clean and empty
  const openPercentage = totalCount > 0 ? Math.round((openCount / totalCount) * 100) : 0;
  const closedPercentage = totalCount > 0 ? Math.round((closedCount / totalCount) * 100) : 0;

  if (loading) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center', fontFamily: '"Inter", sans-serif', color: '#4a5568' }}>
        <div style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #2b6cb0',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px auto'
        }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2d3748' }}>Synchronizing Dashboard Content...</h3>
        <p style={{ color: '#718096', fontSize: '14px', marginTop: '4px' }}>Connecting to local proxy port pipeline...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: '"Inter", sans-serif', padding: '10px 0', color: '#2d3748' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '6px' }}>Support Agent Command Center</h2>
      <p style={{ color: '#718096', marginBottom: '24px', fontSize: '14px' }}>Monitor operational metrics, search active support payloads, and modify customer workspace accounts.</p>

      {apiError && (
        <div style={{ padding: '16px', backgroundColor: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>⚠️ <strong>API Error:</strong> {apiError}</span>
          <button onClick={() => window.location.reload()} style={{ backgroundColor: '#c53030', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Retry Connection</button>
        </div>
      )}

      {/* --- Search & Status Filter Toolbars --- */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Search by Ticket ID, Customer Name, or Subject..." 
          value={searchTerm}
          disabled={!!apiError}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '12px 16px', flex: '1', minWidth: '280px', maxWidth: '450px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', outline: 'none', backgroundColor: apiError ? '#f7fafc' : '#fff' }}
        />

        <div style={{ display: 'flex', gap: '8px', backgroundColor: '#edf2f7', padding: '4px', borderRadius: '8px' }}>
          {[
            { id: 'all', label: 'All Tickets' },
            { id: 'open', label: 'Open' },
            { id: 'pending', label: 'In Progress' },
            { id: 'resolved', label: 'Closed' }
          ].map(tab => (
            <button
              key={tab.id}
              disabled={!!apiError}
              onClick={() => setStatusFilter(tab.id)}
              style={{
                padding: '8px 16px', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                backgroundColor: statusFilter === tab.id ? '#ffffff' : 'transparent',
                color: statusFilter === tab.id ? '#2b6cb0' : '#4a5568',
                boxShadow: statusFilter === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease', opacity: apiError ? 0.5 : 1
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* --- FEATURE 2 UPDATED: DYNAMIC ANALYTICS OVERVIEW RIBBON --- */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        
        {/* Card 1: Total volume reference */}
        <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '10px', flex: '1 1 180px', border: '1px solid #e2e8f0', borderLeft: '5px solid #2b6cb0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <strong style={{ color: '#4a5568', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Managed Cases</strong>
          <div style={{ fontSize: '28px', fontWeight: '800', marginTop: '6px', color: '#1a202c' }}>{totalCount}</div>
        </div>

        {/* Card 2: Active Backlog Tracking + Percentage */}
        <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '10px', flex: '1 1 180px', border: '1px solid #e2e8f0', borderLeft: '5px solid #dd6b20', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <strong style={{ color: '#4a5568', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Backlog</strong>
            <span style={{ fontSize: '12px', color: '#dd6b20', fontWeight: '700', backgroundColor: '#fffaf0', padding: '2px 6px', borderRadius: '4px' }}>{openPercentage}%</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', marginTop: '6px', color: '#1a202c' }}>{openCount} <span style={{ fontSize: '14px', fontWeight: '500', color: '#718096' }}>tickets</span></div>
        </div>

        {/* Card 3: Resolution Success Velocity + Percentage */}
        <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '10px', flex: '1 1 180px', border: '1px solid #e2e8f0', borderLeft: '5px solid #38a169', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <strong style={{ color: '#4a5568', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Resolution Rate</strong>
            <span style={{ fontSize: '12px', color: '#38a169', fontWeight: '700', backgroundColor: '#f0fff4', padding: '2px 6px', borderRadius: '4px' }}>{closedPercentage}%</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', marginTop: '6px', color: '#1a202c' }}>{closedCount} <span style={{ fontSize: '14px', fontWeight: '500', color: '#718096' }}>closed</span></div>
        </div>

      </div>

      {/* --- Tickets Data Table Workspace --- */}
      {apiError ? (
        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f7fafc', borderRadius: '8px', border: '1px solid #edf2f7', color: '#a0aec0' }}>
          Data pipeline inaccessible due to network errors.
        </div>
      ) : tickets.length === 0 ? (
        <div style={{ padding: '60px 24px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '12px', border: '2px dashed #e2e8f0', color: '#4a5568', maxWidth: '600px', margin: '40px auto' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#2d3748' }}>No Tickets Created Yet</h3>
          <p style={{ color: '#718096', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>The database workspace log partition is currently empty. Get started by creating your first support ticket tracking payload.</p>
          <Link to="/create" style={{ backgroundColor: '#2b6cb0', color: 'white', textDecoration: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: '600', fontSize: '14px', display: 'inline-block', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>+ Create First Ticket</Link>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div style={{ padding: '50px 24px', textAlign: 'center', backgroundColor: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#718096', marginTop: '20px' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔍</div>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px', color: '#4a5568' }}>No Matching Tickets Found</h3>
          <p style={{ fontSize: '14px', color: '#718096', maxWidth: '400px', margin: '0 auto 16px auto', lineHeight: '1.4' }}>Your search query "{searchTerm}" or selected status filter did not return any records in this sequence.</p>
          <button onClick={() => { setSearchTerm(""); setStatusFilter("all"); }} style={{ background: 'none', border: 'none', color: '#2b6cb0', fontWeight: '600', fontSize: '14px', cursor: 'pointer', textDecoration: 'underline' }}>Reset All Filters</button>
        </div>
      ) : (
        <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', backgroundColor: '#ffffff', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #edf2f7' }}>
                <th style={{ padding: '16px', fontWeight: '600', color: '#4a5568' }}>Ticket ID</th>
                <th style={{ padding: '16px', fontWeight: '600', color: '#4a5568' }}>Customer</th>
                <th style={{ padding: '16px', fontWeight: '600', color: '#4a5568' }}>Subject</th>
                <th style={{ padding: '16px', fontWeight: '600', color: '#4a5568' }}>Priority</th>
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
                  style={{ borderBottom: '1px solid #edf2f7', backgroundColor: hoveredRowId === ticket.id ? '#f8fafc' : '#ffffff', transition: 'background-color 0.15s ease' }}
                >
                  <td style={{ padding: '16px', fontWeight: '600', color: '#718096' }}>{ticket.ticket_id || `#${ticket.id}`}</td>
                  <td style={{ padding: '16px', fontWeight: '500' }}>{ticket.customer_name}</td>
                  <td style={{ padding: '16px', color: '#4a5568' }}>{ticket.subject}</td>
                  
                  <td style={{ padding: '16px' }}>
                    <span style={getPriorityBadgeStyles(ticket.priority)}>{ticket.priority || 'Medium'}</span>
                  </td>

                  <td style={{ padding: '16px' }}>
                    <span style={getStatusBadgeStyles(ticket.status)}>{ticket.status}</span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <Link 
                      to={`/ticket/${ticket.id}`} 
                      style={{ color: '#ffffff', backgroundColor: '#2b6cb0', textDecoration: 'none', fontWeight: '600', padding: '6px 14px', borderRadius: '4px', fontSize: '13px', display: 'inline-block', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'background-color 0.2s' }}
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