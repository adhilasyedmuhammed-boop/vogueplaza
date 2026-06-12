import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="vp-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h1 style={{ fontSize: '72px', fontWeight: 200, color: '#1a1a1a', letterSpacing: '0.05em', marginBottom: '8px' }}>404</h1>
        <p style={{ fontSize: '18px', color: '#888', fontWeight: 300, marginBottom: '32px' }}>
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="btn-primary"
          style={{ width: 'auto', padding: '0 36px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: '50px' }}
        >
          Back to Home
        </Link>
      </div>
      <Footer />
    </>
  );
}
