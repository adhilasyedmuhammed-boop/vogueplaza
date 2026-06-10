import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useWishlist } from '../context/WishlistContext';

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <>
      <Navbar />
      <div className="page-banner">
        <h1 className="page-banner-title">My Wishlist</h1>
        <p className="page-banner-sub">{wishlist.length} saved items</p>
      </div>
      <div className="vp-container">
        <div className="wishlist-page">
          {wishlist.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">♡</div>
              <div className="cart-empty-title">Your wishlist is empty</div>
              <p className="cart-empty-text">Save items you love by clicking the heart icon on any product.</p>
              <Link to="/products" className="btn-primary" style={{ width:'auto', padding:'0 36px', textDecoration:'none', display:'inline-flex', alignItems:'center', height:'50px' }}>
                Explore Products →
              </Link>
            </div>
          ) : (
            <div className="product-grid-4">
              {wishlist.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
