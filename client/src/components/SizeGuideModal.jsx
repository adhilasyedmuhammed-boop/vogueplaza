import { useState, useEffect } from 'react';

const SIZE_DATA = {
  womenswear: {
    title: "Women's Clothing Size Guide",
    headers: ['Size', 'Bust (in)', 'Waist (in)', 'Hips (in)'],
    rows: [
      ['XS', '32-33', '24-25', '34-35'],
      ['S', '34-35', '26-27', '36-37'],
      ['M', '36-37', '28-29', '38-39'],
      ['L', '38-40', '30-32', '40-42'],
      ['XL', '41-43', '33-35', '43-45'],
    ],
  },
  menswear: {
    title: "Men's Clothing Size Guide",
    headers: ['Size', 'Chest (in)', 'Waist (in)', 'Collar (in)'],
    rows: [
      ['S', '36-38', '30-32', '14.5-15'],
      ['M', '39-41', '33-35', '15.5-16'],
      ['L', '42-44', '36-38', '16.5-17'],
      ['XL', '45-47', '39-41', '17.5-18'],
      ['XXL', '48-50', '42-44', '18.5-19'],
    ],
  },
  footwear: {
    title: 'Footwear Size Guide',
    headers: ['EU', 'UK', 'US (M)', 'US (W)', 'CM'],
    rows: [
      ['36', '3.5', '4.5', '6', '22.5'],
      ['37', '4', '5', '6.5', '23'],
      ['38', '5', '6', '7.5', '24'],
      ['39', '6', '7', '8.5', '25'],
      ['40', '6.5', '7.5', '9', '25.5'],
      ['41', '7.5', '8.5', '10', '26'],
      ['42', '8', '9', '10.5', '27'],
      ['43', '9', '10', '11.5', '27.5'],
      ['44', '9.5', '10.5', '12', '28.5'],
    ],
  },
  accessories: {
    title: 'Ring Size Guide',
    headers: ['Size', 'US', 'UK', 'Circumference (mm)'],
    rows: [
      ['5', '5', 'J½', '49.3'],
      ['6', '6', 'L½', '52.4'],
      ['7', '7', 'N½', '55.3'],
      ['8', '8', 'P½', '58.1'],
      ['9', '9', 'R½', '60.8'],
    ],
  },
};

export default function SizeGuideModal({ category, onClose }) {
  const [activeTab, setActiveTab] = useState(category && SIZE_DATA[category] ? category : 'womenswear');
  const data = SIZE_DATA[activeTab];

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content size-guide-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 className="modal-title">Size Guide</h2>

        <div className="size-guide-tabs">
          {Object.entries(SIZE_DATA).map(([key, val]) => (
            <button
              key={key}
              className={`size-guide-tab${activeTab === key ? ' active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              {key === 'womenswear' ? 'Women' : key === 'menswear' ? 'Men' : key === 'footwear' ? 'Shoes' : 'Rings'}
            </button>
          ))}
        </div>

        <h3 className="size-guide-subtitle">{data.title}</h3>

        <div className="size-guide-table-wrap">
          <table className="size-guide-table">
            <thead>
              <tr>{data.headers.map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {data.rows.map((row, i) => (
                <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="size-guide-tip">
          <strong>Tip:</strong> If you're between sizes, we recommend sizing up for a more comfortable fit.
        </div>
      </div>
    </div>
  );
}
