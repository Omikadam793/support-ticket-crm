import TicketDetail from './pages/Home';

export default function App() {
  return (
    <div>
      <nav style={{ padding: '16px', backgroundColor: '#333', color: 'white', marginBottom: '20px' }}>
        <strong>Support CRM Dashboard</strong>
      </nav>
      {/* Switch from <CreateTicket /> back to <Home /> */}
      <TicketDetail />
    </div>
  );
}