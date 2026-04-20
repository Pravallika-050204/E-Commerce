import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Fetch by email only — json-server v1 multi-param filtering is unreliable.
      // Password comparison is done client-side.
      const res = await fetch(`https://e-commerce-zjcq.onrender.com/users?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      const matched = data.find(u => u.password === password);
      if (matched) {
        login(matched);
        toast.success(`Welcome back, ${matched.name}!`);
        navigate('/');
      } else {
        toast.error('Invalid email or password');
        setEmail('');
        setPassword('');
      }
    } catch {
      toast.error('Connection error. Please try again later.');
      setPassword('');
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: 'url(https://media.istockphoto.com/id/867883672/photo/abstract-gray-background.jpg?s=170667a&w=0&k=20&c=VIiRbODJmyaUSuV_3TbcUYGbz2FLaHBAL2Q4IcqwpsU=)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: 'clamp(1rem, 4vw, 3rem)',
      }}
    >
      <div
        className="card shadow-lg border-0 rounded-4 w-100"
        style={{
          maxWidth: 'clamp(300px, 90vw, 440px)',
          backgroundColor: 'rgba(255,255,255,0.93)',
        }}
      >
        <div style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
          <h2
            className="fw-bold mb-4 text-center"
            style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)' }}
          >
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label
                className="form-label fw-medium"
                style={{ fontSize: 'clamp(0.82rem, 1vw, 0.92rem)' }}
              >
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="form-label fw-medium"
                style={{ fontSize: 'clamp(0.82rem, 1vw, 0.92rem)' }}
              >
                Password
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 fw-bold mb-3"
              style={{
                fontSize: 'clamp(0.88rem, 1.1vw, 1rem)',
                padding: 'clamp(0.5rem, 1.2vh, 0.75rem) 1rem',
              }}
            >
              Log In
            </button>

            <p
              className="text-center text-secondary mb-0"
              style={{ fontSize: 'clamp(0.78rem, 0.95vw, 0.9rem)' }}
            >
              Don't have an account?{' '}
              <Link
                to="/register"
                className="fw-bold text-decoration-underline"
                style={{ color: 'var(--text-primary)' }}
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
