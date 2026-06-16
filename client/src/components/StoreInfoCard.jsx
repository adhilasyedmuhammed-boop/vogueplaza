import { useEffect, useState } from 'react';
import api from '../api/axios';

const fallbackStore = {
  storeName: 'Vogue Plaza — Flagship City Mall',
  address: 'Ground Floor, Lulu Mall, Edapally, Kochi, Kerala 682024',
  phone: '+91 98765 43210',
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
              <span className="detail-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>
              <div className="rating-container">
                <span className="stars">★★★★★</span>
                <span className="review-count">(482 reviews)</span>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></span>
              <span>{storeInfo.address}</span>
            </div>
            <div className="detail-item">
              <span className="detail-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> Call Store
            </a>
            <a href="#map" className="btn-cta">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> Get Directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
