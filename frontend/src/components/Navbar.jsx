import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Bell, Sun, Moon, Settings, User, X, Zap, Clock, Layers, Leaf, FileBox, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

// Search index: all searchable routes
const SEARCH_INDEX = [
  { label: 'Overview', description: 'Home dashboard & quick stats', path: '/', icon: Zap, keywords: ['home', 'overview', 'main', 'dashboard'] },
  { label: 'Classify Waste', description: 'AI-powered waste image classification', path: '/classify', icon: Zap, keywords: ['classify', 'scan', 'image', 'upload', 'predict', 'ai', 'analyze'] },
  { label: 'Analytics', description: 'Real-time analytics and chart data', path: '/dashboard', icon: Layers, keywords: ['analytics', 'charts', 'pie', 'bar', 'statistics', 'data'] },
  { label: 'History', description: 'Past classification records', path: '/history', icon: Clock, keywords: ['history', 'past', 'records', 'log', 'previous'] },
  { label: 'Model Performance', description: 'AI model metrics and accuracy', path: '/models', icon: Layers, keywords: ['model', 'performance', 'accuracy', 'efficientnet', 'metrics'] },
  { label: 'Waste Guide', description: 'How to sort and dispose waste', path: '/waste-guide', icon: Leaf, keywords: ['waste', 'guide', 'recycle', 'dispose', 'glass', 'metal', 'plastic', 'paper', 'organic'] },
  { label: 'Batch Analysis', description: 'Classify multiple images at once', path: '/batch', icon: FileBox, keywords: ['batch', 'multiple', 'bulk', 'folder', 'many'] },
  { label: 'Settings', description: 'Application preferences', path: '/settings', icon: Settings, keywords: ['settings', 'preferences', 'config', 'theme', 'dark', 'model'] },
  { label: 'About', description: 'About SmartWaste AI', path: '/about', icon: Info, keywords: ['about', 'version', 'team', 'info'] },
];

function searchIndex(query) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return SEARCH_INDEX.filter(item =>
    item.label.toLowerCase().includes(q) ||
    item.description.toLowerCase().includes(q) ||
    item.keywords.some(k => k.includes(q))
  ).slice(0, 6);
}

const Navbar = ({ theme, toggleTheme, toggleSidebar }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Live search
  useEffect(() => {
    const found = searchIndex(query);
    setResults(found);
    setActiveIdx(0);
    setOpen(found.length > 0 && query.length > 0);
  }, [query]);

  // Global Ctrl+K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
      if (e.key === 'Escape') {
        setQuery('');
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (results[activeIdx]) goTo(results[activeIdx].path);
    }
  };

  const goTo = (path) => {
    navigate(path);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  };

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

        {/* Search */}
        <div className="search-wrapper">
          <div className={`search-bar ${open ? 'active' : ''}`}>
            <Search size={18} className="search-icon" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search across SmartWaste..."
              className="search-input"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => query && setOpen(results.length > 0)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              autoComplete="off"
            />
            {query ? (
              <button
                className="search-clear-btn"
                onMouseDown={e => { e.preventDefault(); setQuery(''); setOpen(false); }}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            ) : (
              <div className="search-shortcut">Ctrl+K</div>
            )}
          </div>

          {open && results.length > 0 && (
            <div className="search-dropdown">
              <div className="search-dropdown-label">Pages & Features</div>
              {results.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    className={`search-result-item ${i === activeIdx ? 'active' : ''}`}
                    onMouseDown={() => goTo(item.path)}
                    onMouseEnter={() => setActiveIdx(i)}
                  >
                    <div className="search-result-icon">
                      <Icon size={16} />
                    </div>
                    <div className="search-result-text">
                      <span className="search-result-label">{item.label}</span>
                      <span className="search-result-desc">{item.description}</span>
                    </div>
                    <div className="search-result-arrow">→</div>
                  </button>
                );
              })}
            </div>
          )}
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
