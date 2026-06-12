import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useConfirm } from '../../components/ConfirmModal';
import { toast } from 'react-toastify';

export default function AdminHome() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const confirm = useConfirm();

  const token = localStorage.getItem('vp_token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const res = await axios.get('/admin/homedata', { headers });
      if (res.data) setData(res.data);
      else setData({
        spotlight: { brandName: '', tagline: '', eyebrow: '', videoUrl: '', posterImage: '', link: '' },
        womenSlides: [{ img: '', text: '' }],
        menSlides: [{ img: '', text: '' }],
        contact: { heading: '', description: '', address: '', phone: '', hours: '', whatsapp: '', mapEmbedUrl: '' },
        newArrivalsLimit: 12,
        trendingLimit: 8,
      });
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put('/admin/homedata', data, { headers });
      toast.success('Home page data saved!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving');
    }
    setSaving(false);
  };

  const updateSpotlight = (key, value) => {
    setData({ ...data, spotlight: { ...data.spotlight, [key]: value } });
  };

  const updateContact = (key, value) => {
    setData({ ...data, contact: { ...data.contact, [key]: value } });
  };

  const updateSlide = (type, index, key, value) => {
    const slides = [...data[type]];
    slides[index] = { ...slides[index], [key]: value };
    setData({ ...data, [type]: slides });
  };

  const addSlide = (type) => {
    setData({ ...data, [type]: [...data[type], { img: '', text: '' }] });
  };

  const removeSlide = async (type, index) => {
    const ok = await confirm({ title: 'Remove Slide', message: 'Are you sure you want to remove this slide?', type: 'danger' });
    if (!ok) return;
    const slides = data[type].filter((_, i) => i !== index);
    setData({ ...data, [type]: slides });
    toast.info('Slide removed. Click "Save All Changes" to apply.');
  };

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
  if (!data) return <div style={{ padding: 40, color: '#c00' }}>Failed to load</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Home Page Data</h1>
        <button onClick={handleSave} disabled={saving}
          style={{ padding: '10px 24px', background: '#c9a96e', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, opacity: saving ? 0.6 : 1 }}>
          {saving ? 'Saving...' : '💾 Save All Changes'}
        </button>
      </div>

      {/* Brand Spotlight */}
      <Section title="🎬 Brand Spotlight Section">
        <Grid>
          <Input label="Brand Name" value={data.spotlight.brandName} onChange={v => updateSpotlight('brandName', v)} />
          <Input label="Eyebrow Text" value={data.spotlight.eyebrow} onChange={v => updateSpotlight('eyebrow', v)} />
          <Input label="Tagline" value={data.spotlight.tagline} onChange={v => updateSpotlight('tagline', v)} full />
          <Input label="Video URL" value={data.spotlight.videoUrl} onChange={v => updateSpotlight('videoUrl', v)} />
          <Input label="Poster Image URL" value={data.spotlight.posterImage} onChange={v => updateSpotlight('posterImage', v)} />
          <Input label="Link" value={data.spotlight.link} onChange={v => updateSpotlight('link', v)} />
        </Grid>
      </Section>

      {/* Women's Slides */}
      <Section title="👗 Women's Split Banner Slides">
        {data.womenSlides.map((slide, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
            <input placeholder="Image URL" value={slide.img} onChange={e => updateSlide('womenSlides', i, 'img', e.target.value)} style={{ ...inputStyle, flex: '2 1 200px' }} />
            <input placeholder="Text" value={slide.text} onChange={e => updateSlide('womenSlides', i, 'text', e.target.value)} style={{ ...inputStyle, flex: '1 1 120px' }} />
            <button onClick={() => removeSlide('womenSlides', i)} style={delBtnStyle}>✕</button>
          </div>
        ))}
        <button onClick={() => addSlide('womenSlides')} style={addBtnStyle}>+ Add Slide</button>
      </Section>

      {/* Men's Slides */}
      <Section title="🤵 Men's Split Banner Slides">
        {data.menSlides.map((slide, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
            <input placeholder="Image URL" value={slide.img} onChange={e => updateSlide('menSlides', i, 'img', e.target.value)} style={{ ...inputStyle, flex: '2 1 200px' }} />
            <input placeholder="Text" value={slide.text} onChange={e => updateSlide('menSlides', i, 'text', e.target.value)} style={{ ...inputStyle, flex: '1 1 120px' }} />
            <button onClick={() => removeSlide('menSlides', i)} style={delBtnStyle}>✕</button>
          </div>
        ))}
        <button onClick={() => addSlide('menSlides')} style={addBtnStyle}>+ Add Slide</button>
      </Section>

      {/* Contact Section */}
      <Section title="📍 Contact & Store Section">
        <Grid>
          <Input label="Heading" value={data.contact.heading} onChange={v => updateContact('heading', v)} />
          <Input label="Phone" value={data.contact.phone} onChange={v => updateContact('phone', v)} />
          <Input label="Description" value={data.contact.description} onChange={v => updateContact('description', v)} full />
          <Input label="Address" value={data.contact.address} onChange={v => updateContact('address', v)} full />
          <Input label="Hours" value={data.contact.hours} onChange={v => updateContact('hours', v)} />
          <Input label="WhatsApp" value={data.contact.whatsapp} onChange={v => updateContact('whatsapp', v)} />
          <Input label="Map Embed URL" value={data.contact.mapEmbedUrl} onChange={v => updateContact('mapEmbedUrl', v)} full />
        </Grid>
      </Section>

      {/* Product Limits */}
      <Section title="📦 Product Section Settings">
        <Grid>
          <Input label="New Arrivals Limit" value={data.newArrivalsLimit} onChange={v => setData({ ...data, newArrivalsLimit: Number(v) })} type="number" />
          <Input label="Trending Limit" value={data.trendingLimit} onChange={v => setData({ ...data, trendingLimit: Number(v) })} type="number" />
        </Grid>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 10, padding: 24, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#1a1a1a' }}>{title}</h3>
      {children}
    </div>
  );
}

function Grid({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>{children}</div>;
}

function Input({ label, value, onChange, full, type = 'text' }) {
  return (
    <div style={full ? { gridColumn: '1 / -1' } : {}}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#666', marginBottom: 4, textTransform: 'uppercase' }}>{label}</label>
      <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} style={inputStyle} />
    </div>
  );
}

const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 13, outline: 'none', boxSizing: 'border-box' };
const addBtnStyle = { padding: '6px 14px', background: '#f0f0f0', border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer', fontSize: 12 };
const delBtnStyle = { padding: '6px 10px', background: '#fee', border: '1px solid #fcc', borderRadius: 4, cursor: 'pointer', color: '#c00', fontSize: 14 };
