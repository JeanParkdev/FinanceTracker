import { Link, useNavigate, useLocation } from 'react-router-dom';
import { removeToken } from '../utils/auth.js';
import { useTheme } from '../utils/ThemeContext.jsx';

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/transactions', label: 'Transactions' },
  { path: '/budgets', label: 'Budgets' },
  { path: '/goals', label: 'Goals' },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <div style={{
      width: '220px',
      minHeight: '100vh',
      background: 'var(--sidebar-bg)',
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      flexShrink: 0,
    }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '20px',
        fontWeight: '600',
        color: 'var(--sidebar-text)',
        marginBottom: '2rem',
        padding: '0 0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-light)', flexShrink: 0 }}></div>
        Finance Tracker
      </div>

      {navItems.map(({ path, label }) => {
        const isActive = location.pathname === path;
        return (
          <Link
            key={path}
            to={path}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              color: isActive ? 'var(--sidebar-text)' : 'var(--sidebar-muted)',
              background: isActive ? 'var(--sidebar-active)' : 'transparent',
              fontWeight: isActive ? '500' : '400',
              textDecoration: 'none',
              transition: 'all 0.15s',
            }}
          >
            <div style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: isActive ? 'var(--accent-light)' : 'transparent',
              border: isActive ? 'none' : '1px solid var(--sidebar-muted)',
              flexShrink: 0,
            }}></div>
            {label}
          </Link>
        );
      })}

      <div style={{ marginTop: 'auto' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--sidebar-active)',
          marginBottom: '8px',
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'var(--accent-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: '500',
            color: 'var(--sidebar-bg)',
            flexShrink: 0,
          }}>
            me
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--sidebar-text)' }}>My Finances</div>
          </div>
        </div>
        <button
          onClick={toggleDarkMode}
          style={{
            width: '100%',
            padding: '8px',
            background: 'transparent',
            border: '1px solid var(--sidebar-muted)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--sidebar-muted)',
            fontSize: '13px',
            cursor: 'pointer',
            marginBottom: '6px',
          }}
        >
          {darkMode ? '☀ Light mode' : '☾ Dark mode'}
        </button>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '8px',
            background: 'transparent',
            border: '1px solid var(--sidebar-muted)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--sidebar-muted)',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;