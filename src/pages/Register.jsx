import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPassword('');
      setConfirmPassword('');
      return toast.error('Passwords do not match');
    }

    try {
      const checkRes = await fetch(`http://localhost:5000/users?email=${email}`);
      const checkData = await checkRes.json();
      
      if (checkData.length > 0) {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        return toast.error('Email already registered');
      }

      await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      toast.success('Registration successful. Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error('An error occurred during registration. Please try again.');
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
          <h2 className="fw-bold mb-4 text-center">Create an Account</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-medium">Full Name</label>
              <input 
                type="text" 
                className="form-control form-control-lg" 
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>

            <div className="mb-3">
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
            
            <div className="mb-3">
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

            <div className="mb-4">
              <label className="form-label fw-medium">Confirm Password</label>
              <input 
                type="password" 
                className="form-control form-control-lg" 
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 p-3 fs-5 mb-4">
              Sign Up
            </button>
            
            <p className="text-center text-secondary">
              Already have an account? <Link to="/login" className="fw-bold text-dark text-decoration-underline" style={{ color: "var(--text-primary) !important" }}>Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
