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
        toast.success('Banner updated successfully ✓');
      } else {
        await axios.post('/admin/banners', form, { headers });
        toast.success('Banner created successfully ✓');
      }
      setShowForm(false);
      setEditing(null);
      setForm({ image: '', label: '', title: '', subtitle: '', cta: 'Shop Now', link: '/products', order: 0, isActive: true });
      fetchBanners();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving banner');
    }
  };

  const handleEdit = async (b) => {
    const ok = await confirm({ title: 'Edit Banner', message: `You are about to edit "${b.title || 'this banner'}". Make sure to save your changes.`, type: 'warning' });
    if (!ok) return;
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
      <div className="admin-page-header">
        <h1 className="admin-page-title">Hero Banners <span className="admin-page-count">({banners.length})</span></h1>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ image: '', label: '', title: '', subtitle: '', cta: 'Shop Now', link: '/products', order: 0, isActive: true }); }}
          className={`admin-btn ${showForm ? 'admin-btn-outline' : 'admin-btn-primary'}`}>
          {showForm ? 'Cancel' : '+ Add Banner'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-grid">
            <input className="admin-input" placeholder="Image URL (1800x800 recommended)" value={form.image} onChange={e => setForm({...form, image: e.target.value})} required />
            <input className="admin-input" placeholder="Label (e.g. New Season)" value={form.label} onChange={e => setForm({...form, label: e.target.value})} />
            <input className="admin-input" placeholder="Title (use \n for line break)" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            <input className="admin-input" placeholder="Subtitle" value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} />
            <input className="admin-input" placeholder="CTA Button Text" value={form.cta} onChange={e => setForm({...form, cta: e.target.value})} />
            <input className="admin-input" placeholder="Link (e.g. /products)" value={form.link} onChange={e => setForm({...form, link: e.target.value})} />
            <input className="admin-input" placeholder="Order (1, 2, 3...)" type="number" value={form.order} onChange={e => setForm({...form, order: Number(e.target.value)})} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} />
              Active
            </label>
          </div>
          <button type="submit" className="admin-btn admin-btn-dark" style={{ marginTop: 16 }}>
            {editing ? 'Update' : 'Create'}
          </button>
        </form>
      )}

      <div className="admin-grid-cards">
        {banners.map((b) => (
          <div key={b._id} className="admin-visual-card">
            <div style={{ position: 'relative', height: 140, overflow: 'hidden' }}>
              <img src={b.image} alt={b.title} className="admin-visual-card-img" style={{ height: '100%' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 10, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', color: '#fff' }}>
                {b.label && <div style={{ fontSize: 10, opacity: 0.8 }}>{b.label}</div>}
                <div style={{ fontSize: 14, fontWeight: 700 }}>{b.title?.replace(/\\n/g, ' ')}</div>
              </div>
            </div>
            <div className="admin-visual-card-body">
              {b.subtitle && <div className="admin-visual-card-sub">{b.subtitle}</div>}
              <div style={{ fontSize: 11, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginTop: 4 }}>
                <span style={{ color: b.isActive ? '#27ae60' : '#e74c3c' }}>{b.isActive ? '● Active' : '● Inactive'}</span>
                <span style={{ color: '#888' }}>Order: {b.order}</span>
                <span style={{ color: '#888' }}>→ {b.link}</span>
              </div>
              <div className="admin-visual-card-actions">
                <button onClick={() => handleEdit(b)} className="admin-btn admin-btn-primary admin-btn-sm">Edit</button>
                <button onClick={() => handleDelete(b._id)} className="admin-btn admin-btn-danger admin-btn-sm">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {banners.length === 0 && <div className="admin-empty"><div className="admin-empty-icon">🖼️</div><div className="admin-empty-text">No banners yet</div></div>}
      </div>
    </div>
  );
}
