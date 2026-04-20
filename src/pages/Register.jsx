import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
  const [name,            setName]            = useState('');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
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
      const checkRes  = await fetch(`http://localhost:5000/users?email=${email}`);
      const checkData = await checkRes.json();
      if (checkData.length > 0) {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        return toast.error('Email already registered');
      }
      await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      toast.success('Registration successful. Please log in.');
      navigate('/login');
    } catch {
      toast.error('An error occurred during registration. Please try again.');
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
            Create an Account
          </h2>

          <form onSubmit={handleSubmit}>
            {[
              { label: 'Full Name',         type: 'text',     placeholder: 'John Doe',          value: name,            setter: setName },
              { label: 'Email address',     type: 'email',    placeholder: 'name@example.com',  value: email,           setter: setEmail },
              { label: 'Password',          type: 'password', placeholder: 'Enter password',    value: password,        setter: setPassword },
              { label: 'Confirm Password',  type: 'password', placeholder: 'Confirm password',  value: confirmPassword, setter: setConfirmPassword },
            ].map(({ label, type, placeholder, value, setter }, i, arr) => (
              <div className={i < arr.length - 1 ? 'mb-3' : 'mb-4'} key={label}>
                <label
                  className="form-label fw-medium"
                  style={{ fontSize: 'clamp(0.82rem, 1vw, 0.92rem)' }}
                >
                  {label}
                </label>
                <input
                  type={type}
                  className="form-control"
                  placeholder={placeholder}
                  value={value}
                  onChange={e => setter(e.target.value)}
                  required
                />
              </div>
            ))}

            <button
              type="submit"
              className="btn btn-primary w-100 fw-bold mb-3"
              style={{
                fontSize: 'clamp(0.88rem, 1.1vw, 1rem)',
                padding: 'clamp(0.5rem, 1.2vh, 0.75rem) 1rem',
              }}
            >
              Sign Up
            </button>

            <p
              className="text-center text-secondary mb-0"
              style={{ fontSize: 'clamp(0.78rem, 0.95vw, 0.9rem)' }}
            >
              Already have an account?{' '}
              <Link
                to="/login"
                className="fw-bold text-decoration-underline"
                style={{ color: 'var(--text-primary)' }}
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
