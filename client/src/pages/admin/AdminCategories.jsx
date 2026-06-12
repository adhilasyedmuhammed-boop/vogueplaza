import { useState, useEffect } from 'react';
import axios from '../../api/axios';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', image: '', isActive: true });

  const token = localStorage.getItem('vp_token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/admin/categories', { headers });
      setCategories(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`/admin/categories/${editing}`, form, { headers });
      } else {
        await axios.post('/admin/categories', form, { headers });
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', slug: '', image: '', isActive: true });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving category');
    }
  };

  const handleEdit = (c) => {
    setEditing(c._id);
    setForm({ name: c.name, slug: c.slug, image: c.image, isActive: c.isActive });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await axios.delete(`/admin/categories/${id}`, { headers });
      fetchCategories();
    } catch (err) { alert('Error deleting'); }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Categories ({categories.length})</h1>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', slug: '', image: '', isActive: true }); }}
          style={{ padding: '10px 20px', background: '#c9a96e', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
          {showForm ? 'Cancel' : '+ Add Category'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 24, borderRadius: 10, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <input placeholder="Category Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={inputStyle} />
            <input placeholder="Slug (e.g. womenswear)" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} required style={inputStyle} />
            <input placeholder="Image URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})} required style={inputStyle} />
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {categories.map((c) => (
          <div key={c._id} style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <img src={c.image} alt={c.name} style={{ width: '100%', height: 130, objectFit: 'cover' }} />
            <div style={{ padding: 14 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>/{c.slug}</div>
              <div style={{ fontSize: 12, marginTop: 6, color: c.isActive ? '#27ae60' : '#e74c3c' }}>
                {c.isActive ? '● Active' : '● Inactive'}
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                <button onClick={() => handleEdit(c)} style={btnStyle}>Edit</button>
                <button onClick={() => handleDelete(c._id)} style={{ ...btnStyle, background: '#e74c3c' }}>Delete</button>
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
