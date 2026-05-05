import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import './Home.css';

const categories = [
  { name: "Electronics", icon: "📱", count: 3, color: "#3B82F6" },
  { name: "Fashion", icon: "👕", count: 3, color: "#8B5CF6" },
  { name: "Kitchen", icon: "🍳", count: 3, color: "#10B981" },
  { name: "Sports", icon: "⚽", count: 3, color: "#F59E0B" }
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const featuredProducts = products.filter(p => p.badge).slice(0, 6);
  // If not enough badges, just fallback to first few
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 6);

  return (
    <main className="home-page" id="home-page">
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-tag">🔥 New Collection 2025</span>
            <h1 className="hero-title">
              Discover Products <br/>
              <span className="gradient-text">That Define You</span>
            </h1>
            <p className="hero-subtitle">
              Curated premium products for the modern lifestyle. Quality craftsmanship meets unbeatable value.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary hero-cta">
                Shop Now
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
              <Link to="/products" className="btn btn-outline">Explore Deals</Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">12K+</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-number">98%</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-number">4.9★</span>
                <span className="stat-label">Average Rating</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-grid">
              <img src="https://picsum.photos/seed/hero1/300/400" alt="Fashion" className="hero-img hero-img-1" />
              <img src="https://picsum.photos/seed/hero2/300/300" alt="Electronics" className="hero-img hero-img-2" />
              <img src="https://picsum.photos/seed/hero3/300/300" alt="Home" className="hero-img hero-img-3" />
            </div>
            <div className="hero-float-badge badge-1">
              <span>⚡</span> Fast Delivery
            </div>
            <div className="hero-float-badge badge-2">
              <span>🛡️</span> Secure Checkout
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section categories-section" id="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Browse our curated collections</p>
          <div className="categories-grid">
            {categories.map(cat => (
              <Link to="/products" key={cat.name} className="category-card" style={{ '--cat-color': cat.color }}>
                <span className="cat-icon">{cat.icon}</span>
                <h3 className="cat-name">{cat.name}</h3>
                <span className="cat-count">{cat.count} products</span>
                <div className="cat-arrow">→</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section featured-section" id="featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">Hand-picked just for you</p>
            </div>
            <Link to="/products" className="btn btn-outline">View All →</Link>
          </div>
          <div className="featured-grid">
            {loading ? (
              <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '40px' }}>Loading products...</div>
            ) : displayProducts.map(product => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section newsletter-section" id="newsletter-section">
        <div className="container">
          <div className="newsletter-card">
            <div className="newsletter-content">
              <span className="newsletter-tag">💌 Stay Updated</span>
              <h2 className="newsletter-title">Get Exclusive Deals & Updates</h2>
              <p className="newsletter-text">Subscribe to our newsletter and get 15% off your first order. No spam, unsubscribe anytime.</p>
              <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
                <input type="email" placeholder="Enter your email address" className="newsletter-input" />
                <button type="submit" className="btn btn-primary">Subscribe</button>
              </form>
            </div>
            <div className="newsletter-decoration">
              <div className="deco-circle deco-1" />
              <div className="deco-circle deco-2" />
              <div className="deco-circle deco-3" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
