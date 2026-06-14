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
      toast.success('Review created');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating review');
    }
  };

  const toggleApproval = async (id, isApproved) => {
    try {
      await axios.put(`/admin/reviews/${id}`, { isApproved: !isApproved }, { headers });
      fetchReviews();
      toast.success(isApproved ? 'Review unapproved' : 'Review approved');
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
      <div className="admin-page-header">
        <h1 className="admin-page-title">Reviews <span className="admin-page-count">({reviews.length})</span></h1>
        <button onClick={() => setShowForm(!showForm)} className={`admin-btn ${showForm ? 'admin-btn-outline' : 'admin-btn-primary'}`}>
          {showForm ? 'Cancel' : '+ Add Review'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-grid">
            <input className="admin-input" placeholder="Reviewer Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <select className="admin-input" value={form.rating} onChange={e => setForm({...form, rating: e.target.value})}>
              {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
            </select>
          </div>
          <textarea className="admin-textarea" placeholder="Review comment..." value={form.comment} onChange={e => setForm({...form, comment: e.target.value})} required style={{ marginTop: 16 }} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 14 }}>
            <input type="checkbox" checked={form.isApproved} onChange={e => setForm({...form, isApproved: e.target.checked})} />
            Approved
          </label>
          <button type="submit" className="admin-btn admin-btn-dark" style={{ marginTop: 16 }}>Create Review</button>
        </form>
      )}

      {/* Mobile Card List */}
      <div className="admin-card-list">
        {reviews.map((r) => (
          <div key={r._id} className="admin-item-card" style={{ borderLeft: `3px solid ${r.isApproved ? '#27ae60' : '#e67e22'}` }}>
            <div className="admin-item-card-row">
              <div className="admin-item-card-body">
                <div className="admin-item-card-title">{r.name}</div>
                <div style={{ color: '#c9a96e', fontSize: 13, margin: '4px 0' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                <div className="admin-item-card-subtitle" style={{ WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{r.comment}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: r.isApproved ? '#27ae60' : '#e67e22' }}>
                    {r.isApproved ? '✓ Approved' : '⏳ Pending'}
                  </span>
                  <span style={{ fontSize: 11, color: '#999' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="admin-item-card-actions">
              <button onClick={() => toggleApproval(r._id, r.isApproved)} className={`admin-btn admin-btn-sm ${r.isApproved ? 'admin-btn-outline' : 'admin-btn-primary'}`} style={{ flex: 1 }}>
                {r.isApproved ? 'Unapprove' : 'Approve'}
              </button>
              <button onClick={() => handleDelete(r._id)} className="admin-btn admin-btn-danger admin-btn-sm" style={{ flex: 1 }}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r._id} style={{ background: r.isApproved ? '#fff' : '#fff8f0' }}>
                <td style={{ fontWeight: 600 }}>{r.name}</td>
                <td><span style={{ color: '#c9a96e' }}>{'★'.repeat(r.rating)}</span></td>
                <td style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.comment}</td>
                <td>
                  <span style={{ color: r.isApproved ? '#27ae60' : '#e67e22', fontSize: 12, fontWeight: 600 }}>
                    {r.isApproved ? '✓ Approved' : '⏳ Pending'}
                  </span>
                </td>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => toggleApproval(r._id, r.isApproved)} className={`admin-btn admin-btn-sm ${r.isApproved ? 'admin-btn-outline' : 'admin-btn-primary'}`}>
                    {r.isApproved ? 'Unapprove' : 'Approve'}
                  </button>
                  <button onClick={() => handleDelete(r._id)} className="admin-btn admin-btn-danger admin-btn-sm" style={{ marginLeft: 6 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reviews.length === 0 && <div style={{ padding: 30, textAlign: 'center', color: '#888' }}>No reviews yet</div>}
      </div>
    </div>
  );
}
