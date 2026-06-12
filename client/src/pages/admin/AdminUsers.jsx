import { useState, useEffect } from 'react';
import axios from '../../api/axios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('vp_token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/admin/users', { headers });
      setUsers(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!confirm(`Change role to ${newRole}?`)) return;
    try {
      await axios.put(`/admin/users/${id}`, { role: newRole }, { headers });
      fetchUsers();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
      await axios.delete(`/admin/users/${id}`, { headers });
      fetchUsers();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Users ({users.length})</h1>

      <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 550 }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '2px solid #eee' }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Joined</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={tdStyle}><strong>{u.name}</strong></td>
                <td style={tdStyle}>{u.email}</td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 600,
                    background: u.role === 'admin' ? '#c9a96e' : '#eee',
                    color: u.role === 'admin' ? '#fff' : '#555',
                  }}>
                    {u.role}
                  </span>
                </td>
                <td style={tdStyle}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td style={tdStyle}>
                  <button onClick={() => toggleRole(u._id, u.role)} style={btnStyle}>
                    {u.role === 'admin' ? 'Make User' : 'Make Admin'}
                  </button>
                  <button onClick={() => handleDelete(u._id)} style={{ ...btnStyle, background: '#e74c3c', marginLeft: 6 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {users.length === 0 && <div style={{ padding: 30, textAlign: 'center', color: '#888' }}>No users found</div>}
      </div>
    </div>
  );
}

const thStyle = { padding: '12px 10px', textAlign: 'left', fontSize: 12, color: '#666', textTransform: 'uppercase' };
const tdStyle = { padding: '10px' };
const btnStyle = { padding: '5px 12px', background: '#c9a96e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 };
