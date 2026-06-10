import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import axios from '../api/axios';

const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'womenswear', name: 'Women' },
  { id: 'menswear', name: 'Men' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'kids', name: 'Kids' },
  { id: 'homedecor', name: 'Home' },
  { id: 'footwear', name: 'Footwear' },
];
const BRANDS = ['Armani', 'Gucci', 'Versace', 'Burberry', 'Prada', 'Rolex', 'Chanel', 'Dior'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', 'One Size'];

const fallback = [
  { _id: '1', name: 'Cashmere Coat', brand: 'Armani', category: 'womenswear', price: 129900, image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=600', sizes: ['S','M','L','XL'] },
  { _id: '2', name: 'Silk Dress', brand: 'Gucci', category: 'womenswear', price: 89900, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600', sizes: ['XS','S','M','L'] },
  { _id: '3', name: 'Tailored Suit', brand: 'Versace', category: 'menswear', price: 249900, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600', sizes: ['M','L','XL'] },
  { _id: '4', name: 'Leather Jacket', brand: 'Burberry', category: 'menswear', price: 189900, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600', sizes: ['S','M','L'] },
  { _id: '5', name: 'Designer Handbag', brand: 'Prada', category: 'accessories', price: 159900, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600', sizes: ['One Size'] },
  { _id: '6', name: 'Luxury Watch', brand: 'Rolex', category: 'accessories', price: 1299900, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600', sizes: ['One Size'] },
  { _id: '7', name: 'Kids Party Dress', brand: 'Chanel', category: 'kids', price: 49900, image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=600', sizes: ['4Y','5Y','6Y','7Y'] },
  { _id: '8', name: 'Boys Blazer', brand: 'Dior', category: 'kids', price: 59900, image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=600', sizes: ['4Y','5Y','6Y'] },
  { _id: '9', name: 'Luxury Vase', brand: 'Armani', category: 'homedecor', price: 39900, image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600', sizes: ['One Size'] },
  { _id: '10', name: 'Cashmere Throw', brand: 'Gucci', category: 'homedecor', price: 79900, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600', sizes: ['One Size'] },
  { _id: '11', name: 'Designer Heels', brand: 'Versace', category: 'footwear', price: 119900, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600', sizes: ['5','6','7','8','9'] },
  { _id: '12', name: 'Chelsea Boots', brand: 'Burberry', category: 'footwear', price: 89900, image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600', sizes: ['6','7','8','9','10'] },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initCat = searchParams.get('category') || 'all';
  const initSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState(initCat);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterOpen, setFilterOpen] = useState({ category: true, brand: true, price: true, size: false });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const cat = searchParams.get('category') || 'all';
        const q = searchParams.get('search') || '';
        const res = await axios.get(`/api/products?category=${cat}&search=${q}`);
        if (res.data?.length) setProducts(res.data);
        else setProducts(fallback);
      } catch {
        setProducts(fallback);
      }
      setLoading(false);
    };
    fetchProducts();
    setSelectedCat(searchParams.get('category') || 'all');
  }, [searchParams]);

  const handleCatChange = (id) => {
    setSelectedCat(id);
    const params = new URLSearchParams(searchParams);
    if (id === 'all') params.delete('category');
    else params.set('category', id);
    setSearchParams(params);
  };

  const toggleBrand = (b) => setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  const toggleSize = (s) => setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleFilter = (key) => setFilterOpen(prev => ({ ...prev, [key]: !prev[key] }));

  const filtered = products
    .filter(p => selectedCat === 'all' || p.category === selectedCat)
    .filter(p => selectedBrands.length === 0 || selectedBrands.includes(p.brand))
    .filter(p => selectedSizes.length === 0 || p.sizes?.some(s => selectedSizes.includes(s)))
    .filter(p => !priceMin || p.price >= Number(priceMin) * 100)
    .filter(p => !priceMax || p.price <= Number(priceMax) * 100)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0; // newest
    });

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedSizes([]);
    setPriceMin('');
    setPriceMax('');
    setSortBy('newest');
  };

  return (
    <>
      <Navbar />

      <div className="page-banner">
        <h1 className="page-banner-title">
          {selectedCat === 'all' ? 'All Products' : CATEGORIES.find(c => c.id === selectedCat)?.name || 'Products'}
        </h1>
        <p className="page-banner-sub">{filtered.length} items found</p>
      </div>

      <div className="vp-container">
        {/* Category Tabs */}
        <div className="category-tabs" style={{ marginTop: '24px' }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} className={`category-tab${selectedCat === cat.id ? ' active' : ''}`} onClick={() => handleCatChange(cat.id)}>
              {cat.name}
            </button>
          ))}
        </div>

        <div className="products-layout">
          {/* Sidebar */}
          <aside className={`sidebar-filters${mobileSidebarOpen ? ' mobile-open' : ''}`}>
            <div className="sidebar-title">
              Filters
              <button className="sidebar-clear-btn" onClick={clearFilters}>Clear All</button>
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <div className="filter-group-header" onClick={() => toggleFilter('category')}>
                <span className="filter-group-title">Category</span>
                <span className={`filter-group-icon${filterOpen.category ? ' open' : ''}`}>▼</span>
              </div>
              {filterOpen.category && (
                <div className="filter-group-body">
                  {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                    <label key={cat.id} className="filter-checkbox-item">
                      <input type="checkbox" checked={selectedCat === cat.id} onChange={() => handleCatChange(cat.id)} />
                      <span className="filter-checkbox-label">{cat.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Brand Filter */}
            <div className="filter-group">
              <div className="filter-group-header" onClick={() => toggleFilter('brand')}>
                <span className="filter-group-title">Brand</span>
                <span className={`filter-group-icon${filterOpen.brand ? ' open' : ''}`}>▼</span>
              </div>
              {filterOpen.brand && (
                <div className="filter-group-body">
                  {BRANDS.map(b => (
                    <label key={b} className="filter-checkbox-item">
                      <input type="checkbox" checked={selectedBrands.includes(b)} onChange={() => toggleBrand(b)} />
                      <span className="filter-checkbox-label">{b}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <div className="filter-group-header" onClick={() => toggleFilter('price')}>
                <span className="filter-group-title">Price (₹)</span>
                <span className={`filter-group-icon${filterOpen.price ? ' open' : ''}`}>▼</span>
              </div>
              {filterOpen.price && (
                <div className="filter-group-body">
                  <div className="price-range-inputs">
                    <input type="number" placeholder="Min" className="price-range-input" value={priceMin} onChange={e => setPriceMin(e.target.value)} />
                    <span className="price-range-sep">–</span>
                    <input type="number" placeholder="Max" className="price-range-input" value={priceMax} onChange={e => setPriceMax(e.target.value)} />
                  </div>
                </div>
              )}
            </div>

            {/* Size Filter */}
            <div className="filter-group">
              <div className="filter-group-header" onClick={() => toggleFilter('size')}>
                <span className="filter-group-title">Size</span>
                <span className={`filter-group-icon${filterOpen.size ? ' open' : ''}`}>▼</span>
              </div>
              {filterOpen.size && (
                <div className="filter-group-body">
                  <div className="size-filter-grid">
                    {SIZES.map(s => (
                      <button key={s} className={`size-chip${selectedSizes.includes(s) ? ' selected' : ''}`} onClick={() => toggleSize(s)}>{s}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Products Right */}
          <div className="products-right">
            <div className="products-top-bar">
              <p className="products-count">
                Showing <strong>{filtered.length}</strong> products
              </p>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button
                  style={{ display: 'none', padding: '8px 14px', border: '1px solid #E8E8E8', borderRadius: '2px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', background: '#fff' }}
                  className="mobile-filter-toggle"
                  onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                >
                  ⊟ Filters
                </button>
                <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="newest">Sort: Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name: A–Z</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="loading-screen"><div className="spinner" /><span className="loading-text">Loading Products</span></div>
            ) : filtered.length === 0 ? (
              <div className="cart-empty">
                <div className="cart-empty-icon">🔍</div>
                <div className="cart-empty-title">No Products Found</div>
                <p className="cart-empty-text">Try adjusting your filters or browse all categories.</p>
                <button className="btn-primary" style={{ width: 'auto', padding: '0 32px' }} onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <div className="products-grid-container">
                {filtered.map((p, i) => (
                  <ProductCard key={p._id} product={p} badge={i < 2 ? 'new' : undefined} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      <div className="whatsapp-bubble" onClick={() => window.open('https://wa.me/919876543210', '_blank')} role="button">
        💬<span className="whatsapp-tooltip">Chat with us</span>
      </div>
    </>
  );
}
