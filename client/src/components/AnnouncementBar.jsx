import { useState, useEffect, useRef } from 'react';

const messages = [
  '✦ FREE SHIPPING ON ORDERS ABOVE ₹5,000',
  '✦ EASY 15-DAY RETURNS',
  '✦ SHOP THE NEW SUMMER COLLECTION',
  '✦ EXCLUSIVE BRANDS CURATED FOR YOU',
  '✦ VISIT OUR FLAGSHIP STORE',
  '✦ NEW ARRIVALS EVERY WEEK',
];

export default function AnnouncementBar() {
  const repeated = [...messages, ...messages, ...messages];

  return (
    <div className="announcement-bar">
      <div className="announcement-ticker">
        {repeated.map((msg, i) => (
          <span key={i} className="announcement-item">
            {msg}
            <span className="sep">|</span>
          </span>
        ))}
      </div>
    </div>
  );
}
