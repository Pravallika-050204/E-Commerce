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
        body: JSON.stringify({ userId: user.id, productId: product.id, quantity: 1, product })
      });
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success(`${product.title} added to cart!`);
    }
  };

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <h2>Please <Link to="/login" className="text-decoration-underline text-dark" style={{color: 'var(--text-primary) !important'}}>log in</Link> to view your wishlist.</h2>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mb-5 pb-4 border-bottom" style={{ borderColor: 'var(--border-color) !important' }}>
        <h2 className="display-6 fw-bold m-0">My Wishlist</h2>
        <p className="text-secondary mt-2 fs-5">{wishlists.length} items saved</p>
      </div>

      {wishlists.length > 0 ? (
        <div className="row g-4 row-cols-1 row-cols-md-3 row-cols-xl-4">
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
        <div className="text-center py-5 mt-4 card border-0 shadow-sm rounded-4">
          <div className="card-body p-5">
            <h3 className="fw-bold mb-3">Your wishlist is empty</h3>
            <p className="text-secondary mb-4 fs-5">Save items you love so you won't lose sight of them.</p>
            <Link to="/products" className="btn btn-primary px-5 py-3 fw-bold fs-5 rounded-pill">
              Explore Products
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
