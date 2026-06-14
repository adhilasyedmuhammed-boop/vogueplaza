import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useConfirm } from '../../components/ConfirmModal';
import { toast } from 'react-toastify';

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ imageUrl: '', caption: '', postedDate: '', isActive: true });
  const confirm = useConfirm();

  const token = localStorage.getItem('vp_token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/admin/posts', { headers });
      setPosts(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`/admin/posts/${editing}`, form, { headers });
        toast.success('Post updated successfully ✓');
      } else {
        await axios.post('/admin/posts', form, { headers });
        toast.success('Post created successfully ✓');
      }
      setShowForm(false);
      setEditing(null);
      setForm({ imageUrl: '', caption: '', postedDate: '', isActive: true });
      fetchPosts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving post');
    }
  };

  const handleEdit = async (p) => {
    const ok = await confirm({ title: 'Edit Post', message: `You are about to edit this post. Make sure to save your changes.`, type: 'warning' });
    if (!ok) return;
    setEditing(p._id);
    setForm({ imageUrl: p.imageUrl, caption: p.caption, postedDate: p.postedDate, isActive: p.isActive });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const ok = await confirm({ title: 'Delete Post', message: 'Are you sure you want to delete this post?', type: 'danger' });
    if (!ok) return;
    try {
      await axios.delete(`/admin/posts/${id}`, { headers });
      toast.success('Post deleted');
      fetchPosts();
    } catch (err) { toast.error('Error'); }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Style Feed Posts <span className="admin-page-count">({posts.length})</span></h1>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ imageUrl: '', caption: '', postedDate: '', isActive: true }); }}
          className={`admin-btn ${showForm ? 'admin-btn-outline' : 'admin-btn-primary'}`}>
          {showForm ? 'Cancel' : '+ Add Post'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-grid">
            <input className="admin-input" placeholder="Image URL" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} required />
            <input className="admin-input" placeholder="Posted Date (e.g. 2 hours ago)" value={form.postedDate} onChange={e => setForm({...form, postedDate: e.target.value})} required />
          </div>
          <input className="admin-input" placeholder="Caption" value={form.caption} onChange={e => setForm({...form, caption: e.target.value})} required style={{ width: '100%', marginTop: 16, boxSizing: 'border-box' }} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} />
            Active
          </label>
          <button type="submit" className="admin-btn admin-btn-dark" style={{ marginTop: 16 }}>
            {editing ? 'Update' : 'Create'}
          </button>
        </form>
      )}

      <div className="admin-grid-cards">
        {posts.map((p) => (
          <div key={p._id} className="admin-visual-card">
            <img src={p.imageUrl} alt="" className="admin-visual-card-img" style={{ height: 160 }} />
            <div className="admin-visual-card-body">
              <div className="admin-visual-card-title" style={{ fontSize: 13 }}>{p.caption}</div>
              <div className="admin-visual-card-sub">{p.postedDate}</div>
              <div style={{ fontSize: 12, marginTop: 4, color: p.isActive ? '#27ae60' : '#e74c3c' }}>
                {p.isActive ? '● Active' : '● Inactive'}
              </div>
              <div className="admin-visual-card-actions">
                <button onClick={() => handleEdit(p)} className="admin-btn admin-btn-primary admin-btn-sm">Edit</button>
                <button onClick={() => handleDelete(p._id)} className="admin-btn admin-btn-danger admin-btn-sm">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {posts.length === 0 && <div className="admin-empty"><div className="admin-empty-icon">🖼️</div><div className="admin-empty-text">No posts yet</div></div>}
      </div>
    </div>
  );
}
