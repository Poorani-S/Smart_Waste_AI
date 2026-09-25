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
  
  // Mobile sidebar state
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('smartwaste-theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Update DOM when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('smartwaste-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    if (window.innerWidth <= 1024) {
      setMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  return (
    <Router>
      <div className="app-container">
        <Sidebar isCollapsed={isSidebarCollapsed} className={isMobileSidebarOpen ? 'mobile-open' : ''} />
        
        <div className={`main-wrapper ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <Navbar 
            theme={theme} 
            toggleTheme={toggleTheme} 
            toggleSidebar={toggleSidebar} 
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
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
        
        {/* Mobile overlay */}
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
