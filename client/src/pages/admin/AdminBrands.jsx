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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Brands ({brands.length})</h1>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', slug: '', initials: '', logo: '', isActive: true }); }}
          style={{ padding: '10px 20px', background: '#c9a96e', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
          {showForm ? 'Cancel' : '+ Add Brand'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 24, borderRadius: 10, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <input placeholder="Brand Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={inputStyle} />
            <input placeholder="Slug" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} required style={inputStyle} />
            <input placeholder="Initials (e.g. GC)" value={form.initials} onChange={e => setForm({...form, initials: e.target.value})} required style={inputStyle} />
            <input placeholder="Logo URL (optional)" value={form.logo} onChange={e => setForm({...form, logo: e.target.value})} style={inputStyle} />
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

      <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 550 }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '2px solid #eee' }}>
              <th style={thStyle}>Logo</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Slug</th>
              <th style={thStyle}>Initials</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((b) => (
              <tr key={b._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={tdStyle}>
                  {b.logo ? <img src={b.logo} alt="" style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 4 }} /> : <span style={{ fontSize: 18, fontWeight: 700 }}>{b.initials}</span>}
                </td>
                <td style={tdStyle}>{b.name}</td>
                <td style={tdStyle}>{b.slug}</td>
                <td style={tdStyle}>{b.initials}</td>
                <td style={tdStyle}><span style={{ color: b.isActive ? '#27ae60' : '#e74c3c' }}>{b.isActive ? '● Active' : '● Inactive'}</span></td>
                <td style={tdStyle}>
                  <button onClick={() => handleEdit(b)} style={btnStyle}>Edit</button>
                  <button onClick={() => handleDelete(b._id)} style={{ ...btnStyle, background: '#e74c3c', marginLeft: 6 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

const inputStyle = { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, outline: 'none' };
const thStyle = { padding: '12px 10px', textAlign: 'left', fontSize: 12, color: '#666', textTransform: 'uppercase' };
const tdStyle = { padding: '10px' };
const btnStyle = { padding: '5px 12px', background: '#c9a96e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 };
