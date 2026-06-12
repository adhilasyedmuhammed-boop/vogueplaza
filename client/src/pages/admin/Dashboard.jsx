import { useState, useEffect } from 'react';
import axios from '../../api/axios';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('vp_token');
        const res = await axios.get('/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      }
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading dashboard...</div>;
  if (!data) return <div style={{ padding: 40, textAlign: 'center', color: '#c00' }}>Failed to load dashboard</div>;

  const { stats, recentEnquiries, recentProducts, recentReviews } = data;

  const statCards = [
    { label: 'Products', value: stats.totalProducts, color: '#c9a96e' },
    { label: 'Categories', value: stats.totalCategories, color: '#8B7355' },
    { label: 'Brands', value: stats.totalBrands, color: '#6B8E23' },
    { label: 'Users', value: stats.totalUsers, color: '#4682B4' },
    { label: 'Enquiries', value: stats.totalEnquiries, color: '#CD853F', badge: stats.unreadEnquiries },
    { label: 'Reviews', value: stats.totalReviews, color: '#DAA520', badge: stats.pendingReviews },
    { label: 'Posts', value: stats.totalPosts, color: '#BC8F8F' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: '#1a1a1a' }}>Dashboard</h1>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        {statCards.map((card) => (
          <div
            key={card.label}
            style={{
              background: '#fff',
              borderRadius: 10,
              padding: '20px 18px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              borderLeft: `4px solid ${card.color}`,
              position: 'relative',
            }}
          >
            <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>{card.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginTop: 4 }}>{card.value}</div>
            {card.badge > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  background: '#e74c3c',
                  color: '#fff',
                  fontSize: 11,
                  padding: '2px 7px',
                  borderRadius: 10,
                }}
              >
                {card.badge} pending
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Recent Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        {/* Recent Enquiries */}
        <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ marginBottom: 12, fontSize: 16, color: '#1a1a1a' }}>Recent Enquiries</h3>
          {recentEnquiries.length === 0 ? (
            <p style={{ color: '#888' }}>No enquiries yet</p>
          ) : (
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
                  <th style={{ padding: '6px 0' }}>Name</th>
                  <th>Category</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentEnquiries.map((e) => (
                  <tr key={e._id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '8px 0' }}>{e.name}</td>
                    <td>{e.category}</td>
                    <td>
                      <span style={{ color: e.isRead ? '#27ae60' : '#e74c3c', fontSize: 12 }}>
                        {e.isRead ? '✓ Read' : '● New'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Reviews */}
        <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ marginBottom: 12, fontSize: 16, color: '#1a1a1a' }}>Recent Reviews</h3>
          {recentReviews.length === 0 ? (
            <p style={{ color: '#888' }}>No reviews yet</p>
          ) : (
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
                  <th style={{ padding: '6px 0' }}>Name</th>
                  <th>Rating</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentReviews.map((r) => (
                  <tr key={r._id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '8px 0' }}>{r.name}</td>
                    <td>{'⭐'.repeat(r.rating)}</td>
                    <td>
                      <span style={{ color: r.isApproved ? '#27ae60' : '#e67e22', fontSize: 12 }}>
                        {r.isApproved ? '✓ Approved' : '⏳ Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Recent Products */}
      <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginTop: 24 }}>
        <h3 style={{ marginBottom: 12, fontSize: 16, color: '#1a1a1a' }}>Recently Added Products</h3>
        {recentProducts.length === 0 ? (
          <p style={{ color: '#888' }}>No products yet</p>
        ) : (
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto' }}>
            {recentProducts.map((p) => (
              <div key={p._id} style={{ minWidth: 140, textAlign: 'center' }}>
                <img src={p.image} alt={p.name} style={{ width: 100, height: 120, objectFit: 'cover', borderRadius: 8 }} />
                <div style={{ fontSize: 12, marginTop: 6, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: '#c9a96e' }}>₹{p.price}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
