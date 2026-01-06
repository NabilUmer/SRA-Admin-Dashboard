import { useEffect, useState } from 'react'

function App() {
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');
  const [newName, setNewName] = useState('');
  const [newQty, setNewQty] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = () => {
    fetch('http://localhost:8080/resources').then(res => res.json()).then(setResources);
    fetch('http://localhost:8080/bookings').then(res => res.json()).then(setBookings).catch(() => {});
  };

  useEffect(() => { loadData(); }, []);

  const handleAddResource = (e) => {
    e.preventDefault();
    fetch('http://localhost:8080/resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, quantity: parseInt(newQty), active: true })
    }).then(() => {
      setMessage(`Deployed ${newName} successfully!`);
      setNewName('');
      loadData();
      setTimeout(() => setMessage(''), 4000);
    });
  };

  const handleBooking = (id) => {
    fetch('http://localhost:8080/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resourceId: id, startTime: new Date().toISOString(), endTime: new Date(Date.now() + 7200000).toISOString() })
    }).then(() => { 
      setMessage("Reservation confirmed."); 
      loadData(); 
      setTimeout(() => setMessage(''), 4000);
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Confirm decommissioning?")) {
      fetch(`http://localhost:8080/resources/${id}`, { method: 'DELETE' }).then(() => {
        setMessage("Resource removed.");
        loadData();
        setTimeout(() => setMessage(''), 4000);
      });
    }
  };

  // NEW: Clear History Function
  const clearHistory = () => {
    if (window.confirm("Wipe all reservation logs? This cannot be undone.")) {
      // Note: You would need a DELETE endpoint in your BookingController to make this persistent
      setBookings([]);
      setMessage("Activity log cleared.");
    }
  };

  const filteredResources = resources.filter(res => 
    res.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statCardStyle = {
    background: 'white', padding: '20px', borderRadius: '12px', flex: 1,
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)', textAlign: 'center', borderBottom: '4px solid #004a99'
  };

  return (
    <div style={{ margin: 0, padding: '40px', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh', width: '100vw', position: 'absolute', left: 0, top: 0, boxSizing: 'border-box' }}>
      
      <header style={{ maxWidth: '1200px', margin: '0 auto 40px auto', borderBottom: '3px solid #004a99', paddingBottom: '20px' }}>
        <h1 style={{ color: '#004a99', margin: 0 }}>SRA Admin Dashboard</h1>
        <p>User: Nabil Umer | UW Bothell CSS 497</p>
      </header>

      {message && (
        <div style={{ maxWidth: '1200px', margin: '0 auto 20px auto', background: '#d4edda', color: '#155724', padding: '15px', borderRadius: '8px', border: '1px solid #c3e6cb', fontWeight: 'bold' }}>
          {message}
        </div>
      )}

      {/* 📊 ANALYTICS BAR (Now with safety checks for 0) */}
      <section style={{ display: 'flex', gap: '20px', maxWidth: '1200px', margin: '0 auto 40px auto' }}>
        <div style={statCardStyle}>
          <h4 style={{margin: '0 0 10px 0', color: '#666'}}>Total Resources</h4>
          <p style={{fontSize: '2.2rem', margin: 0, fontWeight: 'bold'}}>{resources.length || 0}</p>
        </div>
        <div style={statCardStyle}>
          <h4 style={{margin: '0 0 10px 0', color: '#666'}}>Active Bookings</h4>
          <p style={{fontSize: '2.2rem', margin: 0, fontWeight: 'bold', color: '#004a99'}}>{bookings.length || 0}</p>
        </div>
        <div style={statCardStyle}>
          <h4 style={{margin: '0 0 10px 0', color: '#666'}}>Total Units</h4>
          <p style={{fontSize: '2.2rem', margin: 0, fontWeight: 'bold'}}>{resources.reduce((acc, res) => acc + (res.quantity || 0), 0)}</p>
        </div>
      </section>

      {/* 🛠️ ADMIN PANEL */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 30px auto', background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h3 style={{marginTop: 0, borderLeft: '4px solid #28a745', paddingLeft: '15px'}}>+ Register New Infrastructure</h3>
        <form onSubmit={handleAddResource} style={{ display: 'flex', gap: '20px' }}>
          <input type="text" placeholder="Resource Name (e.g. NVIDIA H100)" value={newName} onChange={e => setNewName(e.target.value)} style={{ padding: '12px', flex: 1, borderRadius: '6px', border: '1px solid #ddd' }} required />
          <input type="number" value={newQty} onChange={e => setNewQty(e.target.value)} style={{ padding: '12px', width: '80px', borderRadius: '6px', border: '1px solid #ddd' }} />
          <button type="submit" style={{ background: '#28a745', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Deploy Resource</button>
        </form>
      </section>

      {/* 🔍 SEARCH BAR */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 20px auto' }}>
        <input 
          type="text" 
          placeholder="🔍 Search Inventory (e.g. NVIDIA)..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '15px', borderRadius: '8px', border: 'none', background: '#2d2d3a', color: 'white', fontSize: '1rem', boxSizing: 'border-box' }} 
        />
      </div>

      {/* 🖥️ INVENTORY GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        {filteredResources.map(res => (
          <div key={res.id} style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', textAlign: 'center', position: 'relative' }}>
            <button onClick={() => handleDelete(res.id)} style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '1.2rem' }}>🗑️</button>
            <h3 style={{ color: '#333', fontSize: '1.5rem' }}>{res.name}</h3>
            <p style={{fontSize: '1.2rem'}}>Available: <strong>{res.quantity}</strong></p>
            <button onClick={() => handleBooking(res.id)} style={{ background: '#004a99', color: 'white', border: 'none', padding: '15px', borderRadius: '8px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}>Reserve Now</button>
          </div>
        ))}
      </div>

      {/* 📜 ACTIVITY LOG TABLE */}
      <section style={{ maxWidth: '1200px', margin: '50px auto', background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{marginTop: 0}}>📜 Real-Time Activity Log</h3>
            <button onClick={clearHistory} style={{ background: 'none', border: '1px solid #dc3545', color: '#dc3545', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Clear Logs</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee', color: '#666' }}>
              <th style={{padding: '12px'}}>Booking ID</th>
              <th>Resource ID</th>
              <th>Status</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                <td style={{padding: '12px'}}>#{b.id}</td>
                <td>Resource #{b.resourceId}</td>
                <td style={{ color: '#28a745', fontWeight: 'bold' }}>Confirmed</td>
                <td style={{color: '#999', fontSize: '0.9rem'}}>{new Date().toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
export default App