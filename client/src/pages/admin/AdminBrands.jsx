import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useConfirm } from '../../components/ConfirmModal';
import { toast } from 'react-toastify';

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', initials: '', logo: '', isActive: true });
  const confirm = useConfirm();

  const token = localStorage.getItem('vp_token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchBrands = async () => {
    try {
      const res = await axios.get('/admin/brands', { headers });
      setBrands(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchBrands(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`/admin/brands/${editing}`, form, { headers });
        toast.success('Brand updated successfully ✓');
      } else {
        await axios.post('/admin/brands', form, { headers });
        toast.success('Brand created successfully ✓');
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', slug: '', initials: '', logo: '', isActive: true });
      fetchBrands();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving brand');
    }
  };

  const handleEdit = async (b) => {
    const ok = await confirm({ title: 'Edit Brand', message: `You are about to edit "${b.name}". Make sure to save your changes.`, type: 'warning' });
    if (!ok) return;
    setEditing(b._id);
    setForm({ name: b.name, slug: b.slug, initials: b.initials, logo: b.logo || '', isActive: b.isActive });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const ok = await confirm({ title: 'Delete Brand', message: 'Are you sure you want to delete this brand?', type: 'danger' });
    if (!ok) return;
    try {
      await axios.delete(`/admin/brands/${id}`, { headers });
      toast.success('Brand deleted');
      fetchBrands();
    } catch (err) { toast.error('Error deleting'); }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Brands <span className="admin-page-count">({brands.length})</span></h1>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', slug: '', initials: '', logo: '', isActive: true }); }}
          className={`admin-btn ${showForm ? 'admin-btn-outline' : 'admin-btn-primary'}`}>
          {showForm ? 'Cancel' : '+ Add Brand'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-grid">
            <input className="admin-input" placeholder="Brand Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <input className="admin-input" placeholder="Slug" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} required />
            <input className="admin-input" placeholder="Initials (e.g. GC)" value={form.initials} onChange={e => setForm({...form, initials: e.target.value})} required />
            <input className="admin-input" placeholder="Logo URL (optional)" value={form.logo} onChange={e => setForm({...form, logo: e.target.value})} />
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

      {/* Mobile Card List */}
      <div className="admin-card-list">
        {brands.map((b) => (
          <div key={b._id} className="admin-item-card">
            <div className="admin-item-card-row">
              <div style={{ width: 40, height: 40, borderRadius: 8, background: '#f5f0e8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {b.logo ? <img src={b.logo} alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} /> : <span style={{ fontSize: 14, fontWeight: 700, color: '#c9a96e' }}>{b.initials}</span>}
              </div>
              <div className="admin-item-card-body">
                <div className="admin-item-card-title">{b.name}</div>
                <div className="admin-item-card-subtitle">/{b.slug} • {b.initials}</div>
                <span style={{ fontSize: 11, fontWeight: 600, color: b.isActive ? '#27ae60' : '#e74c3c', marginTop: 4, display: 'inline-block' }}>
                  {b.isActive ? '● Active' : '● Inactive'}
                </span>
              </div>
            </div>
            <div className="admin-item-card-actions">
              <button onClick={() => handleEdit(b)} className="admin-btn admin-btn-primary admin-btn-sm" style={{ flex: 1 }}>Edit</button>
              <button onClick={() => handleDelete(b._id)} className="admin-btn admin-btn-danger admin-btn-sm" style={{ flex: 1 }}>Delete</button>
            </div>
          </div>
        ))}
        {brands.length === 0 && <div className="admin-empty"><div className="admin-empty-icon">🏷️</div><div className="admin-empty-text">No brands yet</div></div>}
      </div>

      {/* Desktop Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Logo</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Initials</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((b) => (
              <tr key={b._id}>
                <td>
                  {b.logo ? <img src={b.logo} alt="" style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 4 }} /> : <span style={{ fontSize: 16, fontWeight: 700 }}>{b.initials}</span>}
                </td>
                <td style={{ fontWeight: 600 }}>{b.name}</td>
                <td>{b.slug}</td>
                <td>{b.initials}</td>
                <td><span style={{ color: b.isActive ? '#27ae60' : '#e74c3c' }}>{b.isActive ? '● Active' : '● Inactive'}</span></td>
                <td>
                  <button onClick={() => handleEdit(b)} className="admin-btn admin-btn-primary admin-btn-sm">Edit</button>
                  <button onClick={() => handleDelete(b._id)} className="admin-btn admin-btn-danger admin-btn-sm" style={{ marginLeft: 6 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
