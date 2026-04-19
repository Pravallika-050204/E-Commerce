import React, { useState } from 'react';
import { Heart, ShoppingCart, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, isWishlisted, onToggleWishlist, onAddToCart }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

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
      <div className="card h-100 border-0 shadow-sm rounded-4 position-relative">
        <div className="position-absolute top-0 end-0 p-3 z-1">
          <button
            onClick={handleWishlist}
            className="btn btn-light rounded-circle shadow-sm p-2 d-flex align-items-center justify-content-center"
            style={{ width: '45px', height: '45px', backgroundColor: '#ffffff', border: '1px solid #dee2e6' }}
          >
            <Heart size={22} fill={isWishlisted ? "#000000" : "none"} color="#000000" />
          </button>
        </div>

        <div
          onClick={() => setShowModal(true)}
          style={{ backgroundColor: '#ffffff', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', overflow: 'hidden', padding: '1rem', cursor: 'pointer' }}
        >
          <img
            src={product.image}
            className="card-img-top object-fit-contain w-100"
            alt={product.title}
            style={{ height: '260px' }}
          />
        </div>

        <div className="card-body d-flex flex-column mt-2 p-4">
          <span className="badge px-3 py-2 fw-medium mb-3 align-self-start text-uppercase" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>
            {product.category}
          </span>

          <h5 className="fw-bold mb-2 text-truncate" style={{ fontSize: '1.5rem' }} title={product.title}>{product.title}</h5>

          <p className="text-secondary flex-grow-1" style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
            {product.description}
          </p>

          <div className="d-flex align-items-end justify-content-between mt-4">
            <h4 className="fw-bold mb-0 fs-3">${Number(product.price).toFixed(2)}</h4>
            <button
              onClick={handleCart}
              className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 fs-5"
            >
              <ShoppingCart size={20} /> Add
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.85)' }} onClick={() => setShowModal(false)}>
          <div className="card shadow-lg border-0 d-flex flex-column flex-md-row position-relative" style={{ maxWidth: '1000px', width: '90%', maxHeight: '90vh', backgroundColor: 'var(--bg-primary)' }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowModal(false)}
              className="btn position-absolute top-0 end-0 m-3 rounded-circle bg-light d-flex align-items-center justify-content-center shadow-sm p-0"
              style={{ width: '45px', height: '45px', zIndex: 5, color: '#000000' }}
            >
              <X size={26} />
            </button>
            <div className="bg-white d-flex align-items-center justify-content-center p-5" style={{ flex: '1', minHeight: '400px' }}>
              <img src={product.image} className="w-100 h-100 object-fit-contain" alt={product.title} style={{ maxHeight: '600px' }} />
            </div>
            <div className="p-5 d-flex flex-column" style={{ flex: '1', overflowY: 'auto' }}>
              <span className="badge px-3 py-2 fw-medium mb-3 align-self-start text-uppercase" style={{ fontSize: '1rem', letterSpacing: '1px' }}>
                {product.category}
              </span>
              <h2 className="fw-bold mb-4 display-6" style={{ color: 'var(--text-primary)' }}>{product.title}</h2>
              <h3 className="fw-bold fs-2 mb-4" style={{ color: 'var(--text-primary)' }}>${Number(product.price).toFixed(2)}</h3>
              <p className="text-secondary fs-4 flex-grow-1" style={{ lineHeight: '1.8' }}>
                {product.description}
              </p>
              <div className="d-flex gap-4 mt-4 pt-4 border-top" style={{ borderColor: 'var(--border-color) !important' }}>
                <button onClick={handleCart} className="btn btn-primary d-flex align-items-center justify-content-center gap-3 py-3 fs-4 flex-grow-1">
                  <ShoppingCart size={28} /> Add to Cart
                </button>
                <button onClick={handleWishlist} className="btn btn-outline-light d-flex align-items-center justify-content-center py-3 px-4 shadow-sm" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                  <Heart size={30} fill={isWishlisted ? "var(--text-primary)" : "none"} color="var(--text-primary)" />
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
