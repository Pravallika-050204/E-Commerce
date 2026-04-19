import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';

const Cart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/carts?userId=${user.id}`)
        .then(res => res.json())
        .then(data => setCartItems(data));
    }
  }, [user]);

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    const item = cartItems.find(c => c.id === id);
    if (!item) return;

    await fetch(`http://localhost:5000/carts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, quantity: newQuantity })
    });
    setCartItems(cartItems.map(c => c.id === id ? { ...c, quantity: newQuantity } : c));
  };

  const removeItem = async (id) => {
    await fetch(`http://localhost:5000/carts/${id}`, { method: 'DELETE' });
    setCartItems(cartItems.filter(c => c.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <h2>Please <Link to="/login" className="text-decoration-underline text-dark" style={{color: 'var(--text-primary) !important'}}>log in</Link> to view your cart.</h2>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mb-5 pb-4 border-bottom" style={{ borderColor: 'var(--border-color) !important' }}>
        <h2 className="display-6 fw-bold m-0">Shopping Cart</h2>
        <p className="text-secondary mt-2 fs-5">{cartItems.length} items in your cart</p>
      </div>

      {cartItems.length > 0 ? (
        <div className="row g-5">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-0">
                {cartItems.map((item, idx) => (
                  <div className={`p-4 d-flex align-items-center gap-4 ${idx !== cartItems.length - 1 ? 'border-bottom' : ''}`} style={{ borderColor: 'var(--border-color) !important' }} key={item.id}>
                    <Link to={`/products?search=${encodeURIComponent(item.product.title)}`} className="d-flex align-items-center gap-4 text-decoration-none" style={{ color: 'var(--text-primary)' }}>
                      <div className="rounded-3 overflow-hidden d-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px', backgroundColor: '#ffffff', padding: '0.5rem' }}>
                        <img src={item.product.image} alt={item.product.title} className="w-100 h-100 object-fit-contain" />
                      </div>
                      
                      <div className="flex-grow-1" style={{ minWidth: '200px' }}>
                        <h5 className="fw-bold fs-5 mb-1 text-truncate" style={{ color: 'var(--text-primary)' }}>{item.product.title}</h5>
                        <span className="badge px-2 py-1 fw-medium mb-2 text-uppercase text-dark border border-secondary" style={{ fontSize: '0.7rem' }}>
                          {item.product.category}
                        </span>
                      </div>
                    </Link>
                    
                    <div className="d-flex align-items-center gap-2 bg-light rounded-pill px-2 py-1" style={{ backgroundColor: 'var(--bg-secondary) !important'}}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="btn btn-sm border-0 p-1" style={{ color: 'var(--text-primary)' }}><Minus size={16} /></button>
                      <span className="fw-bold px-2">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="btn btn-sm border-0 p-1" style={{ color: 'var(--text-primary)' }}><Plus size={16} /></button>
                    </div>

                    <div className="text-end" style={{ width: '120px' }}>
                      <h5 className="fw-bold mb-0">${(item.product.price * item.quantity).toFixed(2)}</h5>
                    </div>

                    <button onClick={() => removeItem(item.id)} className="btn btn-link text-danger p-2" title="Remove Item">
                      <Trash2 size={22} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 rounded-4 sticky-top" style={{ top: '100px' }}>
              <div className="card-body p-4">
                <h4 className="fw-bold mb-4">Order Summary</h4>
                
                <div className="d-flex justify-content-between mb-3 text-secondary">
                  <span>Subtotal</span>
                  <span className="fw-medium text-dark" style={{color: 'var(--text-primary) !important'}}>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3 text-secondary">
                  <span>Shipping</span>
                  <span className="fw-medium text-dark" style={{color: 'var(--text-primary) !important'}}>Free</span>
                </div>
                
                <hr className="my-4" style={{ borderColor: 'var(--border-color) !important' }} />
                
                <div className="d-flex justify-content-between mb-4">
                  <span className="fw-bold fs-5">Total</span>
                  <span className="fw-bold fs-4">${calculateTotal().toFixed(2)}</span>
                </div>

                <button className="btn btn-primary w-100 py-3 fw-bold fs-5 rounded-3">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-5 mt-4 card border-0 shadow-sm rounded-4">
          <div className="card-body p-5">
            <h3 className="fw-bold mb-3">Your cart is empty</h3>
            <p className="text-secondary mb-4 fs-5">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products" className="btn btn-primary px-5 py-3 fw-bold fs-5 rounded-pill">
              Start Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
