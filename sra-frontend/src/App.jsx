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

  const handleBooking = (id) => {
    const target = resources.find(r => r.id === id);
    if (!target || target.quantity <= 0) return;

    fetch('http://localhost:8080/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resourceId: id, startTime: new Date().toISOString(), endTime: new Date(Date.now() + 7200000).toISOString() })
    }).then(() => {
      fetch(`http://localhost:8080/resources/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...target, quantity: target.quantity - 1 })
      }).then(() => {
        setMessage(`Success: ${target.name} unit reserved!`);
        loadData();
        setTimeout(() => setMessage(''), 3000);
      });
    });
  };

  const filteredResources = resources.filter(res => 
    res.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ 
      margin: 0, padding: '40px', fontFamily: '"Inter", "Segoe UI", sans-serif', 
      backgroundColor: '#f1f5f9', minHeight: '100vh', width: '100vw', 
      position: 'absolute', left: 0, top: 0, boxSizing: 'border-box', color: '#0f172a' 
    }}>
      
      {/* 🛠️ GLOBAL UI REFINEMENTS */}
      <style>{`
        ::selection { background: #bae6fd; color: #0c4a6e; }
        .card-hover:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); }
        .btn-active:active { transform: scale(0.98); }
        input::placeholder { color: #94a3b8; }
      `}</style>

      <header style={{ maxWidth: '1200px', margin: '0 auto 40px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ color: '#1e3a8a', margin: 0, fontSize: '2.8rem', fontWeight: '800', letterSpacing: '-0.02em' }}>SRA Admin Dashboard</h1>
          <p style={{ color: '#64748b', fontWeight: '600', margin: '5px 0 0 0' }}>Resource Allocation System | <span style={{color: '#004a99'}}>UW Bothell CSS 497</span></p>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#94a3b8' }}>
            System Status: <span style={{color: '#10b981', fontWeight: 'bold'}}>ONLINE</span>
        </div>
      </header>

      {message && (
        <div style={{ 
          maxWidth: '1200px', margin: '0 auto 25px auto', background: '#ecfdf5', color: '#065f46', 
          padding: '16px 24px', borderRadius: '12px', borderLeft: '6px solid #10b981', fontWeight: '600',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', animation: 'fadeIn 0.5s'
        }}>
          {message}
        </div>
      )}

      {/* 📊 ANALYTICS HUD */}
      <section style={{ display: 'flex', gap: '25px', maxWidth: '1200px', margin: '0 auto 40px auto' }}>
        {[
          { label: 'Total Resources', val: resources.length, icon: '📦', color: '#3b82f6' },
          { label: 'Active Bookings', val: bookings.length, icon: '⚡', color: '#1e3a8a' },
          { label: 'Total Inventory', val: resources.reduce((acc, res) => acc + (res.quantity || 0), 0), icon: '🏢', color: '#10b981' }
        ].map((stat, i) => (
          <div key={i} className="card-hover" style={{ 
            background: 'white', padding: '28px', borderRadius: '20px', flex: 1, transition: '0.3s',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', textAlign: 'center', borderTop: `6px solid ${stat.color}` 
          }}>
            <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
            <h4 style={{ margin: '10px 0 5px 0', color: '#64748b', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase' }}>{stat.label}</h4>
            <p style={{ fontSize: '3rem', margin: 0, fontWeight: '900', color: '#1e293b' }}>{stat.val || 0}</p>
          </div>
        ))}
      </section>

      {/* 🛠️ QUICK DEPLOY PANEL */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 35px auto', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', padding: '30px', borderRadius: '24px', border: '1px solid white', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
        <h3 style={{ marginTop: 0, color: '#0f172a', fontSize: '1.2rem', fontWeight: '700' }}>🚀 Deploy New Infrastructure</h3>
        <div style={{ display: 'flex', gap: '15px' }}>
          <input type="text" placeholder="Hardware Name (e.g. NVIDIA RTX 4090)" value={newName} onChange={e => setNewName(e.target.value)} 
            style={{ padding: '16px', flex: 1, borderRadius: '14px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' }} />
          <input type="number" value={newQty} onChange={e => setNewQty(e.target.value)} 
            style={{ padding: '16px', width: '100px', borderRadius: '14px', border: '1px solid #e2e8f0', fontSize: '1rem' }} />
          <button className="btn-active" style={{ background: '#10b981', color: 'white', border: 'none', padding: '0 35px', borderRadius: '14px', cursor: 'pointer', fontWeight: '700', fontSize: '1rem' }}>Deploy</button>
        </div>
      </section>

      {/* 🔍 THE IMPROVED SEARCH BAR */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 35px auto', position: 'relative' }}>
        <span style={{ position: 'absolute', left: '20px', top: '18px', fontSize: '1.2rem' }}>🔍</span>
        <input type="text" placeholder="Filter hardware by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            width: '100%', padding: '20px 20px 20px 55px', borderRadius: '18px', border: '1px solid #cbd5e1', 
            background: 'white', fontSize: '1.1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.03)',
            transition: '0.3s', color: '#1e293b', fontWeight: '500'
          }} 
        />
      </div>

      {/* 🖥️ INVENTORY GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        {filteredResources.map(res => (
          <div key={res.id} className="card-hover" style={{ 
            background: 'white', padding: '35px', borderRadius: '24px', transition: '0.3s',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', textAlign: 'center', position: 'relative', border: '1px solid #f1f5f9' 
          }}>
            {/* DYNAMIC STATUS BADGE */}
            <div style={{
              position: 'absolute', top: '20px', left: '20px', padding: '6px 14px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '800',
              backgroundColor: res.quantity > 0 ? '#dcfce7' : '#fee2e2', color: res.quantity > 0 ? '#166534' : '#991b1b',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              <span style={{ height: '8px', width: '8px', borderRadius: '50%', backgroundColor: res.quantity > 0 ? '#22c55e' : '#ef4444' }}></span>
              {res.quantity > 0 ? 'AVAILABLE' : 'ALLOCATED'}
            </div>

            <h3 style={{ color: '#1e293b', fontSize: '1.6rem', fontWeight: '800', marginBottom: '8px', marginTop: '15px' }}>{res.name}</h3>
            <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500', marginBottom: '30px' }}>Current Stock: <strong style={{color: '#0f172a'}}>{res.quantity}</strong> units</p>
            
            <button 
              onClick={() => handleBooking(res.id)} 
              disabled={res.quantity <= 0}
              className="btn-active"
              style={{ 
                background: res.quantity > 0 ? 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)' : '#cbd5e1', 
                color: 'white', border: 'none', padding: '18px', borderRadius: '16px', 
                cursor: res.quantity > 0 ? 'pointer' : 'not-allowed', width: '100%', 
                fontWeight: '700', fontSize: '1.05rem', boxShadow: '0 4px 10px rgba(30, 58, 138, 0.2)'
              }}
            >
              {res.quantity > 0 ? 'Reserve Hardware' : 'Out of Stock'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
export default App