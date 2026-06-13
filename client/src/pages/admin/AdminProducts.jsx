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
  const [form, setForm] = useState({ name: '', brand: '', category: 'womenswear', price: '', originalPrice: '', discount: '', image: '', image2: '', image3: '', image4: '', sizes: '', description: '', inStock: true });
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
    // Remove empty image fields
    if (!payload.image2) delete payload.image2;
    if (!payload.image3) delete payload.image3;
    if (!payload.image4) delete payload.image4;
    try {
      if (editing) {
        await axios.put(`/admin/products/${editing}`, payload, { headers });
        toast.success('Product updated successfully');
      } else {
        await axios.post('/admin/products', payload, { headers });
        toast.success('Product created successfully');
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', brand: '', category: 'womenswear', price: '', originalPrice: '', discount: '', image: '', image2: '', image3: '', image4: '', sizes: '', description: '', inStock: true });
      fetchProducts(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleEdit = async (p) => {
    const ok = await confirm({ title: 'Edit Product', message: `You are about to edit "${p.name}". Make sure to save your changes.`, type: 'warning' });
    if (!ok) return;
    setEditing(p._id);
    setForm({ name: p.name, brand: p.brand, category: p.category, price: p.price, originalPrice: p.originalPrice || '', discount: p.discount || '', image: p.image, image2: p.image2 || '', image3: p.image3 || '', image4: p.image4 || '', sizes: (p.sizes || []).join(', '), description: p.description || '', inStock: p.inStock });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const ok = await confirm({ title: 'Delete Product', message: 'Are you sure you want to delete this product? This action cannot be undone.', type: 'danger' });
    if (!ok) return;
    try {
      await axios.delete(`/admin/products/${id}`, { headers });
      toast.success('Product deleted');
      fetchProducts(pagination.page);
    } catch (err) {
      toast.error('Error deleting product');
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Products ({pagination.total})</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', brand: '', category: 'womenswear', price: '', originalPrice: '', discount: '', image: '', image2: '', image3: '', image4: '', sizes: '', description: '', inStock: true }); }}
          style={{ padding: '10px 20px', background: '#c9a96e', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
        >
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 24, borderRadius: 10, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <input placeholder="Product Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={inputStyle} />
            <input placeholder="Brand" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} required style={inputStyle} />
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inputStyle}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input placeholder="Original Price (MRP)" type="number" value={form.originalPrice} onChange={e => {
              const mrp = Number(e.target.value);
              const disc = Number(form.discount) || 0;
              const salePrice = disc > 0 && mrp > 0 ? Math.round(mrp - (mrp * disc / 100)) : form.price;
              setForm({...form, originalPrice: e.target.value, price: disc > 0 && mrp > 0 ? salePrice : form.price});
            }} style={inputStyle} />
            <input placeholder="Discount % (e.g. 30)" type="number" value={form.discount} onChange={e => {
              const disc = Number(e.target.value);
              const mrp = Number(form.originalPrice) || 0;
              const salePrice = disc > 0 && mrp > 0 ? Math.round(mrp - (mrp * disc / 100)) : form.price;
              setForm({...form, discount: e.target.value, price: disc > 0 && mrp > 0 ? salePrice : form.price});
            }} style={inputStyle} />
            <input placeholder="Sale Price (auto-calculated)" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required style={{...inputStyle, background: form.originalPrice && form.discount ? '#f0fff0' : '#fff', fontWeight: 600}} />
            <input placeholder="Sizes (comma separated)" value={form.sizes} onChange={e => setForm({...form, sizes: e.target.value})} style={inputStyle} />
          </div>

          {/* Image Upload Section */}
          <div style={{ marginTop: 20, padding: 16, background: '#f9f9f9', borderRadius: 8, border: '1px solid #eee' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: 14, color: '#555' }}>Product Images</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
              {['image', 'image2', 'image3', 'image4'].map((field, idx) => (
                <div key={field} style={{ textAlign: 'center' }}>
                  <label style={{ fontSize: 12, color: '#777', marginBottom: 4, display: 'block' }}>
                    {idx === 0 ? 'Main Image *' : `Image ${idx + 1}`}
                  </label>
                  {form[field] ? (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <img src={form[field]} alt="" style={{ width: 100, height: 120, objectFit: 'cover', borderRadius: 6, border: '1px solid #ddd' }} />
                      <button type="button" onClick={() => setForm(prev => ({ ...prev, [field]: '' }))} style={{ position: 'absolute', top: -6, right: -6, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: 11, lineHeight: '20px' }}>×</button>
                    </div>
                  ) : (
                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 100, height: 120, border: '2px dashed #ccc', borderRadius: 6, cursor: 'pointer', margin: '0 auto' }}>
                      <svg width="24" height="24" fill="none" stroke="#999" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                      <span style={{ fontSize: 11, color: '#999', marginTop: 4 }}>Upload</span>
                      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => handleImageUpload(e, field)} style={{ display: 'none' }} />
                    </label>
                  )}
                </div>
              ))}
            </div>
            {uploading && <p style={{ marginTop: 8, color: '#c9a96e', fontSize: 13 }}>Uploading image...</p>}
            <p style={{ marginTop: 8, fontSize: 12, color: '#999' }}>Or paste image URL directly:</p>
            <input placeholder="Main Image URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})} style={{ ...inputStyle, width: '100%', marginTop: 4, boxSizing: 'border-box' }} />
          </div>

          <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{ ...inputStyle, width: '100%', minHeight: 80, marginTop: 16, boxSizing: 'border-box' }} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <input type="checkbox" checked={form.inStock} onChange={e => setForm({...form, inStock: e.target.checked})} />
            In Stock
          </label>
          <button type="submit" disabled={uploading} style={{ marginTop: 16, padding: '10px 24px', background: uploading ? '#ccc' : '#1a1a1a', color: '#fff', border: 'none', borderRadius: 6, cursor: uploading ? 'not-allowed' : 'pointer', fontWeight: 600 }}>
            {editing ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      )}

      <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 700 }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '2px solid #eee' }}>
              <th style={thStyle}>Image</th>
              <th style={thStyle}>Code</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Brand</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>MRP</th>
              <th style={thStyle}>Discount</th>
              <th style={thStyle}>Stock</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={tdStyle}><img src={p.image} alt="" style={{ width: 45, height: 55, objectFit: 'cover', borderRadius: 4 }} /></td>
                <td style={tdStyle}><span style={{ fontFamily: 'monospace', fontSize: 11, background: '#f5f5f5', padding: '2px 6px', borderRadius: 3 }}>{p.productCode || '—'}</span></td>
                <td style={tdStyle}>{p.name}</td>
                <td style={tdStyle}>{p.brand}</td>
                <td style={tdStyle}>{p.category}</td>
                <td style={tdStyle}>
                  <span style={{ fontWeight: 600, color: p.originalPrice && p.discount ? '#27ae60' : '#111' }}>₹{p.price?.toLocaleString('en-IN')}</span>
                </td>
                <td style={tdStyle}>
                  {p.originalPrice ? <span style={{ textDecoration: 'line-through', color: '#999', fontSize: 12 }}>₹{p.originalPrice?.toLocaleString('en-IN')}</span> : <span style={{ color: '#ccc' }}>—</span>}
                </td>
                <td style={tdStyle}>
                  {p.discount > 0 ? <span style={{ background: '#fff3e0', color: '#e65100', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{p.discount}% OFF</span> : <span style={{ color: '#ccc' }}>—</span>}
                </td>
                <td style={tdStyle}><span style={{ color: p.inStock ? '#27ae60' : '#e74c3c' }}>{p.inStock ? '✓' : '✗'}</span></td>
                <td style={tdStyle}>
                  <button onClick={() => handleEdit(p)} style={btnStyle}>Edit</button>
                  <button onClick={() => handleDelete(p._id)} style={{ ...btnStyle, background: '#e74c3c', marginLeft: 6 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, padding: 16, borderTop: '1px solid #eee' }}>
            <button onClick={() => fetchProducts(pagination.page - 1)} disabled={pagination.page <= 1} style={pageBtnStyle(pagination.page <= 1)}>← Prev</button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(num => (
              <button key={num} onClick={() => fetchProducts(num)} style={{ ...pageBtnStyle(false), background: num === pagination.page ? '#1a1a1a' : '#fff', color: num === pagination.page ? '#fff' : '#333' }}>{num}</button>
            ))}
            <button onClick={() => fetchProducts(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages} style={pageBtnStyle(pagination.page >= pagination.totalPages)}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, outline: 'none' };
const thStyle = { padding: '12px 10px', textAlign: 'left', fontSize: 12, color: '#666', textTransform: 'uppercase' };
const tdStyle = { padding: '10px' };
const btnStyle = { padding: '5px 12px', background: '#c9a96e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 };
const pageBtnStyle = (disabled) => ({ padding: '6px 12px', border: '1px solid #ddd', borderRadius: 4, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, fontSize: 13, background: '#fff' });
