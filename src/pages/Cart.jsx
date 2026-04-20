import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [wishlists, setWishlists] = useState([]);
  const [checkedOut, setCheckedOut] = useState(false);

  useEffect(() => {
    if (user) {
      fetch(`https://e-commerce-zjcq.onrender.com/carts?userId=${user.id}`)
        .then(res => res.json())
        .then(data => setCartItems(data));

      fetch(`https://e-commerce-zjcq.onrender.com/wishlists?userId=${user.id}`)
        .then(res => res.json())
        .then(data => setWishlists(data));
    }
  }, [user]);

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    const item = cartItems.find(c => c.id === id);
    if (!item) return;
    await fetch(`https://e-commerce-zjcq.onrender.com/carts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, quantity: newQuantity }),
    });
    setCartItems(cartItems.map(c => c.id === id ? { ...c, quantity: newQuantity } : c));
  };

  const removeItem = async (id) => {
    await fetch(`https://e-commerce-zjcq.onrender.com/carts/${id}`, { method: 'DELETE' });
    setCartItems(cartItems.filter(c => c.id !== id));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  /* ── Checkout: delete all cart items from DB ── */
  const handleCheckout = async () => {
    try {
      await Promise.all(
        cartItems.map(item =>
          fetch(`https://e-commerce-zjcq.onrender.com/carts/${item.id}`, { method: 'DELETE' })
        )
      );
      setCartItems([]);
      setCheckedOut(true);
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success('🎉 Checked out successfully! Thank you for your order.', { duration: 4000 });
    } catch {
      toast.error('Checkout failed. Please try again.');
    }
  };

  /* ── Wishlist toggle (for ProductCard modal) ── */
  const handleToggleWishlist = async (product) => {
    if (!user) return navigate('/login');
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

  /* ── Add to cart from modal ── */
  const handleAddToCart = async (product) => {
    if (!user) return navigate('/login');
    const res = await fetch(`https://e-commerce-zjcq.onrender.com/carts?userId=${user.id}&productId=${product.id}`);
    const existing = await res.json();
    if (existing.length > 0) {
      toast.error('Product is already in your cart!');
    } else {
      const newRes = await fetch('https://e-commerce-zjcq.onrender.com/carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId: product.id, quantity: 1, product }),
      });
      const newItem = await newRes.json();
      setCartItems(prev => [...prev, newItem]);
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success(`${product.title} added to Cart!`);
    }
  };

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  /* Not logged in */
  if (!user) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh', padding: '2rem var(--page-px)' }}>
        <div className="text-center">
          <ShoppingBag size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: 'clamp(1rem, 2vw, 1.4rem)' }}>
            Please{' '}
            <Link to="/login" className="text-decoration-underline fw-bold" style={{ color: 'var(--text-primary)' }}>
              log in
            </Link>{' '}
            to view your cart.
          </h2>
        </div>
      </div>
    );
  }

  /* Post-checkout empty state */
  if (checkedOut || cartItems.length === 0) {
    return (
      <div style={{ padding: '2rem var(--page-px) 3rem' }}>
        <div className="text-center py-5 card border-0 shadow-sm rounded-4">
          <div className="card-body" style={{ padding: 'clamp(1.5rem, 4vw, 3rem)' }}>
            <ShoppingBag size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
            <h3 className="fw-bold mb-2" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.3rem)' }}>
              {checkedOut ? 'Order Placed!' : 'Your cart is empty'}
            </h3>
            <p className="text-secondary mb-4" style={{ fontSize: 'clamp(0.82rem, 1vw, 0.95rem)' }}>
              {checkedOut
                ? 'Thank you for shopping with us. Continue exploring!'
                : "Looks like you haven't added anything to your cart yet."}
            </p>
            <Link to="/products" className="btn btn-primary empty-state-btn">
              {checkedOut ? 'Continue Shopping' : 'Start Shopping'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem var(--page-px) 3rem' }}>

      {/* Header */}
      <div className="mb-4 pb-3 border-bottom" style={{ borderColor: 'var(--border-color) !important' }}>
        <h2 className="section-heading m-0">Shopping Cart</h2>
        <p className="section-subtext mt-1 mb-0">
          {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
        </p>
      </div>

      <div className="row g-4">

        {/* ── Cart Items ── */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-0">
              {cartItems.map((item, idx) => (
                <div
                  key={item.id}
                  className={`d-flex align-items-center flex-wrap gap-3 p-3 ${idx !== cartItems.length - 1 ? 'border-bottom' : ''}`}
                  style={{ borderColor: 'var(--border-color) !important' }}
                >
                  {/*
                    KEY FIX: clicking the product image/title now opens the
                    ProductCard component with its built-in detail modal,
                    instead of navigating away to a search URL.
                    We embed a mini ProductCard in a hidden wrapper and trigger
                    the modal via state. Simpler approach: render ProductCard
                    in "mini" mode — but since ProductCard opens modal on image
                    click, we replicate that with a dedicated CartItemModal.
                  */}
                  <CartProductPreview
                    item={item}
                    wishlists={wishlists}
                    onToggleWishlist={handleToggleWishlist}
                    onAddToCart={handleAddToCart}
                    updateQuantity={updateQuantity}
                  />

                  {/* Qty controls */}
                  <div
                    className="d-flex align-items-center gap-1 rounded-pill px-2 py-1"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                  >
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="btn btn-sm border-0 p-1"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <Minus size={14} />
                    </button>
                    <span
                      className="fw-bold px-1"
                      style={{ fontSize: 'clamp(0.8rem, 0.9vw, 0.95rem)', minWidth: '1.5ch', textAlign: 'center' }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="btn btn-sm border-0 p-1"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Price */}
                  <div style={{ minWidth: '70px', textAlign: 'right' }}>
                    <h5 className="fw-bold mb-0" style={{ fontSize: 'clamp(0.88rem, 1.1vw, 1.05rem)' }}>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </h5>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="btn btn-link text-danger p-1"
                    title="Remove"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Order Summary ── */}
        <div className="col-12 col-lg-4">
          <div
            className="card shadow-sm border-0 rounded-4"
            style={{ position: 'sticky', top: 'clamp(70px, 10vh, 90px)' }}
          >
            <div className="card-body p-4">
              <h4 className="fw-bold mb-3" style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.2rem)' }}>
                Order Summary
              </h4>

              <div className="d-flex justify-content-between mb-2 text-secondary" style={{ fontSize: 'clamp(0.8rem, 0.95vw, 0.92rem)' }}>
                <span>Subtotal ({cartItems.length} items)</span>
                <span className="fw-medium" style={{ color: 'var(--text-primary)' }}>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 text-secondary" style={{ fontSize: 'clamp(0.8rem, 0.95vw, 0.92rem)' }}>
                <span>Shipping</span>
                <span className="fw-medium text-success">Free</span>
              </div>

              <hr style={{ borderColor: 'var(--border-color)' }} />

              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold" style={{ fontSize: 'clamp(0.9rem, 1.1vw, 1.05rem)' }}>Total</span>
                <span className="fw-bold" style={{ fontSize: 'clamp(1rem, 1.3vw, 1.2rem)' }}>${calculateTotal().toFixed(2)}</span>
              </div>

              {/* Checkout button — clears cart + shows toast */}
              <button
                className="btn btn-primary w-100 fw-bold rounded-3"
                style={{ fontSize: 'clamp(0.85rem, 1vw, 0.95rem)', padding: '0.6rem 1rem' }}
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────
   CartProductPreview
   Renders the product image + title in the cart row.
   On click → opens a full ProductCard detail modal.
   This gives the user the same detail view as on Products page.
────────────────────────────────────────────────────────── */
const CartProductPreview = ({ item, wishlists, onToggleWishlist, onAddToCart, updateQuantity }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Clickable image + title */}
      <button
        onClick={() => setShowModal(true)}
        className="d-flex align-items-center gap-3 border-0 bg-transparent p-0 text-start"
        style={{ flex: '1', minWidth: '180px', cursor: 'pointer' }}
        title="View product details"
      >
        <div
          className="rounded-3 overflow-hidden d-flex align-items-center justify-content-center flex-shrink-0"
          style={{
            width: 'clamp(60px, 8vw, 88px)',
            height: 'clamp(60px, 8vw, 88px)',
            backgroundColor: '#fff',
            border: '1px solid var(--border-color)',
            padding: '0.4rem',
          }}
        >
          <img
            src={item.product.image}
            alt={item.product.title}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
        <div>
          <h5
            className="fw-bold mb-1"
            style={{
              fontSize: 'clamp(0.82rem, 1vw, 1rem)',
              color: 'var(--text-primary)',
              maxWidth: '200px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {item.product.title}
          </h5>
          <span className="badge fw-medium text-uppercase" style={{ fontSize: 'clamp(0.6rem, 0.75vw, 0.72rem)' }}>
            {item.product.category}
          </span>
          <p style={{ fontSize: 'clamp(0.65rem, 0.8vw, 0.75rem)', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>
            Click to view details
          </p>
        </div>
      </button>

      {/* Full ProductCard modal */}
      {showModal && (
        <ProductCard
          product={item.product}
          isWishlisted={wishlists.some(w => w.productId === item.product.id)}
          cartItem={item}
          onToggleWishlist={onToggleWishlist}
          onAddToCart={onAddToCart}
          onUpdateQuantity={updateQuantity}
          autoOpenModal={true}
          onModalClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default Cart;
