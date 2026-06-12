import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useConfirm } from '../../components/ConfirmModal';
import { toast } from 'react-toastify';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ image: '', label: '', title: '', subtitle: '', cta: 'Shop Now', link: '/products', order: 0, isActive: true });
  const confirm = useConfirm();

  const token = localStorage.getItem('vp_token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchBanners = async () => {
    try {
      const res = await axios.get('/admin/banners', { headers });
      setBanners(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchBanners(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`/admin/banners/${editing}`, form, { headers });
      } else {
        await axios.post('/admin/banners', form, { headers });
      }
      setShowForm(false);
      setEditing(null);
      setForm({ image: '', label: '', title: '', subtitle: '', cta: 'Shop Now', link: '/products', order: 0, isActive: true });
      fetchBanners();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving banner');
    }
  };

  const handleEdit = (b) => {
    setEditing(b._id);
    setForm({ image: b.image, label: b.label, title: b.title, subtitle: b.subtitle, cta: b.cta, link: b.link, order: b.order, isActive: b.isActive });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const ok = await confirm({ title: 'Delete Banner', message: 'Are you sure you want to delete this banner?', type: 'danger' });
    if (!ok) return;
    try {
      await axios.delete(`/admin/banners/${id}`, { headers });
      toast.success('Banner deleted');
      fetchBanners();
    } catch (err) { toast.error('Error'); }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Hero Banners ({banners.length})</h1>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ image: '', label: '', title: '', subtitle: '', cta: 'Shop Now', link: '/products', order: 0, isActive: true }); }}
          style={{ padding: '10px 20px', background: '#c9a96e', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
          {showForm ? 'Cancel' : '+ Add Banner'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 24, borderRadius: 10, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <input placeholder="Image URL (1800x800 recommended)" value={form.image} onChange={e => setForm({...form, image: e.target.value})} required style={inputStyle} />
            <input placeholder="Label (e.g. New Season)" value={form.label} onChange={e => setForm({...form, label: e.target.value})} style={inputStyle} />
            <input placeholder="Title (use \n for line break)" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required style={inputStyle} />
            <input placeholder="Subtitle" value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} style={inputStyle} />
            <input placeholder="CTA Button Text" value={form.cta} onChange={e => setForm({...form, cta: e.target.value})} style={inputStyle} />
            <input placeholder="Link (e.g. /products)" value={form.link} onChange={e => setForm({...form, link: e.target.value})} style={inputStyle} />
            <input placeholder="Order (1, 2, 3...)" type="number" value={form.order} onChange={e => setForm({...form, order: Number(e.target.value)})} style={inputStyle} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} />
              Active
            </label>
          </div>
          <button type="submit" style={{ marginTop: 16, padding: '10px 24px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
            {editing ? 'Update' : 'Create'}
          </button>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {banners.map((b) => (
          <div key={b._id} style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
              <img src={b.image} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', color: '#fff' }}>
                <div style={{ fontSize: 11, opacity: 0.8 }}>{b.label}</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{b.title?.replace(/\\n/g, ' ')}</div>
              </div>
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ fontSize: 12, color: '#666' }}>{b.subtitle}</div>
              <div style={{ fontSize: 12, marginTop: 6, display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ color: b.isActive ? '#27ae60' : '#e74c3c' }}>{b.isActive ? '● Active' : '● Inactive'}</span>
                <span style={{ color: '#888' }}>Order: {b.order}</span>
                <span style={{ color: '#888' }}>→ {b.link}</span>
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                <button onClick={() => handleEdit(b)} style={btnStyle}>Edit</button>
                <button onClick={() => handleDelete(b._id)} style={{ ...btnStyle, background: '#e74c3c' }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, outline: 'none' };
const btnStyle = { padding: '5px 12px', background: '#c9a96e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 };
