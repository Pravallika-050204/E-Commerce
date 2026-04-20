import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { user } = useAuth();
  const [wishlists, setWishlists] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/wishlists?userId=${user.id}`)
        .then(res => res.json())
        .then(data => setWishlists(data));
    }
  }, [user]);

  const handleToggleWishlist = async (product) => {
    const existing = wishlists.find(w => w.productId === product.id);
    if (existing) {
      await fetch(`http://localhost:5000/wishlists/${existing.id}`, { method: 'DELETE' });
      setWishlists(wishlists.filter(w => w.id !== existing.id));
    }
  };

  const handleAddToCart = async (product) => {
    const res = await fetch(`http://localhost:5000/carts?userId=${user.id}&productId=${product.id}`);
    const existing = await res.json();
    if (existing.length > 0) {
      toast.error('Product is already in your cart!');
    } else {
      await fetch('http://localhost:5000/carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId: product.id, quantity: 1, product }),
      });
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success(`${product.title} added to cart!`);
    }
  };

  if (!user) {
    return (
      <div style={{ padding: '2rem var(--page-px)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1rem, 2vw, 1.4rem)' }}>
          Please{' '}
          <Link to="/login" className="text-decoration-underline" style={{ color: 'var(--text-primary)' }}>
            log in
          </Link>{' '}
          to view your wishlist.
        </h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem var(--page-px) 3rem' }}>
      {/* Header */}
      <div className="mb-4 pb-3 border-bottom" style={{ borderColor: 'var(--border-color) !important' }}>
        <h2 className="section-heading m-0">My Wishlist</h2>
        <p className="section-subtext mt-1 mb-0">
          {wishlists.length} item{wishlists.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {wishlists.length > 0 ? (
        /* 
          Responsive grid:
          Mobile  : 1 col
          Tablet  : 2 cols
          14" lap : 3 cols
          17"+des : 4 cols
        */
        <div className="row g-3 g-md-4 row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4">
          {wishlists.map(item => (
            <div className="col" key={item.id}>
              <ProductCard
                product={item.product}
                isWishlisted={true}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5 card border-0 shadow-sm rounded-4">
          <div className="card-body" style={{ padding: 'clamp(1.5rem, 4vw, 3rem)' }}>
            <h3 className="fw-bold mb-2" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.3rem)' }}>
              Your wishlist is empty
            </h3>
            <p className="text-secondary mb-4" style={{ fontSize: 'clamp(0.82rem, 1vw, 0.95rem)' }}>
              Save items you love so you won't lose sight of them.
            </p>
            <Link to="/products" className="btn btn-primary empty-state-btn">
              Explore Products
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
