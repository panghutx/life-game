// src/components/Header.tsx
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: '首页', icon: '🏠' },
    { path: '/tasks', label: '任务', icon: '📋' },
    { path: '/habits', label: '习惯', icon: '✅' },
    { path: '/achievements', label: '成就', icon: '🏅' },
  ];

  return (
    <header className="main-header">
      <nav className="main-nav">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>
      <button onClick={logout} className="logout-btn">登出</button>
    </header>
  );
}
