import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useConfirm } from '../../components/ConfirmModal';
import { toast } from 'react-toastify';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', image: '', isActive: true });
  const confirm = useConfirm();

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
        toast.success('Category updated successfully ✓');
      } else {
        await axios.post('/admin/categories', form, { headers });
        toast.success('Category created successfully ✓');
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', slug: '', image: '', isActive: true });
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving category');
    }
  };

  const handleEdit = async (c) => {
    const ok = await confirm({ title: 'Edit Category', message: `You are about to edit "${c.name}". Make sure to save your changes.`, type: 'warning' });
    if (!ok) return;
    setEditing(c._id);
    setForm({ name: c.name, slug: c.slug, image: c.image, isActive: c.isActive });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const ok = await confirm({ title: 'Delete Category', message: 'Are you sure you want to delete this category?', type: 'danger' });
    if (!ok) return;
    try {
      await axios.delete(`/admin/categories/${id}`, { headers });
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) { toast.error('Error deleting'); }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Categories <span className="admin-page-count">({categories.length})</span></h1>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', slug: '', image: '', isActive: true }); }}
          className={`admin-btn ${showForm ? 'admin-btn-outline' : 'admin-btn-primary'}`}>
          {showForm ? 'Cancel' : '+ Add Category'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-grid">
            <input className="admin-input" placeholder="Category Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <input className="admin-input" placeholder="Slug (e.g. womenswear)" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} required />
            <input className="admin-input" placeholder="Image URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})} required />
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
        {categories.map((c) => (
          <div key={c._id} className="admin-visual-card">
            <img src={c.image} alt={c.name} className="admin-visual-card-img" />
            <div className="admin-visual-card-body">
              <div className="admin-visual-card-title">{c.name}</div>
              <div className="admin-visual-card-sub">/{c.slug}</div>
              <div style={{ fontSize: 12, marginTop: 4, color: c.isActive ? '#27ae60' : '#e74c3c' }}>
                {c.isActive ? '● Active' : '● Inactive'}
              </div>
              <div className="admin-visual-card-actions">
                <button onClick={() => handleEdit(c)} className="admin-btn admin-btn-primary admin-btn-sm">Edit</button>
                <button onClick={() => handleDelete(c._id)} className="admin-btn admin-btn-danger admin-btn-sm">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {categories.length === 0 && <div className="admin-empty"><div className="admin-empty-icon">📂</div><div className="admin-empty-text">No categories yet</div></div>}
      </div>
    </div>
  );
}
