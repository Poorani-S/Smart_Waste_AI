import React from 'react';
import { Bell, Sun, Moon, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ theme, toggleTheme, toggleSidebar, userRole }) => {
  const navigate = useNavigate();

  return (
    <header className="navbar glass-panel">
      <div className="navbar-left">
        <button className="mobile-menu-btn" onClick={toggleSidebar}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* Role badge */}
        <div className={`role-badge ${userRole === 'Admin' ? 'role-badge--admin' : 'role-badge--user'}`}>
          {userRole === 'Admin' ? '🛡 Admin' : '👤 User'}
        </div>
      </div>

      <div className="navbar-right">
        <button className="nav-icon-btn" aria-label="Notifications" onClick={() => navigate('/notifications')}>
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <button className="nav-icon-btn theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="nav-icon-btn" aria-label="Settings" onClick={() => navigate('/settings')}>
          <Settings size={20} />
        </button>

        <div className="profile-menu" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
          <div className="profile-avatar">
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
