import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-toastify';

export default function AdminStore() {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    storeName: '',
    address: '',
    phone: '',
    aboutText: '',
    paymentMethods: '',
  });

  const token = localStorage.getItem('vp_token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchStore = async () => {
    try {
      const res = await axios.get('/admin/store', { headers });
      if (res.data) {
        setStore(res.data);
        setForm({
          storeName: res.data.storeName || '',
          address: res.data.address || '',
          phone: res.data.phone || '',
          aboutText: res.data.aboutText || '',
          paymentMethods: (res.data.paymentMethods || []).join(', '),
        });
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchStore(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        paymentMethods: form.paymentMethods.split(',').map(s => s.trim()).filter(Boolean),
      };
      await axios.put('/admin/store', payload, { headers });
      toast.success('Store info updated!');
      fetchStore();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating store info');
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Store Information</h1>

      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 28, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', maxWidth: 600 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Store Name</label>
            <input value={form.storeName} onChange={e => setForm({...form, storeName: e.target.value})} required style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Address</label>
            <textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})} required style={{ ...inputStyle, minHeight: 80 }} />
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>About Text</label>
            <textarea value={form.aboutText} onChange={e => setForm({...form, aboutText: e.target.value})} required style={{ ...inputStyle, minHeight: 100 }} />
          </div>
          <div>
            <label style={labelStyle}>Payment Methods (comma separated)</label>
            <input value={form.paymentMethods} onChange={e => setForm({...form, paymentMethods: e.target.value})} style={inputStyle} />
          </div>
        </div>
        <button type="submit" style={{ marginTop: 20, padding: '12px 28px', background: '#c9a96e', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
          Save Changes
        </button>
      </form>
    </div>
  );
}

const labelStyle = { display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: '#555', textTransform: 'uppercase' };
const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, outline: 'none', boxSizing: 'border-box' };
