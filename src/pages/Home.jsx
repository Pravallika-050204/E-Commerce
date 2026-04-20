import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const fullText =
  "Discover handpicked collections across makeup, footwear, bags, accessories and more — delivered to your door.";

/* ── Category quick-links ─────────────────────────────── */
const CATEGORIES = [
  { label: '💄 Makeup', to: '/category/Makeup' },
  { label: '👟 Sneakers', to: '/category/Sneakers' },
  { label: '👠 Footwear', to: '/category/Footwear' },
  { label: '👜 Bags', to: '/category/Bags' },
  { label: '🧸 Plush Toys', to: '/category/Plush Toys' },
  { label: '💍 Accessories', to: '/category/Accessories' },
];

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&auto=format&fit=crop&q=90",
  "https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aGFuZCUyMGJhZ3N8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFrZXVwfGVufDB8fDB8fHww"
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [wishlists, setWishlists] = useState([]);
  const [carts, setCarts] = useState([]);
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const { user } = useAuth();

  const fetchUserData = () => {
    if (user) {
      fetch(`https://e-commerce-zjcq.onrender.com/wishlists?userId=${user.id}`)
        .then(r => r.json())
        .then(data => setWishlists(data));
      fetch(`https://e-commerce-zjcq.onrender.com/carts?userId=${user.id}`)
        .then(r => r.json())
        .then(data => setCarts(data));
    } else {
      setWishlists([]);
      setCarts([]);
    }
  };

  useEffect(() => {
    fetch('https://e-commerce-zjcq.onrender.com/products?_limit=3')
      .then(r => r.json())
      .then(data => setFeaturedProducts(data));
  }, []);

  useEffect(() => {
    fetchUserData();
    window.addEventListener('cartUpdated', fetchUserData);
    return () => window.removeEventListener('cartUpdated', fetchUserData);
  }, [user]);

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + fullText.charAt(index));
        setIndex(prev => prev + 1);
      }, 25);

      return () => clearTimeout(timeout);
    }
  }, [index]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIdx(prev => (prev + 1) % HERO_IMAGES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleWishlist = async (product) => {
    if (!user) return;
    const existing = wishlists.find(w => w.productId === product.id);
    if (existing) {
      await fetch(`https://e-commerce-zjcq.onrender.com/wishlists/${existing.id}`, { method: 'DELETE' });
      setWishlists(wishlists.filter(w => w.id !== existing.id));
    } else {
      const res = await fetch('https://e-commerce-zjcq.onrender.com/wishlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId: product.id, product }),
      });
      const data = await res.json();
      setWishlists([...wishlists, data]);
      toast.success(`${product.title} added to Wishlist!`);
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) return;
    const res = await fetch(`https://e-commerce-zjcq.onrender.com/carts?userId=${user.id}&productId=${product.id}`);
    const existing = await res.json();
    if (existing.length > 0) {
      toast.error('Product is already in your cart!');
    } else {
      await fetch('https://e-commerce-zjcq.onrender.com/carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId: product.id, quantity: 1, product }),
      });
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success(`${product.title} added to Cart!`);
    }
  };

  const handleUpdateCartQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      await fetch(`https://e-commerce-zjcq.onrender.com/carts/${cartItemId}`, { method: 'DELETE' });
    } else {
      await fetch(`https://e-commerce-zjcq.onrender.com/carts/${cartItemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });
    }
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-bg-blob" aria-hidden="true" />

        <div className="hero-text">
          <span className="hero-eyebrow">🛍️ New Season Arrivals</span>

          <h1 className="hero-heading">
            Shop Smart,<br />
            <span className="hero-heading-accent">Live Better</span>
          </h1>

          <p className="hero-subtext">
            {displayText}
          </p>

          <div className="hero-actions">
            <Link to="/products" className="hero-btn-primary">
              Shop Now →
            </Link>
            <Link to="/products" className="hero-btn-secondary">
              Explore Categories
            </Link>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <strong>50+</strong>
              <span>Products</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <strong>6</strong>
              <span>Categories</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <strong>Free</strong>
              <span>Shipping</span>
            </div>
          </div>
        </div>

        <div className="hero-image-wrap">
          <div className="hero-image-ring" aria-hidden="true" />
          {HERO_IMAGES.map((imgSrc, i) => (
            <img
              key={imgSrc}
              src={imgSrc}
              alt={`Slide ${i + 1}`}
              className={`hero-image ${i === currentImageIdx ? 'hero-img-visible' : 'hero-img-hidden'}`}
              loading="eager"
              style={{
                position: i === 0 ? 'relative' : 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: i === currentImageIdx ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out',
                zIndex: i === currentImageIdx ? 1 : 0
              }}
            />
          ))}
          <div className="hero-badge">
            <span className="hero-badge-icon">✨</span>
            <div>
              <div className="hero-badge-title">New Arrivals</div>
              <div className="hero-badge-sub">Just dropped this week</div>
            </div>
          </div>
        </div>
      </section>

      <section className="category-strip">
        <p className="category-strip-label">Browse by Category</p>
        <div className="category-strip-pills">
          {CATEGORIES.map(cat => (
            <Link key={cat.to} to={cat.to} className="category-pill">
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section style={{ padding: '2rem var(--page-px) 3.5rem' }}>
          <h2 className="section-heading mb-1">Featured Products</h2>
          <p className="section-subtext mb-4">Hand-picked favourites just for you</p>
          <div className="row g-3 g-md-4">
            {featuredProducts.map(product => (
              <div className="col-12 col-sm-6 col-lg-4" key={product.id}>
                <ProductCard
                  product={product}
                  isWishlisted={wishlists.some(w => w.productId === product.id)}
                  cartItem={carts.find(c => c.productId === product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onAddToCart={handleAddToCart}
                  onUpdateQuantity={handleUpdateCartQuantity}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;