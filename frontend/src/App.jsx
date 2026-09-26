import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Classify from './pages/Classify';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Models from './pages/ModelPerformance';
import WasteGuide from './pages/WasteGuide';
import BatchAnalysis from './pages/BatchAnalysis';
import Settings from './pages/Settings';
import About from './pages/About';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const [theme, setTheme] = useState('light');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Auth state — uses sessionStorage so every fresh browser open starts at /login
  // sessionStorage is cleared automatically when the tab/browser is closed
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!sessionStorage.getItem('smartwaste_session')
  );

  // Theme init
  useEffect(() => {
    const savedTheme = localStorage.getItem('smartwaste-theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('smartwaste-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const toggleSidebar = () => {
    if (window.innerWidth <= 1024) {
      setMobileSidebarOpen(prev => !prev);
    } else {
      setSidebarCollapsed(prev => !prev);
    }
  };

  // Called after successful login/signup
  const handleLoginSuccess = () => {
    sessionStorage.setItem('smartwaste_session', 'active');
    setIsLoggedIn(true);
  };

  // Called on logout
  const handleLogout = () => {
    sessionStorage.removeItem('smartwaste_session');
    localStorage.removeItem('smartwaste_user');
    setIsLoggedIn(false);
  };

  // ─── NOT LOGGED IN ─── Show only login/signup, no sidebar/navbar ───────────
  if (!isLoggedIn) {
    return (
      <Router>
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
          <Routes>
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/signup" element={<Signup onLoginSuccess={handleLoginSuccess} />} />
            {/* Every other path → /login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    );
  }

  // ─── LOGGED IN ─── Full app with sidebar + navbar ──────────────────────────
  return (
    <Router>
      <div className="app-container">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          className={isMobileSidebarOpen ? 'mobile-open' : ''}
        />

        <div className={`main-wrapper ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <Navbar
            theme={theme}
            toggleTheme={toggleTheme}
            toggleSidebar={toggleSidebar}
            onLogout={handleLogout}
          />

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/classify" element={<Classify />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/history" element={<History />} />
              <Route path="/models" element={<Models />} />
              <Route path="/waste-guide" element={<WasteGuide />} />
              <Route path="/batch" element={<BatchAnalysis />} />
              <Route path="/settings" element={<Settings onLogout={handleLogout} />} />
              <Route path="/about" element={<About />} />
              <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
              <Route path="/notifications" element={<Notifications />} />
              {/* Auth routes → home when already logged in */}
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/signup" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>

        {isMobileSidebarOpen && window.innerWidth <= 1024 && (
          <div
            className="mobile-overlay"
            onClick={() => setMobileSidebarOpen(false)}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 95
            }}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
