import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import axios from '../api/axios';

const FALLBACK = [
  { _id: 'n1', name: 'Summer Silk Blouse', brand: 'Armani', category: 'womenswear', price: 79900, image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=600', sizes: ['XS','S','M','L'] },
  { _id: 'n2', name: 'Linen Trousers', brand: 'Hugo Boss', category: 'menswear', price: 59900, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4bff66?q=80&w=600', sizes: ['S','M','L','XL'] },
  { _id: 'n3', name: 'Canvas Sneakers', brand: 'Gucci', category: 'footwear', price: 89900, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600', sizes: ['6','7','8','9','10'] },
  { _id: 'n4', name: 'Raffia Tote Bag', brand: 'Prada', category: 'accessories', price: 109900, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600', sizes: ['One Size'] },
  { _id: 'n5', name: 'Resort Maxi Dress', brand: 'Versace', category: 'womenswear', price: 149900, image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600', sizes: ['XS','S','M'] },
  { _id: 'n6', name: 'Oxford Shirt', brand: 'Burberry', category: 'menswear', price: 49900, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600', sizes: ['S','M','L','XL'] },
  { _id: 'n7', name: 'Minimal Earrings', brand: 'Chanel', category: 'accessories', price: 29900, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600', sizes: ['One Size'] },
  { _id: 'n8', name: 'Kids Summer Set', brand: 'Dior', category: 'kids', price: 39900, image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=600', sizes: ['4Y','5Y','6Y','7Y'] },
];

export default function NewArrivals() {
  const [products, setProducts] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState('all');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/products?sort=newest&limit=16');
        if (res.data?.length) setProducts(res.data);
      } catch {}
      setLoading(false);
    };
    fetch();
  }, []);

  const cats = [
    { id: 'all', name: 'All' },
    { id: 'womenswear', name: 'Women' },
    { id: 'menswear', name: 'Men' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'kids', name: 'Kids' },
    { id: 'footwear', name: 'Footwear' },
  ];

  const filtered = selected === 'all' ? products : products.filter(p => p.category === selected);

  return (
    <>
      <Navbar />
      <div className="page-banner">
        <h1 className="page-banner-title">New Arrivals</h1>
        <p className="page-banner-sub">The latest additions to our luxury collection</p>
      </div>

      <section className="vp-section">
        <div className="vp-container">
          <div className="category-tabs">
            {cats.map(c => (
              <button key={c.id} className={`category-tab${selected === c.id ? ' active' : ''}`} onClick={() => setSelected(c.id)}>
                {c.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-screen"><div className="spinner"/><span className="loading-text">Loading New Arrivals</span></div>
          ) : (
            <div className="product-grid-4">
              {filtered.map((p, i) => <ProductCard key={p._id} product={p} badge="new" />)}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <div className="whatsapp-bubble" onClick={() => window.open('https://wa.me/919876543210','_blank')} role="button">
        💬<span className="whatsapp-tooltip">Chat with us</span>
      </div>
    </>
  );
}
