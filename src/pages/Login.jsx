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
      const res = await fetch(`http://localhost:5000/users?email=${email}&password=${password}`);
      const data = await res.json();
      
      if (data.length > 0) {
        login(data[0]);
        toast.success(`Welcome back, ${data[0].name}!`);
        navigate('/');
      } else {
        toast.error('Invalid email or password');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      toast.error('Connection error. Please try again later.');
      setPassword('');
    }
  };

  return (
    <div 
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center py-5" 
      style={{ 
        backgroundImage: 'url(https://media.istockphoto.com/id/867883672/photo/abstract-gray-background.jpg?s=170667a&w=0&k=20&c=VIiRbODJmyaUSuV_3TbcUYGbz2FLaHBAL2Q4IcqwpsU=)', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}
    >
      <div className="card shadow-lg border-0 rounded-4 w-100" style={{ maxWidth: '450px', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        <div className="card-body p-5">
          <h2 className="fw-bold mb-4 text-center">Welcome Back</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-medium">Email address</label>
              <input 
                type="email" 
                className="form-control form-control-lg" 
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <div className="mb-4">
              <label className="form-label fw-medium">Password</label>
              <input 
                type="password" 
                className="form-control form-control-lg" 
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 p-3 fs-5 mb-4">
              Log In
            </button>
            
            <p className="text-center text-secondary">
              Don't have an account? <Link to="/register" className="fw-bold text-dark text-decoration-underline" style={{ color: "var(--text-primary) !important" }}>Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
