import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useConfirm } from '../../components/ConfirmModal';
import { toast } from 'react-toastify';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', rating: 5, comment: '', isApproved: true });
  const confirm = useConfirm();

  const token = localStorage.getItem('vp_token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchReviews = async () => {
    try {
      const res = await axios.get('/admin/reviews', { headers });
      setReviews(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/admin/reviews', { ...form, rating: Number(form.rating) }, { headers });
      setShowForm(false);
      setForm({ name: '', rating: 5, comment: '', isApproved: true });
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating review');
    }
  };

  const toggleApproval = async (id, isApproved) => {
    try {
      await axios.put(`/admin/reviews/${id}`, { isApproved: !isApproved }, { headers });
      fetchReviews();
    } catch (err) { toast.error('Error'); }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({ title: 'Delete Review', message: 'Are you sure you want to delete this review?', type: 'danger' });
    if (!ok) return;
    try {
      await axios.delete(`/admin/reviews/${id}`, { headers });
      toast.success('Review deleted');
      fetchReviews();
    } catch (err) { toast.error('Error'); }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Reviews ({reviews.length})</h1>
        <button onClick={() => setShowForm(!showForm)}
          style={{ padding: '10px 20px', background: '#c9a96e', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
          {showForm ? 'Cancel' : '+ Add Review'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 24, borderRadius: 10, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <input placeholder="Reviewer Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={inputStyle} />
            <select value={form.rating} onChange={e => setForm({...form, rating: e.target.value})} style={inputStyle}>
              {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
            </select>
          </div>
          <textarea placeholder="Review comment..." value={form.comment} onChange={e => setForm({...form, comment: e.target.value})} required style={{ ...inputStyle, width: '100%', minHeight: 80, marginTop: 16, boxSizing: 'border-box' }} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
              <input type="checkbox" checked={form.isApproved} onChange={e => setForm({...form, isApproved: e.target.checked})} />
              Approved
            </label>
          <button type="submit" style={{ marginTop: 16, padding: '10px 24px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
            Create Review
          </button>
        </form>
      )}

      <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 600 }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '2px solid #eee' }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Rating</th>
              <th style={thStyle}>Comment</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r._id} style={{ borderBottom: '1px solid #f0f0f0', background: r.isApproved ? '#fff' : '#fff8f0' }}>
                <td style={tdStyle}><strong>{r.name}</strong></td>
                <td style={tdStyle}>{'⭐'.repeat(r.rating)}</td>
                <td style={{ ...tdStyle, maxWidth: 250 }}>{r.comment}</td>
                <td style={tdStyle}>
                  <span style={{ color: r.isApproved ? '#27ae60' : '#e67e22', fontSize: 12 }}>
                    {r.isApproved ? '✓ Approved' : '⏳ Pending'}
                  </span>
                </td>
                <td style={tdStyle}>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td style={tdStyle}>
                  <button onClick={() => toggleApproval(r._id, r.isApproved)} style={{ ...btnStyle, background: r.isApproved ? '#e67e22' : '#27ae60' }}>
                    {r.isApproved ? 'Unapprove' : 'Approve'}
                  </button>
                  <button onClick={() => handleDelete(r._id)} style={{ ...btnStyle, background: '#e74c3c', marginLeft: 6 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {reviews.length === 0 && <div style={{ padding: 30, textAlign: 'center', color: '#888' }}>No reviews yet</div>}
      </div>
    </div>
  );
}

const inputStyle = { padding: '10px 14px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 };
const thStyle = { padding: '12px 10px', textAlign: 'left', fontSize: 12, color: '#666', textTransform: 'uppercase' };
const tdStyle = { padding: '10px' };
const btnStyle = { padding: '5px 12px', background: '#c9a96e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 };
