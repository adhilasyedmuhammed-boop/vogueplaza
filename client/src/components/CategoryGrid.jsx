import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const fallbackCategories = [
  { slug: 'womenswear', name: 'Womenswear', image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=600' },
  { slug: 'menswear', name: 'Menswear', image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=600' },
  { slug: 'accessories', name: 'Accessories & Beauty', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600' },
  { slug: 'kids', name: 'Kids Corner', image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=600' },
  { slug: 'homedecor', name: 'Home Decor', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600' },
  { slug: 'footwear', name: 'Footwear', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600' },
];

export default function CategoryGrid() {
  const [categories, setCategories] = useState(fallbackCategories);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        if (Array.isArray(response.data) && response.data.length > 0) {
          setCategories(response.data);
        }
      } catch (error) {
        setCategories(fallbackCategories);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section id="categories" className="section-alt">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">SHOP BY CATEGORY</h2>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link key={category.slug} to={`/products?category=${category.slug}`} className="category-card">
              <div className="category-img-container">
                <img src={category.image} alt={category.name} className="category-img" loading="lazy" />
              </div>
              <div className="category-info">
                <h3 className="category-name">{category.name}</h3>
                <span className="category-link">View Details →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
