import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Toaster 
        position="top-center" 
        toastOptions={{ 
          duration: 3500,
          style: { 
            background: '#333333', 
            color: '#ffffff', 
            fontWeight: 'bold', 
            fontSize: '1.8rem', 
            padding: '24px 32px',
            maxWidth: '600px'
          } 
        }} 
      />
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/category/:categoryId" element={<Products />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
    </>
  );
}

export default App;