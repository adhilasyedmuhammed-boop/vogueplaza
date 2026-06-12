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
  { _id: '1', name: 'Cashmere Coat', brand: 'Armani', category: 'womenswear', price: 1299, image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=600', sizes: ['S','M','L','XL'] },
  { _id: '2', name: 'Silk Dress', brand: 'Gucci', category: 'womenswear', price: 899, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600', sizes: ['XS','S','M','L'] },
  { _id: '3', name: 'Tailored Suit', brand: 'Versace', category: 'menswear', price: 2499, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600', sizes: ['M','L','XL'] },
  { _id: '4', name: 'Leather Jacket', brand: 'Burberry', category: 'menswear', price: 1899, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600', sizes: ['S','M','L'] },
  { _id: '5', name: 'Designer Handbag', brand: 'Prada', category: 'accessories', price: 1599, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600', sizes: ['One Size'] },
  { _id: '6', name: 'Luxury Watch', brand: 'Rolex', category: 'accessories', price: 12999, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600', sizes: ['One Size'] },
  { _id: '7', name: 'Kids Party Dress', brand: 'Chanel', category: 'kids', price: 499, image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=600', sizes: ['4Y','5Y','6Y','7Y'] },
  { _id: '8', name: 'Boys Blazer', brand: 'Dior', category: 'kids', price: 599, image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=600', sizes: ['4Y','5Y','6Y'] },
  { _id: '9', name: 'Luxury Vase', brand: 'Armani', category: 'homedecor', price: 399, image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600', sizes: ['One Size'] },
  { _id: '10', name: 'Cashmere Throw', brand: 'Gucci', category: 'homedecor', price: 799, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600', sizes: ['One Size'] },
  { _id: '11', name: 'Designer Heels', brand: 'Versace', category: 'footwear', price: 1199, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600', sizes: ['5','6','7','8','9'] },
  { _id: '12', name: 'Chelsea Boots', brand: 'Burberry', category: 'footwear', price: 899, image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600', sizes: ['6','7','8','9','10'] },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initCat = searchParams.get('category') || 'all';
  const initSearch = searchParams.get('search') || '';
  const initBrand = searchParams.get('brand') || '';

  const [products, setProducts] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState(initCat);
  const [selectedBrands, setSelectedBrands] = useState(initBrand ? [initBrand] : []);
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
        const brand = searchParams.get('brand') || '';
        let url = `/products?category=${cat}&search=${q}`;
        if (brand) url += `&brand=${brand}`;
        const res = await axios.get(url);
        if (res.data?.length) setProducts(res.data);
        else setProducts(fallback);
      } catch {
        setProducts(fallback);
      }
      setLoading(false);
    };
    fetchProducts();
    setSelectedCat(searchParams.get('category') || 'all');
    const brandParam = searchParams.get('brand');
    if (brandParam) {
      // Match URL param (lowercase) to BRANDS array (capitalized)
      const matched = BRANDS.find(b => b.toLowerCase() === brandParam.toLowerCase());
      setSelectedBrands(matched ? [matched] : [brandParam]);
    }
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
    .filter(p => selectedBrands.length === 0 || selectedBrands.some(b => p.brand?.toLowerCase() === b.toLowerCase()))
    .filter(p => selectedSizes.length === 0 || p.sizes?.some(s => selectedSizes.includes(s)))
    .filter(p => !priceMin || p.price >= Number(priceMin))
    .filter(p => !priceMax || p.price <= Number(priceMax))
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
          {searchParams.get('brand')
            ? `${searchParams.get('brand').charAt(0).toUpperCase() + searchParams.get('brand').slice(1)} Collection`
            : selectedCat === 'all' ? 'All Products' : CATEGORIES.find(c => c.id === selectedCat)?.name || 'Products'}
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
          {/* Filter Backdrop for mobile */}
          <div className={`filter-backdrop${mobileSidebarOpen ? ' active' : ''}`} onClick={() => setMobileSidebarOpen(false)} />

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
                      <input type="radio" name="category" checked={selectedCat === cat.id} onChange={() => handleCatChange(cat.id)} />
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
                  className="mobile-filter-toggle"
                  onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                >
                  {mobileSidebarOpen ? '✕ Close' : '⊟ Filters'}
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
                <div className="cart-empty-icon" style={{ fontSize: '48px', opacity: 0.3 }}>○</div>
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
        <span className="whatsapp-tooltip">Chat with us</span>
      </div>
    </>
  );
}
