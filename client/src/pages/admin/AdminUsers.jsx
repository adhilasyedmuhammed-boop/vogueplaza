import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useConfirm } from '../../components/ConfirmModal';
import { toast } from 'react-toastify';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const confirm = useConfirm();

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
    const ok = await confirm({ title: 'Change Role', message: `Change this user's role to ${newRole}?`, type: 'warning' });
    if (!ok) return;
    try {
      await axios.put(`/admin/users/${id}`, { role: newRole }, { headers });
      toast.success(`Role changed to ${newRole}`);
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({ title: 'Delete User', message: 'Are you sure you want to delete this user? This cannot be undone.', type: 'danger' });
    if (!ok) return;
    try {
      await axios.delete(`/admin/users/${id}`, { headers });
      toast.success('User deleted');
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div>
      <h1 className="admin-page-title">Users <span className="admin-page-count">({users.length})</span></h1>

      {/* Mobile Card List */}
      <div className="admin-card-list">
        {users.map((u) => (
          <div key={u._id} className="admin-item-card">
            <div className="admin-item-card-row">
              <div className="admin-user-avatar" style={{ background: u.role === 'admin' ? '#c9a96e' : '#ddd', color: u.role === 'admin' ? '#fff' : '#555' }}>
                {(u.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="admin-item-card-body">
                <div className="admin-item-card-title">{u.name}</div>
                <div className="admin-item-card-subtitle">{u.email}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{
                    padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                    background: u.role === 'admin' ? '#c9a96e' : '#f0f0f0',
                    color: u.role === 'admin' ? '#fff' : '#555',
                  }}>
                    {u.role}
                  </span>
                  <span style={{ fontSize: 11, color: '#999' }}>Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="admin-item-card-actions">
              <button onClick={() => toggleRole(u._id, u.role)} className="admin-btn admin-btn-primary admin-btn-sm" style={{ flex: 1 }}>
                {u.role === 'admin' ? 'Make User' : 'Make Admin'}
              </button>
              <button onClick={() => handleDelete(u._id)} className="admin-btn admin-btn-danger admin-btn-sm" style={{ flex: 1 }}>
                Delete
              </button>
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
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td style={{ fontWeight: 600 }}>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span style={{
                    padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                    background: u.role === 'admin' ? '#c9a96e' : '#eee',
                    color: u.role === 'admin' ? '#fff' : '#555',
                  }}>
                    {u.role}
                  </span>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => toggleRole(u._id, u.role)} className="admin-btn admin-btn-primary admin-btn-sm">
                    {u.role === 'admin' ? 'Make User' : 'Make Admin'}
                  </button>
                  <button onClick={() => handleDelete(u._id)} className="admin-btn admin-btn-danger admin-btn-sm" style={{ marginLeft: 6 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <div style={{ padding: 30, textAlign: 'center', color: '#888' }}>No users found</div>}
      </div>
    </div>
  );
}
