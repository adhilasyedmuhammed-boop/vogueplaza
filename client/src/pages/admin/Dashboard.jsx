import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatCurrency(amount) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount?.toLocaleString('en-IN') || 0}`;
}

function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  if (url.startsWith('data:')) return false; // Skip base64 — too large / often truncated
  if (url.startsWith('http://') || url.startsWith('https://')) return true;
  return false;
}

// Bar Chart Component
function BarChart({ data, height = 100 }) {
  if (!data || data.length === 0) return <div className="dash-empty-text">No data available</div>;
  const max = Math.max(...data.map(d => d.revenue || 0), 1);
  return (
    <div className="dash-bar-chart" style={{ height }}>
      <div className="dash-bar-chart-bars">
        {data.map((d, i) => (
          <div key={i} className="dash-bar-col">
            <div className="dash-bar" style={{ height: `${Math.max(((d.revenue || 0) / max) * 100, 4)}%` }} title={`₹${d.revenue?.toLocaleString('en-IN')}`}>
              <span className="dash-bar-tooltip">₹{(d.revenue || 0).toLocaleString('en-IN')}</span>
            </div>
            <span className="dash-bar-label">{new Date(d._id).toLocaleDateString('en-IN', { weekday: 'short' }).slice(0, 2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Donut/Pie Chart (CSS conic-gradient)
function PieChart({ data }) {
  if (!data || data.length === 0) return <div className="dash-empty-text">No category data</div>;
  const total = data.reduce((sum, d) => sum + (d.revenue || 0), 0);
  if (total === 0) return <div className="dash-empty-text">No sales data yet</div>;

  const colors = ['#c9a96e', '#4682B4', '#2D6A4F', '#E76F51', '#9b59b6', '#f39c12', '#1abc9c'];
  let cumulative = 0;
  const segments = data.map((d, i) => {
    const pct = ((d.revenue || 0) / total) * 100;
    const start = cumulative;
    cumulative += pct;
    return { ...d, pct, start, color: colors[i % colors.length] };
  });

  const gradient = segments.map(s => `${s.color} ${s.start}% ${s.start + s.pct}%`).join(', ');

  return (
    <div className="dash-pie-wrapper">
      <div className="dash-pie" style={{ background: `conic-gradient(${gradient})` }}>
        <div className="dash-pie-center">
          <span>{formatCurrency(total)}</span>
          <small>Total</small>
        </div>
      </div>
      <div className="dash-pie-legend">
        {segments.slice(0, 5).map((s, i) => (
          <div key={i} className="dash-pie-legend-item">
            <span className="dash-pie-dot" style={{ background: s.color }} />
            <span className="dash-pie-legend-name">{s._id || 'Other'}</span>
            <span className="dash-pie-legend-pct">{s.pct.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Inventory Health Bar
function InventoryHealth({ total, outOfStock, lowStock }) {
  const inStock = total - outOfStock - lowStock;
  const inStockPct = total > 0 ? (inStock / total) * 100 : 100;
  const lowPct = total > 0 ? (lowStock / total) * 100 : 0;
  const outPct = total > 0 ? (outOfStock / total) * 100 : 0;

  return (
    <div className="dash-inventory">
      <div className="dash-inventory-bar">
        <div className="dash-inv-segment inv-good" style={{ width: `${inStockPct}%` }} />
        <div className="dash-inv-segment inv-low" style={{ width: `${lowPct}%` }} />
        <div className="dash-inv-segment inv-out" style={{ width: `${outPct}%` }} />
      </div>
      <div className="dash-inventory-legend">
        <span><span className="dash-inv-dot inv-good-dot" /> In Stock ({inStock})</span>
        <span><span className="dash-inv-dot inv-low-dot" /> Low Stock ({lowStock})</span>
        <span><span className="dash-inv-dot inv-out-dot" /> Out ({outOfStock})</span>
      </div>
    </div>
  );
}

// Conversion Funnel
function ConversionFunnel({ stats, ordersByStatus }) {
  const totalVisitors = stats.totalUsers || 1;
  const totalOrders = stats.totalOrders || 0;
  const delivered = ordersByStatus?.delivered || 0;
  const convRate = totalVisitors > 0 ? ((totalOrders / totalVisitors) * 100).toFixed(1) : 0;
  const fulfillRate = totalOrders > 0 ? ((delivered / totalOrders) * 100).toFixed(1) : 0;

  const steps = [
    { label: 'Visitors', value: totalVisitors, color: '#4682B4' },
    { label: 'Orders', value: totalOrders, color: '#c9a96e' },
    { label: 'Delivered', value: delivered, color: '#2D6A4F' },
  ];
  const maxVal = Math.max(...steps.map(s => s.value), 1);

  return (
    <div className="dash-funnel">
      {steps.map((step, i) => (
        <div key={i} className="dash-funnel-step">
          <div className="dash-funnel-bar" style={{ width: `${Math.max((step.value / maxVal) * 100, 15)}%`, background: step.color }}>
            <span>{step.value}</span>
          </div>
          <span className="dash-funnel-label">{step.label}</span>
        </div>
      ))}
      <div className="dash-funnel-rates">
        <span>Conversion: <strong>{convRate}%</strong></span>
        <span>Fulfillment: <strong>{fulfillRate}%</strong></span>
      </div>
    </div>
  );
}

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

  if (loading) return (
    <div className="dash-loading">
      <div className="admin-skeleton" style={{ height: 28, width: 220, marginBottom: 16 }} />
      <div className="dash-skel-grid">
        {[1,2,3,4].map(i => <div key={i} className="admin-skeleton" style={{ height: 80, borderRadius: 12 }} />)}
      </div>
      <div className="admin-skeleton" style={{ height: 180, borderRadius: 12, marginTop: 16 }} />
    </div>
  );
  if (!data) return <div className="admin-empty"><div className="admin-empty-icon">⚠️</div><div className="admin-empty-text">Failed to load dashboard</div></div>;

  const { stats, trends, dailySales, topProducts, ordersByStatus, salesByCategory, recentOrders, recentEnquiries, recentReviews } = data;
  const user = JSON.parse(localStorage.getItem('vp_user') || '{}');
  const pendingOrders = (ordersByStatus?.placed || 0) + (ordersByStatus?.confirmed || 0);

  return (
    <div className="dash">
      {/* Header: Greeting + Date */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">{getGreeting()}, {user.name || 'Admin'} 👋</h1>
          <p className="dash-subtitle">Here's your store overview</p>
        </div>
        <div className="dash-header-right">
          <span className="dash-date-badge">{new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Alerts Banner */}
      {(stats.unreadEnquiries > 0 || stats.pendingReviews > 0 || stats.outOfStockProducts > 0 || pendingOrders > 0) && (
        <div className="dash-alerts-banner">
          {pendingOrders > 0 && <Link to="/admin/orders" className="dash-alert-chip alert-orange">📦 {pendingOrders} pending orders</Link>}
          {stats.unreadEnquiries > 0 && <Link to="/admin/enquiries" className="dash-alert-chip alert-blue">💬 {stats.unreadEnquiries} unread</Link>}
          {stats.pendingReviews > 0 && <Link to="/admin/reviews" className="dash-alert-chip alert-yellow">⭐ {stats.pendingReviews} pending reviews</Link>}
          {stats.outOfStockProducts > 0 && <Link to="/admin/products" className="dash-alert-chip alert-red">🔴 {stats.outOfStockProducts} out of stock</Link>}
        </div>
      )}

      {/* Revenue + Orders Row */}
      <div className="dash-metrics">
        <div className="dash-metric-card metric-revenue">
          <div className="dash-metric-top">
            <span className="dash-metric-label">Total Revenue</span>
            {trends.revenueChange !== 0 && <span className={`dash-trend-chip ${trends.revenueChange >= 0 ? 'trend-up' : 'trend-down'}`}>{trends.revenueChange >= 0 ? '↑' : '↓'}{Math.abs(trends.revenueChange)}%</span>}
          </div>
          <div className="dash-metric-value">{formatCurrency(stats.totalRevenue)}</div>
          <div className="dash-metric-sub">This month: {formatCurrency(stats.monthRevenue)}</div>
        </div>
        <div className="dash-metric-card metric-orders">
          <div className="dash-metric-top">
            <span className="dash-metric-label">Orders</span>
            {trends.ordersChange !== 0 && <span className={`dash-trend-chip ${trends.ordersChange >= 0 ? 'trend-up' : 'trend-down'}`}>{trends.ordersChange >= 0 ? '↑' : '↓'}{Math.abs(trends.ordersChange)}%</span>}
          </div>
          <div className="dash-metric-value">{stats.totalOrders}</div>
          <div className="dash-metric-sub">Today: {stats.todayOrders} | Week: {stats.weekOrders}</div>
        </div>
        <div className="dash-metric-card metric-customers">
          <div className="dash-metric-top">
            <span className="dash-metric-label">Customers</span>
            {trends.usersChange !== 0 && <span className={`dash-trend-chip ${trends.usersChange >= 0 ? 'trend-up' : 'trend-down'}`}>{trends.usersChange >= 0 ? '↑' : '↓'}{Math.abs(trends.usersChange)}%</span>}
          </div>
          <div className="dash-metric-value">{stats.totalUsers}</div>
          <div className="dash-metric-sub">+{stats.newUsersThisMonth} this month</div>
        </div>
        <div className="dash-metric-card metric-products">
          <div className="dash-metric-top">
            <span className="dash-metric-label">Products</span>
          </div>
          <div className="dash-metric-value">{stats.totalProducts}</div>
          <div className="dash-metric-sub">{stats.totalCategories} categories • {stats.totalBrands} brands</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dash-actions-row">
        <Link to="/admin/products" className="dash-qaction" state={{ openForm: true }}><span className="dash-qaction-icon">➕</span><span>Add Product</span></Link>
        <Link to="/admin/enquiries" className="dash-qaction"><span className="dash-qaction-icon">💬</span><span>Enquiries</span>{stats.unreadEnquiries > 0 && <span className="dash-qaction-badge">{stats.unreadEnquiries}</span>}</Link>
        <Link to="/admin/reviews" className="dash-qaction"><span className="dash-qaction-icon">⭐</span><span>Reviews</span>{stats.pendingReviews > 0 && <span className="dash-qaction-badge">{stats.pendingReviews}</span>}</Link>
        <Link to="/admin/categories" className="dash-qaction"><span className="dash-qaction-icon">📂</span><span>Categories</span></Link>
        <Link to="/admin/banners" className="dash-qaction"><span className="dash-qaction-icon">🖼️</span><span>Banners</span></Link>
      </div>

      {/* Sales Chart + Pie Chart (Category Sales) */}
      <div className="dash-charts-row">
        <div className="dash-card dash-card-wide">
          <div className="dash-card-head">
            <h3>📈 Sales (Last 7 Days)</h3>
            <span className="dash-card-value">{formatCurrency(dailySales?.reduce((s, d) => s + (d.revenue || 0), 0))}</span>
          </div>
          <BarChart data={dailySales} height={120} />
        </div>
        <div className="dash-card">
          <div className="dash-card-head">
            <h3>🎯 Sales by Category</h3>
          </div>
          <PieChart data={salesByCategory} />
        </div>
      </div>

      {/* Inventory Health + Conversion Funnel */}
      <div className="dash-charts-row">
        <div className="dash-card">
          <div className="dash-card-head">
            <h3>📦 Inventory Health</h3>
          </div>
          <InventoryHealth total={stats.totalProducts} outOfStock={stats.outOfStockProducts} lowStock={stats.lowStockProducts || 0} />
        </div>
        <div className="dash-card">
          <div className="dash-card-head">
            <h3>🔄 Conversion Funnel</h3>
          </div>
          <ConversionFunnel stats={stats} ordersByStatus={ordersByStatus} />
        </div>
      </div>

      {/* Order Pipeline + Top Products */}
      <div className="dash-charts-row">
        <div className="dash-card">
          <div className="dash-card-head"><h3>📋 Order Pipeline</h3></div>
          <div className="dash-pipeline">
            {[
              { label: 'Placed', count: ordersByStatus?.placed || 0, color: '#3498db' },
              { label: 'Confirmed', count: ordersByStatus?.confirmed || 0, color: '#f39c12' },
              { label: 'Packed', count: ordersByStatus?.packed || 0, color: '#8e44ad' },
              { label: 'Shipped', count: ordersByStatus?.shipped || 0, color: '#9b59b6' },
              { label: 'Delivered', count: ordersByStatus?.delivered || 0, color: '#2ecc71' },
              { label: 'Cancelled', count: ordersByStatus?.cancelled || 0, color: '#e74c3c' },
            ].map((s, i) => (
              <div key={i} className="dash-pipeline-item">
                <div className="dash-pipeline-dot" style={{ background: s.color }} />
                <span className="dash-pipeline-label">{s.label}</span>
                <strong className="dash-pipeline-count">{s.count}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-card-head"><h3>🏆 Top Products</h3></div>
          {topProducts && topProducts.length > 0 ? (
            <div className="dash-top-list">
              {topProducts.map((p, i) => (
                <div key={i} className="dash-top-item">
                  <span className="dash-top-rank">#{i + 1}</span>
                  {isValidImageUrl(p.image) ? (
                    <img src={p.image} alt="" className="dash-top-img" />
                  ) : (
                    <div className="dash-top-img-placeholder">{p._id?.charAt(0) || '?'}</div>
                  )}
                  <div className="dash-top-info">
                    <div className="dash-top-name">{p._id}</div>
                    <div className="dash-top-meta">{p.totalSold} sold • {formatCurrency(p.revenue)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="dash-empty-text">No sales yet</p>}
        </div>
      </div>

      {/* Activity Feed + Recent Orders */}
      <div className="dash-charts-row">
        <div className="dash-card">
          <div className="dash-card-head"><h3>⚡ Activity Feed</h3></div>
          <div className="dash-feed">
            {recentOrders?.slice(0, 3).map(o => (
              <div key={o._id} className="dash-feed-item">
                <div className="dash-feed-dot" style={{ background: '#c9a96e' }} />
                <div className="dash-feed-content">
                  <span className="dash-feed-text">Order <strong>#{o._id.slice(-6)}</strong> — {formatCurrency(o.total)}</span>
                  <span className="dash-feed-time">{timeAgo(o.createdAt)}</span>
                </div>
              </div>
            ))}
            {recentEnquiries?.slice(0, 2).map(e => (
              <div key={e._id} className="dash-feed-item">
                <div className="dash-feed-dot" style={{ background: '#4682B4' }} />
                <div className="dash-feed-content">
                  <span className="dash-feed-text">Enquiry from <strong>{e.name}</strong></span>
                  <span className="dash-feed-time">{timeAgo(e.createdAt)}</span>
                </div>
              </div>
            ))}
            {recentReviews?.slice(0, 2).map(r => (
              <div key={r._id} className="dash-feed-item">
                <div className="dash-feed-dot" style={{ background: '#2D6A4F' }} />
                <div className="dash-feed-content">
                  <span className="dash-feed-text">Review by <strong>{r.name}</strong> ({r.rating}★)</span>
                  <span className="dash-feed-time">{timeAgo(r.createdAt)}</span>
                </div>
              </div>
            ))}
            {(!recentOrders?.length && !recentEnquiries?.length && !recentReviews?.length) && <p className="dash-empty-text">No recent activity</p>}
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-head">
            <h3>💬 Recent Enquiries</h3>
            <Link to="/admin/enquiries" className="dash-link">View all →</Link>
          </div>
          {recentEnquiries?.length > 0 ? recentEnquiries.slice(0, 4).map(e => (
            <div key={e._id} className="dash-compact-item">
              <div>
                <div className="dash-compact-title">{e.name}</div>
                <div className="dash-compact-sub">{e.category} • {timeAgo(e.createdAt)}</div>
              </div>
              <span className={`dash-badge ${e.isRead ? 'badge-green' : 'badge-red'}`}>{e.isRead ? 'Read' : 'New'}</span>
            </div>
          )) : <p className="dash-empty-text">No enquiries</p>}
        </div>
      </div>

      {/* Reviews + Store Stats */}
      <div className="dash-charts-row">
        <div className="dash-card">
          <div className="dash-card-head">
            <h3>⭐ Recent Reviews</h3>
            <Link to="/admin/reviews" className="dash-link">View all →</Link>
          </div>
          {recentReviews?.length > 0 ? recentReviews.slice(0, 4).map(r => (
            <div key={r._id} className="dash-compact-item">
              <div>
                <div className="dash-compact-title">{r.name}</div>
                <div className="dash-compact-sub">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)} • {timeAgo(r.createdAt)}</div>
              </div>
              <span className={`dash-badge ${r.isApproved ? 'badge-green' : 'badge-orange'}`}>{r.isApproved ? 'Approved' : 'Pending'}</span>
            </div>
          )) : <p className="dash-empty-text">No reviews</p>}
        </div>

        <div className="dash-card">
          <div className="dash-card-head"><h3>🏪 Store Summary</h3></div>
          <div className="dash-store-grid">
            <div className="dash-store-item"><span className="dash-store-val">{stats.totalCategories}</span><span className="dash-store-lbl">Categories</span></div>
            <div className="dash-store-item"><span className="dash-store-val">{stats.totalBrands}</span><span className="dash-store-lbl">Brands</span></div>
            <div className="dash-store-item"><span className="dash-store-val">{stats.totalPosts}</span><span className="dash-store-lbl">Posts</span></div>
            <div className="dash-store-item"><span className="dash-store-val">{stats.totalEnquiries}</span><span className="dash-store-lbl">Enquiries</span></div>
            <div className="dash-store-item"><span className="dash-store-val">{stats.totalReviews}</span><span className="dash-store-lbl">Reviews</span></div>
            <div className="dash-store-item"><span className="dash-store-val">{formatCurrency(stats.totalRevenue)}</span><span className="dash-store-lbl">All-time Revenue</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
