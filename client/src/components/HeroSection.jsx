export default function HeroSection() {
  return (
    <header id="home" className="hero">
      <img
        className="hero-img"
        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600"
        alt="Vogue Plaza Premium Luxury Retail Store"
        loading="eager"
      />
      <div className="hero-overlay">
        <h1 className="hero-title">VOGUE PLAZA</h1>
        <p className="hero-tagline">Elegant Living. Curated Aesthetics.</p>
      </div>
    </header>
  );
}
