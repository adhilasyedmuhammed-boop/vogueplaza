export default function AboutSection() {
  return (
    <section id="about" className="section-alt about-section">
      <div className="container about-inner">
        <div className="about-copy">
          <span className="eyebrow">ABOUT VOGUE PLAZA</span>
          <h2 className="section-title">Luxury fashion with local concierge service</h2>
          <p>
            Vogue Plaza blends timeless elegance with modern luxury. Our boutique offers curated apparel,
            accessories, and lifestyle essentials from the world\'s leading designers. Each guest receives
            personalised attention from our style consultants and access to exclusive collections.
          </p>
          <p>
            Whether you are dressing for a gala, business event, or weekend retreat, our showroom is
            designed to deliver unforgettable wardrobe moments and elevated retail experiences.
          </p>
        </div>
        <div className="about-visual">
          <div className="about-card">
            <span className="about-card-title">Tailored Styling</span>
            <p>Private appointments, tailoring, and bespoke recommendations that suit your lifestyle.</p>
          </div>
          <div className="about-card alt">
            <span className="about-card-title">Exclusive Finds</span>
            <p>Seasonal drops from globally renowned fashion houses and emerging luxury labels.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
