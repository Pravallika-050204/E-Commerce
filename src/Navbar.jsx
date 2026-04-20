import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import { ShoppingCart, Heart, Sun, Moon, LogOut } from 'lucide-react';

const Navbar = () => {
  const { theme, toggleTheme }      = useTheme();
  const { user, logout }            = useAuth();
  const navigate                    = useNavigate();
  const location                    = useLocation();
  const [cartCount, setCartCount]   = useState(0);
  const [catOpen, setCatOpen]       = useState(false);
  const [profOpen, setProfOpen]     = useState(false);
  const navCollapseRef              = useRef(null);

  /* ── cart count ── */
  const fetchCartCount = () => {
    if (user) {
      fetch(`http://localhost:5000/carts?userId=${user.id}`)
        .then(r => r.json())
        .then(d => setCartCount(d.length));
    } else {
      setCartCount(0);
    }
  };
  useEffect(() => {
    fetchCartCount();
    window.addEventListener('cartUpdated', fetchCartCount);
    return () => window.removeEventListener('cartUpdated', fetchCartCount);
  }, [user, location.pathname]);

  /* ── close hamburger menu (mobile) ── */
  const closeMenu = () => {
    if (navCollapseRef.current && navCollapseRef.current.classList.contains('show')) {
      // Use Bootstrap's Collapse API to close
      import('bootstrap').then(({ Collapse }) => {
        const col = Collapse.getInstance(navCollapseRef.current);
        if (col) col.hide();
        else new Collapse(navCollapseRef.current, { toggle: false }).hide();
      });
    }
    setCatOpen(false);
    setProfOpen(false);
  };

  const handleLogout = () => {
    closeMenu();
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container-fluid">

        {/* Brand */}
        <Link className="navbar-brand" to="/" onClick={closeMenu}>ShopSmart</Link>

        {/* ── Mobile toggler (hamburger) ── */}
        <button
          className="navbar-toggler border-0 ms-auto"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ outline: 'none', boxShadow: 'none' }}
        >
          {/* Custom hamburger lines — white on black navbar */}
          <span style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '22px' }}>
            <span style={{ display: 'block', height: '2px', backgroundColor: '#fff', borderRadius: '2px' }}></span>
            <span style={{ display: 'block', height: '2px', backgroundColor: '#fff', borderRadius: '2px' }}></span>
            <span style={{ display: 'block', height: '2px', backgroundColor: '#fff', borderRadius: '2px' }}></span>
          </span>
        </button>

        {/* ── Collapsible content ── */}
        <div
          className="collapse navbar-collapse"
          id="navbarContent"
          ref={navCollapseRef}
        >

          {/* Primary nav links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={closeMenu}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products" onClick={closeMenu}>Products</Link>
            </li>

            {/* Categories dropdown */}
            <li
              className="nav-item dropdown"
              onMouseEnter={() => window.innerWidth >= 992 && setCatOpen(true)}
              onMouseLeave={() => window.innerWidth >= 992 && setCatOpen(false)}
            >
              <span
                className="nav-link dropdown-toggle"
                role="button"
                style={{ cursor: 'pointer' }}
                onClick={() => setCatOpen(!catOpen)}
              >
                Categories
              </span>
              <ul
                className={`dropdown-menu shadow border-0 rounded-3 mt-1 ${catOpen ? 'show' : ''}`}
                style={{ minWidth: '165px' }}
              >
                {[
                  { label: 'All Products',  to: '/products'            },
                  { label: 'Footwear',      to: '/category/Footwear'   },
                  { label: 'Sneakers',      to: '/category/Sneakers'   },
                  { label: 'Bags',          to: '/category/Bags'       },
                  { label: 'Makeup',        to: '/category/Makeup'     },
                  { label: 'Plush Toys',    to: '/category/Plush Toys' },
                  { label: 'Accessories',   to: '/category/Accessories'},
                ].map(item => (
                  <li key={item.to}>
                    <Link
                      className={`dropdown-item ${item.label === 'All Products' ? 'fw-bold text-primary' : ''}`}
                      to={item.to}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>

          {/* ── Right-side actions ── */}
          <div className="d-flex align-items-center flex-wrap gap-2 gap-lg-3 pb-2 pb-lg-0">

            {/* Theme toggle */}
            <button
              onClick={() => { toggleTheme(); }}
              className="navbar-toggle-btn"
              title="Toggle Theme"
            >
              <span className="navbar-action-label">
                {theme === 'light' ? 'Dark' : 'Light'}
              </span>
              {theme === 'light'
                ? <Moon size={16} color="#fff" />
                : <Sun  size={16} color="#fff" />}
            </button>

            {/* Wishlist + Cart */}
            {user && (
              <div className="d-flex align-items-center gap-2 gap-lg-3">
                <Link to="/wishlist" className="navbar-icon-btn" title="Wishlist" onClick={closeMenu}>
                  <Heart size={16} color="#fff" />
                  <span className="navbar-action-label">Wishlist</span>
                </Link>
                <Link to="/cart" className="navbar-icon-btn" title="Cart" onClick={closeMenu}>
                  <div className="position-relative">
                    <ShoppingCart size={16} color="#fff" />
                    {cartCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger d-flex align-items-center justify-content-center cart-badge">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span className="navbar-action-label">Cart</span>
                </Link>
              </div>
            )}

            {/* Profile dropdown or Login/SignUp */}
            {user ? (
              <div
                className="position-relative"
                onMouseEnter={() => window.innerWidth >= 992 && setProfOpen(true)}
                onMouseLeave={() => window.innerWidth >= 992 && setProfOpen(false)}
              >
                <div
                  className="profile-avatar rounded-circle d-flex align-items-center justify-content-center fw-bold bg-white text-dark border shadow-sm"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setProfOpen(!profOpen)}
                  title={user.name}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <ul
                  className={`dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-2 ${profOpen ? 'show' : ''}`}
                  style={{ position: 'absolute', top: '100%', right: 0, minWidth: '150px', zIndex: 1100 }}
                >
                  <li><h6 className="dropdown-header fw-bold text-truncate">{user.name}</h6></li>
                  <li><hr className="dropdown-divider m-0" /></li>
                  <li>
                    <button
                      className="dropdown-item fw-bold text-danger d-flex align-items-center gap-2 py-2"
                      onClick={handleLogout}
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link
                  to="/login"
                  className="btn btn-outline-light navbar-btn-login"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-light text-dark navbar-btn-login"
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;