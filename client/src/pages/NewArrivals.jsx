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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
        <span className="whatsapp-tooltip">Chat with us</span>
      </div>
    </>
  );
}
