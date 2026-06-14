import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useConfirm } from '../../components/ConfirmModal';
import { toast } from 'react-toastify';

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const confirm = useConfirm();

  const token = localStorage.getItem('vp_token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchEnquiries = async () => {
    try {
      const res = await axios.get('/admin/enquiries', { headers });
      setEnquiries(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchEnquiries(); }, []);

  const markRead = async (id) => {
    try {
      await axios.put(`/admin/enquiries/${id}`, { isRead: true }, { headers });
      fetchEnquiries();
    } catch (err) { toast.error('Error'); }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({ title: 'Delete Enquiry', message: 'Are you sure you want to delete this enquiry?', type: 'danger' });
    if (!ok) return;
    try {
      await axios.delete(`/admin/enquiries/${id}`, { headers });
      toast.success('Enquiry deleted');
      fetchEnquiries();
    } catch (err) { toast.error('Error'); }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Enquiries <span className="admin-page-count">({enquiries.length})</span></h1>
      </div>

      {/* Mobile Card List */}
      <div className="admin-card-list">
        {enquiries.map((e) => (
          <div key={e._id} className="admin-item-card" style={{ borderLeft: e.isRead ? 'none' : '3px solid #E76F51' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="admin-item-card-title">{e.name}</div>
                <div className="admin-item-card-subtitle">{e.email} • {e.mobile}</div>
                {e.category && <div style={{ fontSize: 11, color: '#c9a96e', marginTop: 2 }}>{e.category}</div>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`admin-item-card-badge ${e.isRead ? 'admin-badge-stock' : 'admin-badge-new'}`}>{e.isRead ? 'Read' : 'New'}</span>
                <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>{new Date(e.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#555', margin: '10px 0 0', lineHeight: 1.4 }}>{e.message}</p>
            <div className="admin-item-card-actions">
              {!e.isRead && <button onClick={() => markRead(e._id)} className="admin-btn admin-btn-primary admin-btn-sm" style={{ flex: 1 }}>Mark Read</button>}
              <button onClick={() => handleDelete(e._id)} className="admin-btn admin-btn-danger admin-btn-sm" style={{ flex: 1 }}>Delete</button>
            </div>
          </div>
        ))}
        {enquiries.length === 0 && <div className="admin-empty"><div className="admin-empty-icon">💬</div><div className="admin-empty-text">No enquiries yet</div></div>}
      </div>

      {/* Desktop Table */}
      <div className="admin-table-wrapper">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Category</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((e) => (
                <tr key={e._id} style={{ background: e.isRead ? '' : '#fffbf0' }}>
                  <td><strong>{e.name}</strong></td>
                  <td>{e.email}</td>
                  <td>{e.mobile}</td>
                  <td>{e.category}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.message}</td>
                  <td><span style={{ color: e.isRead ? '#2D6A4F' : '#E76F51', fontSize: 12, fontWeight: 600 }}>{e.isRead ? '✓ Read' : '● New'}</span></td>
                  <td>{new Date(e.createdAt).toLocaleDateString()}</td>
                  <td>
                    {!e.isRead && <button onClick={() => markRead(e._id)} className="admin-btn admin-btn-primary admin-btn-sm">Read</button>}
                    <button onClick={() => handleDelete(e._id)} className="admin-btn admin-btn-danger admin-btn-sm" style={{ marginLeft: 6 }}>Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {enquiries.length === 0 && <div className="admin-empty"><div className="admin-empty-text">No enquiries yet</div></div>}
      </div>
    </div>
  );
}
