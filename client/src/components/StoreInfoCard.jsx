import { useEffect, useState } from 'react';
import api from '../api/axios';

const fallbackStore = {
  storeName: 'Vogue Plaza — Flagship City Mall',
  address: '123 Galleria Mall, Premium Avenue, Galleria District, NY 10001',
  phone: '+1 (555) 019-2834',
  businessHours: [
    { day: 'Monday', open: '10:00', close: '22:00' },
    { day: 'Tuesday', open: '10:00', close: '22:00' },
    { day: 'Wednesday', open: '10:00', close: '22:00' },
    { day: 'Thursday', open: '10:00', close: '22:00' },
    { day: 'Friday', open: '10:00', close: '23:00' },
    { day: 'Saturday', open: '10:00', close: '23:00' },
    { day: 'Sunday', open: '11:00', close: '21:00' },
  ],
  aboutText: '',
  stats: [],
};

const getLocalTime = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
  return date;
};

const isOpenNow = (businessHours) => {
  const dayIndex = new Date().getDay();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[dayIndex];
  const today = businessHours.find((entry) => entry.day === todayName);
  if (!today) return false;
  const now = new Date();
  const openTime = getLocalTime(today.open);
  const closeTime = getLocalTime(today.close);
  return now >= openTime && now <= closeTime;
};

export default function StoreInfoCard() {
  const [storeInfo, setStoreInfo] = useState(fallbackStore);
  const [hoursOpen, setHoursOpen] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await api.get('/store');
        setStoreInfo(response.data);
      } catch (error) {
        setStoreInfo(fallbackStore);
      }
    };
    fetchStore();
  }, []);

  useEffect(() => {
    setHoursOpen(isOpenNow(storeInfo.businessHours));
  }, [storeInfo]);

  const toggleAccordion = () => {
    setHoursOpen((prev) => !prev);
  };

  return (
    <section className="store-info-section">
      <div className="container">
        <div className="store-card">
          <div className="store-header">
            <h2 className="store-title">{storeInfo.storeName}</h2>
            <span className={`open-badge ${hoursOpen ? 'open' : 'closed'}`}>
              {hoursOpen ? 'Open Now' : 'Closed'}
            </span>
          </div>
          <div className="store-details">
            <div className="detail-item">
              <span className="detail-icon">⭐</span>
              <div className="rating-container">
                <span className="stars">★★★★★</span>
                <span className="review-count">(482 reviews)</span>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">📍</span>
              <span>{storeInfo.address}</span>
            </div>
            <div className="detail-item">
              <span className="detail-icon">📞</span>
              <span>{storeInfo.phone}</span>
            </div>
          </div>
          <div className="hours-accordion">
            <button type="button" className="accordion-trigger" onClick={toggleAccordion}>
              <span>Store Operating Hours</span>
              <span className={`accordion-icon ${hoursOpen ? 'rotated' : ''}`}>▼</span>
            </button>
            <div className={`accordion-content ${hoursOpen ? 'open' : 'closed'}`}>
              <div className="hours-list">
                {storeInfo.businessHours.map((item) => (
                  <div key={item.day} className="hours-day">
                    <span>{item.day}</span>
                    <span>{item.open} - {item.close}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="store-actions">
            <a href={`tel:${storeInfo.phone.replace(/[^0-9+]/g, '')}`} className="btn-cta">
              📞 Call Store
            </a>
            <a href="#map" className="btn-cta">
              📍 Get Directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
