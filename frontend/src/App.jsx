import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CreateTicket from './pages/CreateTicket';
import TicketDetail from './pages/TicketDetail';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ fontFamily: 'sans-serif' }}>
        {/* --- Global Navigation Bar --- */}
        <nav style={{ 
          padding: '16px 24px', 
          backgroundColor: '#2b6cb0', 
          color: 'white', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <strong style={{ fontSize: '20px' }}>⚡ Support CRM Portal</strong>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Dashboard</Link>
            <Link to="/create" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>+ New Ticket</Link>
          </div>
        </nav>

        {/* --- Page Router Switchboard --- */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateTicket />} />
            <Route path="/ticket/:id" element={<TicketDetail />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}