import React, { useState } from 'react';
import { Heart, ShoppingCart, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, isWishlisted, cartItem, onToggleWishlist, onAddToCart, onUpdateQuantity, autoOpenModal = false, onModalClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(autoOpenModal);

  const handleWishlist = () => {
    if (!user) return navigate('/login');
    onToggleWishlist(product);
  };

  const handleCart = () => {
    if (!user) return navigate('/login');
    onAddToCart(product);
  };

  return (
    <>
      {/* ── Card ── */}
      <div className="card h-100 border-0 shadow-sm rounded-4 position-relative">

        {/* Wishlist heart */}
        <div className="position-absolute top-0 end-0 p-2 z-1">
          <button
            onClick={handleWishlist}
            className="btn btn-light rounded-circle shadow-sm p-2 d-flex align-items-center justify-content-center"
            style={{ width: '36px', height: '36px', backgroundColor: '#fff', border: '1px solid #dee2e6' }}
          >
            <Heart size={16} fill={isWishlisted ? '#000' : 'none'} color="#000" />
          </button>
        </div>

        {/* Product image */}
        <div
          onClick={() => setShowModal(true)}
          style={{
            backgroundColor: '#fff',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
            overflow: 'hidden',
            padding: 'clamp(0.5rem, 1.5vw, 1rem)',
            cursor: 'pointer',
          }}
        >
          <img
            src={product.image}
            alt={product.title}
            className="product-img"
          />
        </div>

        {/* Card body */}
        <div className="card-body d-flex flex-column p-3">
          <span
            className="badge px-2 py-1 fw-medium mb-2 align-self-start text-uppercase"
            style={{ letterSpacing: '0.5px' }}
          >
            {product.category}
          </span>

          <h5
            className="fw-bold mb-1 text-truncate"
            style={{ fontSize: 'clamp(0.85rem, 1vw, 1.05rem)' }}
            title={product.title}
          >
            {product.title}
          </h5>

          <p
            className="text-secondary flex-grow-1 mb-2"
            style={{ fontSize: 'clamp(0.75rem, 0.9vw, 0.88rem)', lineHeight: '1.5' }}
          >
            {product.description}
          </p>

          <div className="d-flex align-items-center justify-content-between mt-auto">
            <h4
              className="fw-bold mb-0"
              style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.2rem)' }}
            >
              ${Number(product.price).toFixed(2)}
            </h4>
            {cartItem ? (
              <div className="d-flex align-items-center gap-2">
                <button
                  onClick={() => onUpdateQuantity(cartItem.id, cartItem.quantity - 1)}
                  className="btn btn-outline-secondary d-flex align-items-center justify-content-center p-0"
                  style={{ width: '28px', height: '28px', borderRadius: '50%' }}
                >-</button>
                <span className="fw-bold" style={{ width: '20px', textAlign: 'center', fontSize: '0.9rem' }}>{cartItem.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(cartItem.id, cartItem.quantity + 1)}
                  className="btn btn-outline-secondary d-flex align-items-center justify-content-center p-0"
                  style={{ width: '28px', height: '28px', borderRadius: '50%' }}
                >+</button>
              </div>
            ) : (
              <button
                onClick={handleCart}
                className="btn btn-primary d-flex align-items-center gap-1"
                style={{ fontSize: 'clamp(0.72rem, 0.85vw, 0.85rem)', padding: '0.35rem 0.75rem' }}
              >
                <ShoppingCart size={14} /> Add
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.82)' }}
          onClick={() => { setShowModal(false); onModalClose?.(); }}
        >
          <div
            className="card shadow-lg border-0 d-flex flex-column flex-md-row position-relative"
            style={{
              maxWidth: 'min(960px, 92vw)',
              width: '100%',
              maxHeight: '90vh',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => { setShowModal(false); onModalClose?.(); }}
              className="btn position-absolute top-0 end-0 m-2 rounded-circle bg-light d-flex align-items-center justify-content-center shadow-sm p-0"
              style={{ width: '36px', height: '36px', zIndex: 5, color: '#000' }}
            >
              <X size={20} />
            </button>

            {/* Image pane */}
            <div
              className="bg-white d-flex align-items-center justify-content-center"
              style={{ flex: '0 0 45%', minHeight: 'clamp(220px, 40vh, 480px)', padding: 'clamp(1rem, 3vw, 2.5rem)' }}
            >
              <img
                src={product.image}
                alt={product.title}
                style={{ width: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            </div>

            {/* Info pane */}
            <div
              className="d-flex flex-column"
              style={{
                flex: '1',
                overflowY: 'auto',
                padding: 'clamp(1.25rem, 3vw, 2.5rem)',
              }}
            >
              <span
                className="badge px-2 py-1 fw-medium mb-3 align-self-start text-uppercase"
                style={{ letterSpacing: '0.5px', fontSize: 'clamp(0.65rem, 0.8vw, 0.8rem)' }}
              >
                {product.category}
              </span>

              <h2
                className="fw-bold mb-3"
                style={{ fontSize: 'clamp(1.1rem, 2vw, 1.6rem)', color: 'var(--text-primary)', lineHeight: 1.25 }}
              >
                {product.title}
              </h2>

              <h3
                className="fw-bold mb-4"
                style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)', color: 'var(--text-primary)' }}
              >
                ${Number(product.price).toFixed(2)}
              </h3>

              <p
                className="text-secondary flex-grow-1"
                style={{ fontSize: 'clamp(0.82rem, 1vw, 0.95rem)', lineHeight: '1.7' }}
              >
                {product.description}
              </p>

              <div
                className="d-flex gap-3 mt-4 pt-3 border-top"
                style={{ borderColor: 'var(--border-color) !important' }}
              >
                {cartItem ? (
                  <div className="d-flex align-items-center gap-3 flex-grow-1 justify-content-center p-1 rounded-3" style={{ border: '1px solid var(--border-color)' }}>
                    <button
                      onClick={() => onUpdateQuantity(cartItem.id, cartItem.quantity - 1)}
                      className="btn btn-light d-flex align-items-center justify-content-center rounded-circle shadow-sm"
                      style={{ width: '36px', height: '36px' }}
                    >-</button>
                    <span className="fw-bold fs-5" style={{ width: '30px', textAlign: 'center' }}>{cartItem.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(cartItem.id, cartItem.quantity + 1)}
                      className="btn btn-light d-flex align-items-center justify-content-center rounded-circle shadow-sm"
                      style={{ width: '36px', height: '36px' }}
                    >+</button>
                  </div>
                ) : (
                  <button
                    onClick={handleCart}
                    className="btn btn-primary d-flex align-items-center justify-content-center gap-2 flex-grow-1"
                    style={{ fontSize: 'clamp(0.82rem, 1vw, 0.95rem)', padding: '0.55rem 1rem' }}
                  >
                    <ShoppingCart size={18} /> Add to Cart
                  </button>
                )}
                <button
                  onClick={handleWishlist}
                  className="btn d-flex align-items-center justify-content-center px-3"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    borderRadius: '8px',
                  }}
                >
                  <Heart size={20} fill={isWishlisted ? 'var(--text-primary)' : 'none'} color="var(--text-primary)" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
