import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';
import { saveToken } from '../utils/auth.js';

const REGISTER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

const Icon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <rect x="1" y="1" width="46" height="46" rx="10" stroke="#b5546a" strokeWidth="1"/>
    <text x="24" y="32" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="20" fontWeight="600" fill="#b5546a">FT</text>
  </svg>
);

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [register, { error }] = useMutation(REGISTER);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await register({ variables: formData });
      saveToken(data.register.token);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-secondary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <Icon />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '32px',
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
          }}>
            Create account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Start tracking your finances today
          </p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="yourname"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {error && (
              <p style={{ color: 'var(--danger)', fontSize: '13px', marginBottom: '1rem' }}>
                {error.message}
              </p>
            )}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Create account
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '14px', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: '500' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;