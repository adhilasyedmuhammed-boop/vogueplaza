import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VideoHero from '../components/VideoHero';
import CategoryMasonry from '../components/CategoryMasonry';
import ProductSlider from '../components/ProductSlider';
import BrandScroller from '../components/BrandScroller';
import PromoBanners from '../components/PromoBanners';
import HeroBanner from '../components/HeroBanner';
import SEO from '../components/SEO';
import axios from '../api/axios';

/* ── fallback product data ──────────────────────────────────── */
const PRODUCTS = [
  { _id: 'p1',  name: 'Royal Crimson Anarkali Gown', brand: 'Gucci',       category: 'womenswear', price: 1299, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600', image2: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600', sizes: ['S','M','L'] },
  { _id: 'p2',  name: 'Navy Embellished Cape Gown', brand: 'Dior',        category: 'womenswear', price: 2099, image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600', image2: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600', sizes: ['S','M','L'] },
  { _id: 'p3',  name: 'Velvet Royal Sherwani',     brand: 'Armani',      category: 'menswear',   price: 2899, image: 'https://images.unsplash.com/photo-1593030103066-0093718efeb9?q=80&w=600', image2: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600', sizes: ['M','L','XL'] },
  { _id: 'p4',  name: 'Bespoke Brown Wool Suit',   brand: 'Versace',     category: 'menswear',   price: 1799, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600', image2: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600', sizes: ['48','50','52'] },
  { _id: 'p5',  name: 'Saddle Leather Shoulder Bag', brand: 'Prada',       category: 'accessories',price: 1599, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600', image2: 'https://images.unsplash.com/photo-1590874103328-eacb586d5c07?q=80&w=600', sizes: ['One Size'] },
  { _id: 'p6',  name: 'Gold Oyster Chronograph',   brand: 'Rolex',       category: 'accessories',price: 12999, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600', image2: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600', sizes: ['One Size'] },
  { _id: 'p7',  name: 'Classic Flap Chain Bag',    brand: 'Chanel',      category: 'accessories',price: 2899, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600', image2: 'https://images.unsplash.com/photo-1590874103328-eacb586d5c07?q=80&w=600', sizes: ['One Size'] },
  { _id: 'p8',  name: 'Plaid Pattern Tote Bag',    brand: 'Burberry',    category: 'accessories',price: 899,  image: 'https://images.unsplash.com/photo-1590874103328-eacb586d5c07?q=80&w=600', image2: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600', sizes: ['One Size'] },
];

const TRENDING = [
  { _id: 't1', name: 'Royal Crimson Anarkali Gown', brand: 'Gucci',       category: 'womenswear', price: 1299, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600', sizes: ['S','M','L'] },
  { _id: 't2', name: 'Navy Embellished Cape Gown', brand: 'Dior',        category: 'womenswear', price: 2099, image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600', sizes: ['S','M','L'] },
  { _id: 't3', name: 'Velvet Royal Sherwani',     brand: 'Armani',      category: 'menswear',   price: 2899, image: 'https://images.unsplash.com/photo-1593030103066-0093718efeb9?q=80&w=600', sizes: ['M','L','XL'] },
  { _id: 't4', name: 'Bespoke Brown Wool Suit',   brand: 'Versace',     category: 'menswear',   price: 1799, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600', sizes: ['48','50','52'] },
  { _id: 't5', name: 'Saddle Leather Shoulder Bag', brand: 'Prada',       category: 'accessories',price: 1599, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600', sizes: ['One Size'] },
  { _id: 't6', name: 'Gold Oyster Chronograph',   brand: 'Rolex',       category: 'accessories',price: 12999, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600', sizes: ['One Size'] },
  { _id: 't7', name: 'Classic Flap Chain Bag',    brand: 'Chanel',      category: 'accessories',price: 2899, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600', sizes: ['One Size'] },
  { _id: 't8', name: 'Plaid Pattern Tote Bag',    brand: 'Burberry',    category: 'accessories',price: 899,  image: 'https://images.unsplash.com/photo-1590874103328-eacb586d5c07?q=80&w=600', sizes: ['One Size'] },
];

const DEFAULT_WOMEN_SLIDES = [
  { img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600", text: "Embroidered Royal Anarkalis" },
  { img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600", text: "Luxury Cape Gowns" },
  { img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600", text: "Baroque Silk Abayas" },
  { img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600", text: "Silk Georgette Collection" }
];

const DEFAULT_MEN_SLIDES = [
  { img: "https://images.unsplash.com/photo-1593030103066-0093718efeb9?q=80&w=600", text: "Velvet Royal Sherwanis" },
  { img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600", text: "Bespoke Wool Suits" },
  { img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600", text: "Sharp Double-Breasted Suits" },
  { img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600", text: "Smart Casual Linen Sets" }
];

const DEFAULT_SPOTLIGHT = {
  brandName: 'BURBERRY',
  tagline: 'The Art of the Trench — Iconic British Heritage & Modern Tailoring',
  eyebrow: 'Brand Spotlight',
  videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-model-in-a-fashion-show-1165-large.mp4',
  posterImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1800',
  link: '/products?brand=burberry',
};

const DEFAULT_CONTACT = {
  heading: 'Our Flagship Store',
  description: 'Experience luxury fashion in person at our flagship store. Our personal stylists are ready to assist you with an unparalleled shopping experience.',
  address: '3rd Floor, City Mall, MG Road, Kochi, Kerala 682016',
  phone: '+91 484 123 4567',
  hours: 'Mon–Thu 10am–10pm | Fri–Sun 10am–11pm',
  whatsapp: '+91 98765 43210',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.0!2d76.2673!3d9.9312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b086d4b07ef0e41%3A0x8f7c4ce44e7b3c9a!2sMG%20Road%2C%20Kochi%2C%20Kerala!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
};

export default function Home() {
  const [newArrivals, setNewArrivals] = useState(PRODUCTS);
  const [trending,    setTrending]    = useState(TRENDING);
  const [formData, setFormData] = useState({ name: '', mobile: '', email: '', category: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const [womenSlides, setWomenSlides] = useState(DEFAULT_WOMEN_SLIDES);
  const [menSlides, setMenSlides] = useState(DEFAULT_MEN_SLIDES);
  const [spotlight, setSpotlight] = useState(DEFAULT_SPOTLIGHT);
  const [contact, setContact] = useState(DEFAULT_CONTACT);

  const [womenIdx, setWomenIdx] = useState(0);
  const [menIdx, setMenIdx] = useState(0);

  const spotlightVideoRef = useRef(null);
  const [spotlightError, setSpotlightError] = useState(false);

  useEffect(() => {
    if (spotlightVideoRef.current) {
      spotlightVideoRef.current.play().catch(() => {});
    }
  }, [spotlightError]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWomenIdx(prev => (prev + 1) % womenSlides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [womenSlides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMenIdx(prev => (prev + 1) % menSlides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [menSlides.length]);

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch home data from DB
        const homeRes = await axios.get('/homedata');
        if (homeRes.data) {
          const hd = homeRes.data;
          if (hd.spotlight) setSpotlight(hd.spotlight);
          if (hd.womenSlides?.length) setWomenSlides(hd.womenSlides);
          if (hd.menSlides?.length) setMenSlides(hd.menSlides);
          if (hd.contact) setContact(hd.contact);
        }
      } catch {}

      try {
        const [a, t] = await Promise.all([
          axios.get('/products?limit=12'),
          axios.get('/products?sort=trending&limit=8'),
        ]);
        if (a.data?.products?.length) setNewArrivals(a.data.products);
        if (t.data?.products?.length) setTrending(t.data.products);
      } catch {}
    };
    load();
  }, []);

  const handleContact = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try { await axios.post('/enquiries', formData); toast.success('Message sent successfully'); setFormData({ name: '', mobile: '', email: '', category: '', message: '' }); }
    catch { toast.error('Something went wrong. Please try again.'); }
    setSubmitting(false);
  };

  return (
    <>
      <SEO title="Home" description="Shop premium luxury fashion brands — Gucci, Prada, Versace, Armani, Burberry, Rolex, Chanel & Dior at Vogue Plaza Kerala. Authentic designer clothing, shoes, bags, watches, perfumes & accessories." />
      <Navbar />

      {/* 0 ── HERO BANNER CAROUSEL — Sale & Offers ─────────── */}
      <HeroBanner />

      {/* 1 ── HERO VIDEO — Cinematic first impression ──────── */}
      <VideoHero />

      {/* 2 ── SHOP BY CATEGORY — Quick navigation ─────────── */}
      <CategoryMasonry />

      {/* 3 ── NEW ARRIVALS — Fresh products ────────────────── */}
      <ProductSlider
        eyebrow="Just In"
        title="New Arrivals"
        products={newArrivals}
        viewAllLink="/new-arrivals"
        badge="new"
      />

      {/* 4 ── BRAND SPOTLIGHT — Featured brand video ────────── */}
      <section className="tc-editorial-banner brand-spotlight-section">
        {!spotlightError && spotlight.videoUrl ? (
          <video
            ref={spotlightVideoRef}
            className="tc-editorial-img"
            autoPlay
            muted
            loop
            playsInline
            poster={spotlight.posterImage}
            onError={() => setSpotlightError(true)}
          >
            <source
              src={spotlight.videoUrl}
              type="video/mp4"
            />
          </video>
        ) : (
          <img
            className="tc-editorial-img"
            src={spotlight.posterImage || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1800&auto=format&fit=crop"}
            alt={spotlight.brandName}
          />
        )}
        <div className="tc-editorial-overlay">
          <span className="tc-editorial-eyebrow">{spotlight.eyebrow}</span>
          <h2 className="tc-editorial-title" style={{ letterSpacing: '0.15em' }}>{spotlight.brandName}</h2>
          <p className="tc-editorial-sub">{spotlight.tagline}</p>
          <Link to={spotlight.link} className="tc-editorial-cta">Shop {spotlight.brandName} Collection →</Link>
        </div>
      </section>

      {/* 5 ── PROMO BANNERS — Offers & Flash Deals ─────────── */}
      <PromoBanners />

      {/* 6 ── TRENDING NOW — Popular products ──────────────── */}
      <ProductSlider
        eyebrow="Most Loved"
        title="Trending Now"
        products={trending}
        viewAllLink="/products"
      />

      {/* 7 ── BRAND SCROLLER — Trusted brands ─────────────── */}
      <BrandScroller />

      {/* 8 ── WOMEN & MEN EDITORIAL — Split banner ─────────── */}
      <section className="tc-split-banner vp-section-cream">
        <div className="vp-container">
          <div className="tc-split-grid">
            <div className="tc-split-card">
              <img
                src={womenSlides[womenIdx]?.img}
                alt="Women's Edit"
                loading="lazy"
                key={womenIdx}
                className="animate-fadein"
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s ease' }}
              />
              <div className="tc-split-overlay">
                <span className="tc-split-label animate-fadein" key={`lbl-w-${womenIdx}`}>{womenSlides[womenIdx]?.text}</span>
                <Link to="/products?category=womenswear" className="tc-split-btn">Shop Now →</Link>
              </div>
            </div>
            <div className="tc-split-card">
              <img
                src={menSlides[menIdx]?.img}
                alt="Men's Edit"
                loading="lazy"
                key={menIdx}
                className="animate-fadein"
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s ease' }}
              />
              <div className="tc-split-overlay">
                <span className="tc-split-label animate-fadein" key={`lbl-m-${menIdx}`}>{menSlides[menIdx]?.text}</span>
                <Link to="/products?category=menswear" className="tc-split-btn">Shop Now →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9 ── STORE INFO + CONTACT ────────────────────────── */}
      <section className="vp-section">
        <div className="vp-container">
          <div className="contact-grid">
            <div>
              <span className="section-eyebrow">Visit Us</span>
              <h2 className="section-heading">{contact.heading}</h2>
              <p className="about-paragraph">{contact.description}</p>
              {[
                { icon: '○', label: 'Address',    value: contact.address },
                { icon: '○', label: 'Phone',      value: contact.phone },
                { icon: '○', label: 'Hours',      value: contact.hours },
                { icon: '○', label: 'WhatsApp',   value: contact.whatsapp },
              ].map(it => (
                <div key={it.label} className="contact-info-item">
                  <div className="contact-info-icon">{it.icon}</div>
                  <div><div className="contact-info-label">{it.label}</div><div className="contact-info-value">{it.value}</div></div>
                </div>
              ))}
            </div>
            <div className="contact-form-card">
              <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: '24px' }}>Send a Message</h3>
              <form onSubmit={handleContact}>
                {[['Full Name','text','name','Your full name'],['Mobile',  'tel','mobile','+91 XXXXX'],['Email',   'email','email','your@email.com']].map(([label, type, key, ph]) => (
                  <div className="form-field" key={key}>
                    <label className="form-label">{label}</label>
                    <input className="form-input" type={type} placeholder={ph} value={formData[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value })} required />
                  </div>
                ))}
                <div className="form-field">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                    <option value="">Select…</option>
                    {['Womenswear','Menswear','Accessories','Footwear','Kids','Home Décor'].map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">Message</label>
                  <textarea className="form-input" placeholder="Your message..." value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} required style={{ minHeight: 80, resize: 'vertical' }} />
                </div>
                <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Sending…' : 'Send Message →'}</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <div className="map-section">
        <iframe
          className="map-iframe"
          src={contact.mapEmbedUrl}
          allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Vogue Plaza Location"
        />
      </div>

      <Footer />

      {/* WhatsApp */}
      <div className="whatsapp-bubble" onClick={() => window.open('https://wa.me/919876543210', '_blank')} role="button" aria-label="WhatsApp">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
        <span className="whatsapp-tooltip">Chat with us</span>
      </div>
    </>
  );
}
