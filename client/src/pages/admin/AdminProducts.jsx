import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useConfirm } from '../../components/ConfirmModal';
import { toast } from 'react-toastify';

const CATEGORIES = ['womenswear', 'menswear', 'accessories', 'kids', 'homedecor', 'footwear'];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ productCode: '', name: '', brand: '', category: 'womenswear', price: '', originalPrice: '', discount: '', image: '', image2: '', image3: '', image4: '', sizes: '', description: '', inStock: true });
  const [uploading, setUploading] = useState(false);
  const confirm = useConfirm();

  const token = localStorage.getItem('vp_token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`/admin/products?page=${page}&limit=10`, { headers });
      setProducts(res.data.products || res.data);
      if (res.data.pagination) setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleImageUpload = async (e, field = 'image') => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await axios.post('/upload', formData, { headers: { ...headers, 'Content-Type': 'multipart/form-data' } });
      setForm(prev => ({ ...prev, [field]: res.data.url }));
      toast.success('Image uploaded');
    } catch (err) {
      toast.error('Image upload failed');
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined, discount: form.discount ? Number(form.discount) : 0, sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean) };
    if (!payload.productCode) delete payload.productCode;
    if (!payload.image2) delete payload.image2;
    if (!payload.image3) delete payload.image3;
    if (!payload.image4) delete payload.image4;
    try {
      if (editing) {
        await axios.put(`/admin/products/${editing}`, payload, { headers });
        toast.success('Product updated');
      } else {
        await axios.post('/admin/products', payload, { headers });
        toast.success('Product created');
      }
      setShowForm(false);
      setEditing(null);
      setForm({ productCode: '', name: '', brand: '', category: 'womenswear', price: '', originalPrice: '', discount: '', image: '', image2: '', image3: '', image4: '', sizes: '', description: '', inStock: true });
      fetchProducts(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleEdit = (p) => {
    setEditing(p._id);
    setForm({ productCode: p.productCode || '', name: p.name, brand: p.brand, category: p.category, price: p.price, originalPrice: p.originalPrice || '', discount: p.discount || '', image: p.image, image2: p.image2 || '', image3: p.image3 || '', image4: p.image4 || '', sizes: (p.sizes || []).join(', '), description: p.description || '', inStock: p.inStock });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const ok = await confirm({ title: 'Delete Product', message: 'Are you sure? This cannot be undone.', type: 'danger' });
    if (!ok) return;
    try {
      await axios.delete(`/admin/products/${id}`, { headers });
      toast.success('Product deleted');
      fetchProducts(pagination.page);
    } catch (err) {
      toast.error('Error deleting product');
    }
  };

  const filtered = search
    ? products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase()) || p.productCode?.toLowerCase().includes(search.toLowerCase()))
    : products;

  if (loading && products.length === 0) {
    return (
      <div>
        <div className="admin-skeleton admin-skeleton-card" />
        <div className="admin-skeleton admin-skeleton-card" />
        <div className="admin-skeleton admin-skeleton-card" />
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <h1 className="admin-page-title">Products <span className="admin-page-count">({pagination.total})</span></h1>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ productCode: '', name: '', brand: '', category: 'womenswear', price: '', originalPrice: '', discount: '', image: '', image2: '', image3: '', image4: '', sizes: '', description: '', inStock: true }); }} className={`admin-btn ${showForm ? 'admin-btn-outline' : 'admin-btn-primary'}`}>
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {/* Search Bar */}
      {!showForm && (
        <div className="admin-search-bar">
          <span className="admin-search-icon">🔍</span>
          <input placeholder="Search by name, brand or code..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>✕</button>}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-grid">
            <input className="admin-input" placeholder="Product Code (e.g. VP-GU-001)" value={form.productCode} onChange={e => setForm({...form, productCode: e.target.value})} style={{ fontFamily: 'monospace', fontWeight: 600, letterSpacing: '0.05em' }} />
            <input className="admin-input" placeholder="Product Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <input className="admin-input" placeholder="Brand" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} required />
            <select className="admin-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input className="admin-input" placeholder="Original Price (MRP)" type="number" value={form.originalPrice} onChange={e => {
              const mrp = Number(e.target.value);
              const disc = Number(form.discount) || 0;
              const salePrice = disc > 0 && mrp > 0 ? Math.round(mrp - (mrp * disc / 100)) : form.price;
              setForm({...form, originalPrice: e.target.value, price: disc > 0 && mrp > 0 ? salePrice : form.price});
            }} />
            <input className="admin-input" placeholder="Discount %" type="number" value={form.discount} onChange={e => {
              const disc = Number(e.target.value);
              const mrp = Number(form.originalPrice) || 0;
              const salePrice = disc > 0 && mrp > 0 ? Math.round(mrp - (mrp * disc / 100)) : form.price;
              setForm({...form, discount: e.target.value, price: disc > 0 && mrp > 0 ? salePrice : form.price});
            }} />
            <input className="admin-input" placeholder="Sale Price" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required style={{ background: form.originalPrice && form.discount ? '#f0fff0' : '', fontWeight: 600 }} />
            <input className="admin-input" placeholder="Sizes (comma separated)" value={form.sizes} onChange={e => setForm({...form, sizes: e.target.value})} />
          </div>

          {/* Images */}
          <div style={{ marginTop: 20, padding: 16, background: '#f9f9f9', borderRadius: 8, border: '1px solid #eee' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 12 }}>Product Images</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 12 }}>
              {['image', 'image2', 'image3', 'image4'].map((field, idx) => (
                <div key={field} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{idx === 0 ? 'Main *' : `#${idx + 1}`}</div>
                  {form[field] ? (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <img src={form[field]} alt="" style={{ width: 80, height: 100, objectFit: 'cover', borderRadius: 6, border: '1px solid #ddd' }} />
                      <button type="button" onClick={() => setForm(prev => ({ ...prev, [field]: '' }))} style={{ position: 'absolute', top: -6, right: -6, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: 11, lineHeight: '20px' }}>×</button>
                    </div>
                  ) : (
                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 80, height: 100, border: '2px dashed #ccc', borderRadius: 6, cursor: 'pointer', margin: '0 auto' }}>
                      <span style={{ fontSize: 20, color: '#ccc' }}>+</span>
                      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => handleImageUpload(e, field)} style={{ display: 'none' }} />
                    </label>
                  )}
                </div>
              ))}
            </div>
            {uploading && <div style={{ marginTop: 8, color: '#c9a96e', fontSize: 13 }}>Uploading...</div>}
            <input className="admin-input" placeholder="Or paste image URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})} style={{ marginTop: 10 }} />
          </div>

          <textarea className="admin-textarea" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{ marginTop: 16 }} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 14 }}>
            <input type="checkbox" checked={form.inStock} onChange={e => setForm({...form, inStock: e.target.checked})} />
            In Stock
          </label>
          <button type="submit" disabled={uploading} className={`admin-btn admin-btn-dark`} style={{ marginTop: 16 }}>
            {editing ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      )}

      {/* Mobile Card List */}
      <div className="admin-card-list">
        {filtered.map(p => (
          <div key={p._id} className="admin-item-card">
            <div className="admin-item-card-row">
              <img src={p.image} alt="" className="admin-item-card-img" />
              <div className="admin-item-card-body">
                <div className="admin-item-card-title">{p.name}</div>
                <div className="admin-item-card-subtitle">{p.brand} • {p.category}</div>
                <div className="admin-item-card-meta">
                  <span className="admin-item-card-price">₹{p.price?.toLocaleString('en-IN')}</span>
                  {p.originalPrice > 0 && <span className="admin-item-card-mrp">₹{p.originalPrice?.toLocaleString('en-IN')}</span>}
                  {p.discount > 0 && <span className="admin-item-card-badge admin-badge-discount">{p.discount}% OFF</span>}
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                  {p.productCode && <span className="admin-badge-code">{p.productCode}</span>}
                  <span className={`admin-item-card-badge ${p.inStock ? 'admin-badge-stock' : 'admin-badge-outofstock'}`}>{p.inStock ? 'In Stock' : 'Out'}</span>
                </div>
              </div>
            </div>
            <div className="admin-item-card-actions">
              <button onClick={() => handleEdit(p)} className="admin-btn admin-btn-primary admin-btn-sm" style={{ flex: 1 }}>Edit</button>
              <button onClick={() => handleDelete(p._id)} className="admin-btn admin-btn-danger admin-btn-sm" style={{ flex: 1 }}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="admin-table-wrapper">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Code</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Price</th>
                <th>MRP</th>
                <th>Discount</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p._id}>
                  <td><img src={p.image} alt="" className="admin-table-img" /></td>
                  <td><span className="admin-badge-code">{p.productCode || '—'}</span></td>
                  <td style={{ fontWeight: 500 }}>{p.name}</td>
                  <td>{p.brand}</td>
                  <td>{p.category}</td>
                  <td><span style={{ fontWeight: 600, color: p.discount > 0 ? '#2D6A4F' : '#111' }}>₹{p.price?.toLocaleString('en-IN')}</span></td>
                  <td>{p.originalPrice ? <span style={{ textDecoration: 'line-through', color: '#999', fontSize: 12 }}>₹{p.originalPrice?.toLocaleString('en-IN')}</span> : '—'}</td>
                  <td>{p.discount > 0 ? <span className="admin-item-card-badge admin-badge-discount">{p.discount}% OFF</span> : '—'}</td>
                  <td><span style={{ color: p.inStock ? '#2D6A4F' : '#C0392B', fontWeight: 600 }}>{p.inStock ? '✓' : '✗'}</span></td>
                  <td>
                    <button onClick={() => handleEdit(p)} className="admin-btn admin-btn-primary admin-btn-sm">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="admin-btn admin-btn-danger admin-btn-sm" style={{ marginLeft: 6 }}>Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="admin-pagination">
            <button onClick={() => fetchProducts(pagination.page - 1)} disabled={pagination.page <= 1} className="admin-pagination-btn">←</button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(num => num === 1 || num === pagination.totalPages || Math.abs(num - pagination.page) <= 2)
              .reduce((acc, num, i, arr) => { if (i > 0 && num - arr[i-1] > 1) acc.push('...'); acc.push(num); return acc; }, [])
              .map((item, i) => item === '...' ? <span key={`d${i}`} style={{ padding: '0 4px', color: '#999' }}>...</span> : (
                <button key={item} onClick={() => fetchProducts(item)} className={`admin-pagination-btn${item === pagination.page ? ' active' : ''}`}>{item}</button>
              ))}
            <button onClick={() => fetchProducts(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages} className="admin-pagination-btn">→</button>
          </div>
        )}
      </div>

      {/* Mobile pagination */}
      {pagination.totalPages > 1 && (
        <div className="admin-pagination admin-mobile-pagination" style={{ marginTop: 16, background: '#fff', borderRadius: 12, display: 'none' }}>
          <button onClick={() => fetchProducts(pagination.page - 1)} disabled={pagination.page <= 1} className="admin-pagination-btn" style={{ flex: 1 }}>← Prev</button>
          <span style={{ padding: '8px 12px', fontSize: 13, color: '#666' }}>{pagination.page} / {pagination.totalPages}</span>
          <button onClick={() => fetchProducts(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages} className="admin-pagination-btn" style={{ flex: 1 }}>Next →</button>
        </div>
      )}

      {/* FAB */}
      {!showForm && (
        <button className="admin-fab" onClick={() => { setShowForm(true); setEditing(null); setForm({ productCode: '', name: '', brand: '', category: 'womenswear', price: '', originalPrice: '', discount: '', image: '', image2: '', image3: '', image4: '', sizes: '', description: '', inStock: true }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          +
        </button>
      )}
    </div>
  );
}
