import { useState, useEffect } from 'react';
import axios from '../../api/axios';

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } catch (err) { alert('Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this enquiry?')) return;
    try {
      await axios.delete(`/admin/enquiries/${id}`, { headers });
      fetchEnquiries();
    } catch (err) { alert('Error'); }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Enquiries ({enquiries.length})</h1>

      <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '2px solid #eee' }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Mobile</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Message</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((e) => (
              <tr key={e._id} style={{ borderBottom: '1px solid #f0f0f0', background: e.isRead ? '#fff' : '#fffbf0' }}>
                <td style={tdStyle}><strong>{e.name}</strong></td>
                <td style={tdStyle}>{e.email}</td>
                <td style={tdStyle}>{e.mobile}</td>
                <td style={tdStyle}>{e.category}</td>
                <td style={{ ...tdStyle, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.message}</td>
                <td style={tdStyle}>
                  <span style={{ color: e.isRead ? '#27ae60' : '#e74c3c', fontSize: 12 }}>
                    {e.isRead ? '✓ Read' : '● New'}
                  </span>
                </td>
                <td style={tdStyle}>{new Date(e.createdAt).toLocaleDateString()}</td>
                <td style={tdStyle}>
                  {!e.isRead && <button onClick={() => markRead(e._id)} style={btnStyle}>Mark Read</button>}
                  <button onClick={() => handleDelete(e._id)} style={{ ...btnStyle, background: '#e74c3c', marginLeft: 6 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {enquiries.length === 0 && <div style={{ padding: 30, textAlign: 'center', color: '#888' }}>No enquiries yet</div>}
      </div>
    </div>
  );
}

const thStyle = { padding: '12px 10px', textAlign: 'left', fontSize: 12, color: '#666', textTransform: 'uppercase' };
const tdStyle = { padding: '10px' };
const btnStyle = { padding: '5px 12px', background: '#c9a96e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 };
