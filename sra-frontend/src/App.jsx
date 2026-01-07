import { useEffect, useState } from 'react'

function App() {
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');
  const [newName, setNewName] = useState('');
  const [newQty, setNewQty] = useState(1);
  const [newSpec, setNewSpec] = useState('24GB VRAM');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAllocating, setIsAllocating] = useState(null);

  // 1. Unified Dashboard Sync
  const loadData = async () => {
    try {
      console.log("Fetching fresh data from backend...");
      const res = await fetch('http://localhost:8080/resources');
      const rData = await res.json();
      setResources(rData);

      const book = await fetch('http://localhost:8080/bookings');
      const bData = await book.json();
      console.log("Bookings received:", bData);
      setBookings(bData);
    } catch (err) {
      console.error("Dashboard sync failed. Is the Java server running?", err);
    }
  };

  useEffect(() => { loadData(); }, []);

  // 2. Resource Deployment
  const handleAddResource = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:8080/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `${newName} (${newSpec})`, quantity: parseInt(newQty), active: true })
      });
      setMessage(`🚀 Infrastructure: Node "${newName}" successfully deployed.`);
      setNewName('');
      loadData();
    } catch (err) {
      setMessage("❌ Error: Could not deploy hardware.");
    }
    setTimeout(() => setMessage(''), 4000);
  };

  // 3. FIXED: Allocation & Log Synchronization
  const handleBooking = async (id) => {
    const target = resources.find(r => r.id === id);
    if (!target || target.quantity <= 0) return;

    setIsAllocating(id);
    console.log(`Starting allocation for Node_${id}...`);

    try {
      // Step A: Send Request to BookingController (matches your DTOs)
      const bRes = await fetch('http://localhost:8080/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ 
          resourceId: Number(id), 
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 7200000).toISOString() // 2-hour window
        })
      });

      if (!bRes.ok) {
        const errText = await bRes.text();
        throw new Error(`Server Error: ${errText}`);
      }

      console.log("Booking created successfully. Updating inventory...");

      // Step B: Update Inventory Stock
      await fetch(`http://localhost:8080/resources/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...target, quantity: target.quantity - 1 })
      });

      // Step C: Force a fresh fetch to populate the Log table and HUD
      await loadData();
      setMessage(`✅ Success: Allocation confirmed for Node_${id}.`);
    } catch (err) {
      console.error("Allocation Flow Failed:", err);
      setMessage(`❌ System Error: Backend rejected the request. Check console (F12).`);
    } finally {
      setIsAllocating(null);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleClearLogs = () => {
    if (window.confirm("⚠️ Wipe activity log?")) {
      setBookings([]);
      setMessage("🧹 System Activity Log cleared locally.");
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const filteredResources = resources.filter(res => res.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{ margin: 0, padding: '40px', fontFamily: '"Inter", sans-serif', backgroundColor: '#f1f5f9', minHeight: '100vh', width: '100vw', position: 'absolute', left: 0, top: 0, boxSizing: 'border-box', color: '#0f172a' }}>
      
      <style>{`
        ::selection { background: #bae6fd; color: #0c4a6e; }
        input, select { color: #1e293b !important; font-weight: 600 !important; }
        .card-anim:hover { transform: translateY(-8px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
      `}</style>

      <header style={{ maxWidth: '1200px', margin: '0 auto 40px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #e2e8f0', paddingBottom: '25px' }}>
        <div>
          <h1 style={{ color: '#1e3a8a', margin: 0, fontSize: '3rem', fontWeight: '900', letterSpacing: '-0.04em' }}>SRA Admin Dashboard</h1>
          <p style={{ color: '#64748b', fontWeight: '600', margin: '8px 0 0 0' }}>Lead Developer: Nabil Umer | Senior Capstone CSS 497</p>
        </div>
        <div style={{ background: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800' }}>● SYSTEM ONLINE</div>
      </header>

      {message && <div style={{ maxWidth: '1200px', margin: '0 auto 25px auto', background: 'white', padding: '20px', borderRadius: '16px', borderLeft: '8px solid #3b82f6', fontWeight: '700', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>{message}</div>}

      {/* 📊 ANALYTICS HUD */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 40px auto' }}>
        <div style={{ display: 'flex', gap: '25px', marginBottom: '20px' }}>
          {[
            { label: 'Nodes', val: resources.length, border: '#3b82f6' },
            { label: 'Allocations', val: bookings.length, border: '#1e3a8a' },
            { label: 'Inventory', val: resources.reduce((acc, res) => acc + (res.quantity || 0), 0), border: '#10b981' }
          ].map((stat, i) => (
            <div key={i} style={{ background: 'white', padding: '30px', borderRadius: '24px', flex: 1, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', textAlign: 'center', borderTop: `6px solid ${stat.border}` }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase' }}>{stat.label}</h4>
              <p style={{ fontSize: '3.2rem', margin: 0, fontWeight: '900', color: '#1e293b' }}>{stat.val}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🛠️ DEPLOYMENT & SEARCH PANEL */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 40px auto', background: 'white', padding: '35px', borderRadius: '24px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' }}>
        <form onSubmit={handleAddResource} style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
          <input type="text" placeholder="Node Name (e.g. NVIDIA H100)" value={newName} onChange={e => setNewName(e.target.value)} style={{ padding: '18px', flex: 2, borderRadius: '14px', border: '2px solid #e2e8f0', background: '#f8fafc' }} required />
          <select value={newSpec} onChange={e => setNewSpec(e.target.value)} style={{ padding: '18px', flex: 1, borderRadius: '14px', border: '2px solid #e2e8f0', background: '#f8fafc' }}>
            <option>24GB VRAM</option><option>48GB VRAM</option><option>80GB VRAM</option>
          </select>
          <button type="submit" style={{ background: '#10b981', color: 'white', border: 'none', padding: '0 40px', borderRadius: '14px', cursor: 'pointer', fontWeight: '800' }}>Deploy Node</button>
        </form>
        <input type="text" placeholder="🔍 Filter infrastructure node list..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0', background: 'white', fontWeight: '600' }} 
        />
      </section>

      {/* 🖥️ HARDWARE GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto 60px auto' }}>
        {filteredResources.map(res => (
          <div key={res.id} className="card-anim" style={{ background: 'white', padding: '40px', borderRadius: '28px', textAlign: 'center', position: 'relative', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: '0.3s' }}>
            <h3 style={{ color: '#1e293b', fontSize: '1.8rem', fontWeight: '900', marginBottom: '8px' }}>{res.name}</h3>
            <p style={{ color: '#64748b', fontSize: '1.2rem', marginBottom: '35px' }}>Stock: <strong>{res.quantity}</strong> units</p>
            <button onClick={() => handleBooking(res.id)} disabled={res.quantity <= 0 || isAllocating === res.id} style={{ background: isAllocating === res.id ? '#93c5fd' : (res.quantity > 0 ? '#1e3a8a' : '#e2e8f0'), color: 'white', border: 'none', padding: '20px', borderRadius: '18px', width: '100%', fontWeight: '800' }}>
              {isAllocating === res.id ? 'Allocating...' : (res.quantity > 0 ? 'Reserve Node' : 'Out of Stock')}
            </button>
          </div>
        ))}
      </div>

      {/* 📜 SYSTEM ACTIVITY LOG: Populated from 'bookings' state */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 80px auto', background: 'white', padding: '40px', borderRadius: '28px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '20px' }}>
          <h3 style={{ margin: 0, fontWeight: '800', fontSize: '1.4rem', color: '#1e293b' }}>System Activity Log</h3>
          <button onClick={handleClearLogs} style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 16px', borderRadius: '10px', fontWeight: '700' }}>🗑️ Clear History</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase' }}>
              <th style={{padding: '15px 20px'}}>Tracking ID</th><th>Status</th><th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? bookings.map(b => (
              <tr key={b.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                <td style={{padding: '20px', fontWeight: '700', color: '#1e3a8a'}}>#ALLOC-{b.id}</td>
                <td><span style={{ color: '#10b981', background: '#ecfdf5', padding: '5px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800' }}>SUCCESS</span></td>
                <td style={{color: '#64748b', fontSize: '0.9rem'}}>{new Date(b.startTime).toLocaleTimeString()}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontStyle: 'italic' }}>
                  No allocations recorded. Reserve a node to generate logs.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  )
}
export default App