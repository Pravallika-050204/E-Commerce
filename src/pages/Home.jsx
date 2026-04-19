import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

import { Carousel } from 'bootstrap';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlists, setWishlists] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const categories = ['Footwear', 'Sneakers', 'Bags', 'Makeup', 'Plush Toys', 'Accessories'];

  useEffect(() => {
    fetch('http://localhost:5000/products?_limit=3')
      .then(res => res.json())
      .then(data => setFeaturedProducts(data));
      
    if (user) {
      fetch(`http://localhost:5000/wishlists?userId=${user.id}`)
        .then(res => res.json())
        .then(data => setWishlists(data));
    }
    
    // Explicitly initialize Bootstrap Carousel due to React DOM async mounting limits
    const carouselElement = document.getElementById('homeCarousel');
    if (carouselElement) {
      new Carousel(carouselElement, {
        interval: 1000,
        ride: 'carousel'
      });
    }
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleToggleWishlist = async (product) => {
    const existing = wishlists.find(w => w.productId === product.id);
    if (existing) {
      await fetch(`http://localhost:5000/wishlists/${existing.id}`, { method: 'DELETE' });
      setWishlists(wishlists.filter(w => w.id !== existing.id));
    } else {
      const res = await fetch('http://localhost:5000/wishlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId: product.id, product })
      });
      const data = await res.json();
      setWishlists([...wishlists, data]);
      toast.success(`${product.title} added to Wishlist!`);
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
      toast.success(`${product.title} added to Cart!`);
    }
  };

  return (
    <div className="container-fluid px-0">
      <div id="homeCarousel" className="carousel slide carousel-fade overflow-hidden border-0" data-bs-ride="carousel" data-bs-interval="2000">
        <div className="carousel-inner">
          <div className="carousel-item active" style={{ height: 'calc(100vh - 95px)', backgroundColor: 'var(--bg-card)' }}>
            <img src="https://www.shutterstock.com/shutterstock/videos/1095304299/thumb/1.jpg?ip=x480" className="d-block w-100 h-100 object-fit-cover opacity-75" alt="Makeup" />
            <div className="carousel-caption d-none d-md-block p-4 shadow-lg mb-5" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', color: '#000000' }}>
              <h2 className="fw-bold fs-1">Premium Makeup Collection</h2>
              <p className="fs-4">Enhance your natural beauty with our exclusive cosmetics line.</p>
            </div>
          </div>
          <div className="carousel-item" style={{ height: 'calc(100vh - 95px)', backgroundColor: 'var(--bg-card)' }}>
            <img src="https://images.unsplash.com/photo-1559454403-b8fb88521f11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MjU5MTl8MHwxfHNlYXJjaHwxfHx0ZWRkeSUyMGJlYXJ8ZW58MHx8fHwxNzMyMzE2ODIzfDA&ixlib=rb-4.0.3&q=80&w=1200" className="d-block w-100 h-100 object-fit-cover opacity-75" alt="Plushy" />
            <div className="carousel-caption d-none d-md-block p-4 shadow-lg mb-5" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', color: '#000000' }}>
              <h2 className="fw-bold fs-1">Adorable Plushies</h2>
              <p className="fs-4">Perfect companions for all ages. Soft, cuddly, and lovable.</p>
            </div>
          </div>
          <div className="carousel-item" style={{ height: 'calc(100vh - 95px)', backgroundColor: 'var(--bg-card)' }}>
            <img src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MjU5MTl8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwc2hvZXN8ZW58MHx8fHwxNzMyMzE2OTAyfDA&ixlib=rb-4.0.3&q=80&w=1200" className="d-block w-100 h-100 object-fit-cover opacity-75" alt="Shoe" />
            <div className="carousel-caption d-none d-md-block p-4 shadow-lg mb-5" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', color: '#000000' }}>
              <h2 className="fw-bold fs-1">Modern Footwear</h2>
              <p className="fs-4">Step up your style with our latest range of comfortable sneakers.</p>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon bg-dark rounded-circle p-4" aria-hidden="true" style={{ width: '4rem', height: '4rem' }}></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon bg-dark rounded-circle p-4" aria-hidden="true" style={{ width: '4rem', height: '4rem' }}></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <div className="container-fluid px-5 py-5 mb-5 mt-5">
        <div className="row g-5">
          {featuredProducts.map(product => (
            <div className="col-lg-4 col-md-6" key={product.id}>
              <ProductCard 
                product={product} 
                isWishlisted={wishlists.some(w => w.productId === product.id)}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
