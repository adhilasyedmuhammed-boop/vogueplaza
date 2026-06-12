import { useState, useEffect } from 'react';
import axios from '../../api/axios';

const CATEGORIES = ['womenswear', 'menswear', 'accessories', 'kids', 'homedecor', 'footwear'];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', brand: '', category: 'womenswear', price: '', image: '', sizes: '', description: '', inStock: true });

  const token = localStorage.getItem('vp_token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/admin/products', { headers });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean) };
    try {
      if (editing) {
        await axios.put(`/admin/products/${editing}`, payload, { headers });
      } else {
        await axios.post('/admin/products', payload, { headers });
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', brand: '', category: 'womenswear', price: '', image: '', sizes: '', description: '', inStock: true });
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleEdit = (p) => {
    setEditing(p._id);
    setForm({ name: p.name, brand: p.brand, category: p.category, price: p.price, image: p.image, sizes: (p.sizes || []).join(', '), description: p.description || '', inStock: p.inStock });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await axios.delete(`/admin/products/${id}`, { headers });
      fetchProducts();
    } catch (err) {
      alert('Error deleting product');
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Products ({products.length})</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', brand: '', category: 'womenswear', price: '', image: '', sizes: '', description: '', inStock: true }); }}
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
            <input placeholder="Price" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required style={inputStyle} />
            <input placeholder="Image URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})} required style={inputStyle} />
            <input placeholder="Sizes (comma separated)" value={form.sizes} onChange={e => setForm({...form, sizes: e.target.value})} style={inputStyle} />
          </div>
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{ ...inputStyle, width: '100%', minHeight: 80, marginTop: 16, boxSizing: 'border-box' }} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <input type="checkbox" checked={form.inStock} onChange={e => setForm({...form, inStock: e.target.checked})} />
            In Stock
          </label>
          <button type="submit" style={{ marginTop: 16, padding: '10px 24px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
            {editing ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      )}

      <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 600 }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '2px solid #eee' }}>
              <th style={thStyle}>Image</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Brand</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Stock</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={tdStyle}><img src={p.image} alt="" style={{ width: 45, height: 55, objectFit: 'cover', borderRadius: 4 }} /></td>
                <td style={tdStyle}>{p.name}</td>
                <td style={tdStyle}>{p.brand}</td>
                <td style={tdStyle}>{p.category}</td>
                <td style={tdStyle}>₹{p.price}</td>
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
      </div>
    </div>
  );
}

const inputStyle = { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, outline: 'none' };
const thStyle = { padding: '12px 10px', textAlign: 'left', fontSize: 12, color: '#666', textTransform: 'uppercase' };
const tdStyle = { padding: '10px' };
const btnStyle = { padding: '5px 12px', background: '#c9a96e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 };
