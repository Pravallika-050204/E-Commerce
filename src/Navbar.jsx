import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import { ShoppingCart, Heart, Sun, Moon, Search, LogOut } from 'lucide-react';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const fetchCartCount = () => {
    if (user) {
      fetch(`http://localhost:5000/carts?userId=${user.id}`)
        .then(res => res.json())
        .then(data => setCartCount(data.length));
    }
  };

  useEffect(() => {
    fetchCartCount();
    window.addEventListener('cartUpdated', fetchCartCount);
    return () => window.removeEventListener('cartUpdated', fetchCartCount);
  }, [user, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top px-5 py-4">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" style={{ fontSize: '3rem' }} to="/">ShopSmart</Link>
        
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-4 ms-lg-5 fw-bold" style={{ fontSize: '2.5rem' }}>
            <li className="nav-item"><Link className="nav-link px-3" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link px-3" to="/products">Products</Link></li>
            <li 
              className="nav-item dropdown"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="nav-link dropdown-toggle px-3" role="button" style={{ cursor: 'pointer' }}>Categories</span>
              <ul className={`dropdown-menu shadow border-0 rounded-3 mt-2 ${dropdownOpen ? 'show' : ''}`} style={{ transition: 'all 0.3s ease' }} onClick={() => setDropdownOpen(false)}>
                <li><Link className="dropdown-item py-2 fs-4 fw-bold text-primary" to="/products">All Categories</Link></li>
                <li><Link className="dropdown-item py-2 fs-4" to="/category/Footwear">Footwear</Link></li>
                <li><Link className="dropdown-item py-2 fs-4" to="/category/Sneakers">Sneakers</Link></li>
                <li><Link className="dropdown-item py-2 fs-4" to="/category/Bags">Bags</Link></li>
                <li><Link className="dropdown-item py-2 fs-4" to="/category/Makeup">Makeup</Link></li>
                <li><Link className="dropdown-item py-2 fs-4" to="/category/Plush Toys">Plush Toys</Link></li>
                <li><Link className="dropdown-item py-2 fs-4" to="/category/Accessories">Accessories</Link></li>
              </ul>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-4">
            <button onClick={toggleTheme} className="btn btn-link p-0 d-flex align-items-center gap-2 text-decoration-none" title="Toggle Theme" style={{ color: "#ffffff" }}>
              <span className="fs-4 fw-medium">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
              {theme === 'light' ? <Moon size={34} color="#ffffff" /> : <Sun size={34} color="#ffffff" />}
            </button>
            
            {user && (
              <div className="d-flex align-items-center gap-4">
                <Link to="/wishlist" className="d-flex align-items-center gap-2 text-decoration-none text-white position-relative" title="Wishlist">
                  <Heart size={34} color="#ffffff" />
                  <span className="fs-4 fw-bold">Wishlist</span>
                </Link>
                <Link to="/cart" className="d-flex align-items-center gap-2 text-decoration-none text-white position-relative" title="Cart">
                  <div className="position-relative">
                    <ShoppingCart size={34} color="#ffffff" />
                    {cartCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger d-flex align-items-center justify-content-center" style={{ width: '22px', height: '22px', fontSize: '0.8rem', outline: '2px solid var(--bg-primary)' }}>
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span className="fs-4 fw-bold">Cart</span>
                </Link>
              </div>
            )}

            {user ? (
              <div 
                className="d-flex align-items-center gap-4 ms-3 dropdown"
                onMouseEnter={() => setProfileDropdownOpen(true)}
                onMouseLeave={() => setProfileDropdownOpen(false)}
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold bg-white text-dark border shadow-sm"
                  style={{ width: '50px', height: '50px', fontSize: '24px', cursor: 'pointer' }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <ul className={`dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-2 ${profileDropdownOpen ? 'show' : ''}`} style={{ transition: 'all 0.3s ease', position: 'absolute', top: '100%', right: '0' }}>
                  <li><h6 className="dropdown-header text-dark fs-5 fw-bold">{user.name}</h6></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item py-2 fs-5 fw-bold text-danger d-flex align-items-center gap-2" onClick={handleLogout}>
                      <LogOut size={20} /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-3 ms-2">
                <Link to="/login" className="btn btn-outline-light px-5 py-3 fw-bold fs-4 rounded-pill">Login</Link>
                <Link to="/register" className="btn btn-light px-5 py-3 fw-bold fs-4 text-dark rounded-pill">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;