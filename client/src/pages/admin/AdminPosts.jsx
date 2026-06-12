import { useState, useEffect } from 'react';
import axios from '../../api/axios';

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ imageUrl: '', caption: '', postedDate: '', isActive: true });

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
      } else {
        await axios.post('/admin/posts', form, { headers });
      }
      setShowForm(false);
      setEditing(null);
      setForm({ imageUrl: '', caption: '', postedDate: '', isActive: true });
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving post');
    }
  };

  const handleEdit = (p) => {
    setEditing(p._id);
    setForm({ imageUrl: p.imageUrl, caption: p.caption, postedDate: p.postedDate, isActive: p.isActive });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    try {
      await axios.delete(`/admin/posts/${id}`, { headers });
      fetchPosts();
    } catch (err) { alert('Error'); }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Style Feed Posts ({posts.length})</h1>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ imageUrl: '', caption: '', postedDate: '', isActive: true }); }}
          style={{ padding: '10px 20px', background: '#c9a96e', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
          {showForm ? 'Cancel' : '+ Add Post'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 24, borderRadius: 10, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <input placeholder="Image URL" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} required style={inputStyle} />
            <input placeholder="Posted Date (e.g. 2 hours ago)" value={form.postedDate} onChange={e => setForm({...form, postedDate: e.target.value})} required style={inputStyle} />
            <input placeholder="Caption" value={form.caption} onChange={e => setForm({...form, caption: e.target.value})} required style={{ ...inputStyle, gridColumn: '1/3' }} />
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
        {posts.map((p) => (
          <div key={p._id} style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <img src={p.imageUrl} alt="" style={{ width: '100%', height: 180, objectFit: 'cover' }} />
            <div style={{ padding: 14 }}>
              <div style={{ fontSize: 13, color: '#333' }}>{p.caption}</div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>{p.postedDate}</div>
              <div style={{ fontSize: 12, marginTop: 6, color: p.isActive ? '#27ae60' : '#e74c3c' }}>
                {p.isActive ? '● Active' : '● Inactive'}
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                <button onClick={() => handleEdit(p)} style={btnStyle}>Edit</button>
                <button onClick={() => handleDelete(p._id)} style={{ ...btnStyle, background: '#e74c3c' }}>Delete</button>
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
