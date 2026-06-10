export default function MapSection() {
  return (
    <section id="location" className="section-alt map-section">
      <div className="container map-container">
        <div className="section-header">
          <h2 className="section-title">OUR LOCATION</h2>
          <p>Visit our flagship showroom in the heart of the city.</p>
        </div>
        <div className="map-frame">
          <iframe
            title="Vogue Plaza Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.870220519732!2d-122.4194161846813!3d37.77492927975957!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808c4b28f0bd%3A0x1fda92e2e2b04f85!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1690000000000"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
