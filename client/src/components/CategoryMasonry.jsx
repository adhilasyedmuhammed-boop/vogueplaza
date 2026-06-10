import { Link } from 'react-router-dom';

const categories = [
  {
    slug: 'womenswear',
    name: 'Women',
    sub: 'New Season',
    image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=900&auto=format&fit=crop',
    span: 'large', // takes more space
  },
  {
    slug: 'menswear',
    name: 'Men',
    sub: 'Summer Edit',
    image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=700&auto=format&fit=crop',
    span: 'medium',
  },
  {
    slug: 'accessories',
    name: 'Accessories',
    sub: 'Icon Pieces',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop',
    span: 'small',
  },
  {
    slug: 'kids',
    name: 'Kids',
    sub: 'Little Luxuries',
    image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=600&auto=format&fit=crop',
    span: 'small',
  },
  {
    slug: 'footwear',
    name: 'Footwear',
    sub: 'Step Up',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=700&auto=format&fit=crop',
    span: 'medium',
  },
];

export default function CategoryMasonry() {
  return (
    <section className="tc-category-section">
      <div className="vp-container">
        <div className="tc-category-header">
          <span className="section-eyebrow">Explore</span>
          <h2 className="tc-section-title">Shop by Category</h2>
        </div>
        <div className="tc-masonry">
          {/* Left: 1 large card */}
          <Link to={`/products?category=${categories[0].slug}`} className="tc-cat-card large">
            <img src={categories[0].image} alt={categories[0].name} loading="lazy" />
            <div className="tc-cat-overlay">
              <span className="tc-cat-sub">{categories[0].sub}</span>
              <span className="tc-cat-name">{categories[0].name}</span>
              <span className="tc-cat-cta">Shop Now →</span>
            </div>
          </Link>

          {/* Right: 2x2 grid */}
          <div className="tc-masonry-right">
            {categories.slice(1).map((cat) => (
              <Link key={cat.slug} to={`/products?category=${cat.slug}`} className="tc-cat-card small">
                <img src={cat.image} alt={cat.name} loading="lazy" />
                <div className="tc-cat-overlay">
                  <span className="tc-cat-sub">{cat.sub}</span>
                  <span className="tc-cat-name">{cat.name}</span>
                  <span className="tc-cat-cta">Shop Now →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
