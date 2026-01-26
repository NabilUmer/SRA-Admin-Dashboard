import { useEffect, useState } from 'react'

function App() {
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');
  const [newName, setNewName] = useState('');
  const [isAllocating, setIsAllocating] = useState(null);

  const loadData = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/resources');
      const rData = await res.json();
      setResources(rData);
      const book = await fetch('http://localhost:8080/api/bookings');
      const bData = await book.json();
      setBookings(bData);
    } catch (err) { console.error("Sync failed", err); }
  };

  useEffect(() => { loadData(); }, []);

  const handleDeploy = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:8080/api/resources/seed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, quantity: 1 })
    });
    setNewName('');
    loadData();
  };

  const handleBooking = async (id) => {
    setIsAllocating(id);
    const response = await fetch('http://localhost:8080/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        resourceId: id, 
        startTime: new Date().toISOString(), 
        endTime: new Date(Date.now() + 7200000).toISOString() 
      })
    });

    if (response.status === 409) {
      setMessage("?? CONFLICT: Node is already reserved!");
    } else if (response.ok) {
      setMessage("? SUCCESS: Node allocated!");
      loadData();
    }
    setIsAllocating(null);
    setTimeout(() => setMessage(''), 5000);
  };

  const exportToCSV = () => {
    if (bookings.length === 0) return;
    const headers = ["ID", "ResourceID", "Time", "Status"];
    const rows = bookings.map(b => [
      `ALLOC-${b.id}`, 
      b.resourceId, 
      new Date(b.startTime).toLocaleString("en-US", {timeZone: "America/Los_Angeles"}), 
      "CONFIRMED"
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SRA_Audit_Log.csv`;
    link.click();
  };

  return (
    <div style={{ margin: 0, padding: '40px', fontFamily: '"Inter", sans-serif', backgroundColor: '#0f172a', minHeight: '100vh', width: '100vw', position: 'absolute', left: 0, top: 0, boxSizing: 'border-box', color: '#f8fafc' }}>
      <header style={{ maxWidth: '1200px', margin: '0 auto 40px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #1e293b', paddingBottom: '25px' }}>
        <div>
          <h1 style={{ color: '#60a5fa', margin: 0, fontSize: '3rem', fontWeight: '900', letterSpacing: '-0.04em' }}>SRA Admin Dashboard</h1>
          <p style={{ color: '#94a3b8', fontWeight: '600', margin: '8px 0 0 0' }}>Week 4: Administrative Observability | Nabil Umer</p>
        </div>
        <button onClick={exportToCSV} style={{ background: '#10b981', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: '800' }}>Export Audit Log</button>
      </header>

      {message && <div style={{ maxWidth: '1200px', margin: '0 auto 25px auto', background: '#1e293b', padding: '20px', borderRadius: '16px', borderLeft: '8px solid #3b82f6', fontWeight: '700' }}>{message}</div>}

      <section style={{ maxWidth: '1200px', margin: '0 auto 40px auto' }}>
        <div style={{ display: 'flex', gap: '25px' }}>
          {[{ label: 'NODES', val: resources.length }, { label: 'ALLOCATIONS', val: bookings.length }, { label: 'INVENTORY', val: resources.reduce((acc, res) => acc + (res.quantity || 0), 0) }].map((stat, i) => (
            <div key={i} style={{ background: '#1e293b', padding: '30px', borderRadius: '24px', flex: 1, textAlign: 'center', borderTop: '6px solid #3b82f6' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '800' }}>{stat.label}</h4>
              <p style={{ fontSize: '3.2rem', margin: 0, fontWeight: '900' }}>{stat.val}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: '1200px', margin: '0 auto 40px auto', background: '#1e293b', padding: '35px', borderRadius: '24px' }}>
        <form onSubmit={handleDeploy} style={{ display: 'flex', gap: '20px' }}>
          <input type="text" placeholder="GPU Name (e.g. NVIDIA RTX 4090)" value={newName} onChange={e => setNewName(e.target.value)} style={{ padding: '18px', flex: 2, borderRadius: '14px', border: 'none', background: '#0f172a', color: 'white' }} required />
          <button type="submit" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0 40px', borderRadius: '14px', cursor: 'pointer', fontWeight: '800' }}>Deploy Node</button>
        </form>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto 60px auto' }}>
        {resources.map(res => {
          const isBusy = bookings.some(b => b.resourceId === res.id);
          return (
            <div key={res.id} style={{ background: '#1e293b', padding: '40px', borderRadius: '28px', textAlign: 'center', border: isBusy ? '2px solid #ef4444' : '2px solid #10b981' }}>
              <span style={{ color: isBusy ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>{isBusy ? '? BUSY' : '? AVAILABLE'}</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '900', margin: '15px 0' }}>{res.name}</h3>
              <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '35px' }}>Stock: <strong>{isBusy ? 0 : res.quantity}</strong> units</p>
              <button onClick={() => handleBooking(res.id)} disabled={isBusy || isAllocating === res.id} style={{ background: isBusy ? '#475569' : '#1e3a8a', color: 'white', border: 'none', padding: '20px', borderRadius: '18px', width: '100%', fontWeight: '800', cursor: isBusy ? 'not-allowed' : 'pointer' }}>
                {isBusy ? 'Reserved' : 'Reserve Node'}
              </button>
            </div>
          );
        })}
      </div>

      <section style={{ maxWidth: '1200px', margin: '0 auto 80px auto', background: '#1e293b', padding: '40px', borderRadius: '28px' }}>
        <h3 style={{ borderBottom: '1px solid #334155', paddingBottom: '20px', marginBottom: '20px' }}>System Activity Log</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ textAlign: 'left', color: '#94a3b8' }}><th>Tracking ID</th><th>Status</th><th>Timestamp (Local)</th></tr></thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id} style={{ borderBottom: '1px solid #0f172a' }}>
                <td style={{padding: '20px', fontWeight: 'bold'}}>#ALLOC-{b.id}</td>
                <td><span style={{ color: '#10b981', background: '#064e3b', padding: '5px 12px', borderRadius: '8px' }}>SUCCESS</span></td>
                <td>{new Date(b.startTime).toLocaleString("en-US", {timeZone: "America/Los_Angeles"})}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
export default App;
