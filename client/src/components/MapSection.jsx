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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.5093932811257!2d76.28869687503288!3d9.931232290162766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0868fce7882431%3A0x71c17a8a9baae8e0!2sLulu%20Mall%20Kochi!5e0!3m2!1sen!2sin!4v1690000000000"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
