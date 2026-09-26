import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

// Check if user is authenticated
const isAuthenticated = () => !!localStorage.getItem('smartwaste_user');

// ProtectedRoute: redirect to /login if not authenticated
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// PublicOnlyRoute: redirect to / if already authenticated
const PublicOnlyRoute = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// AppLayout wraps authenticated pages with sidebar + navbar
function AppLayout({ theme, toggleTheme, toggleSidebar, isSidebarCollapsed, isMobileSidebarOpen, setMobileSidebarOpen }) {
  return (
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
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/classify" element={<ProtectedRoute><Classify /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/models" element={<ProtectedRoute><Models /></ProtectedRoute>} />
            <Route path="/waste-guide" element={<ProtectedRoute><WasteGuide /></ProtectedRoute>} />
            <Route path="/batch" element={<ProtectedRoute><BatchAnalysis /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
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
  );
}

function App() {
  const [theme, setTheme] = useState('light');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

  return (
    <Router>
      <Routes>
        {/* Auth routes — no sidebar/navbar */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <Signup />
            </PublicOnlyRoute>
          }
        />

        {/* App routes — with sidebar/navbar, all protected */}
        <Route
          path="/*"
          element={
            isAuthenticated() ? (
              <AppLayout
                theme={theme}
                toggleTheme={toggleTheme}
                toggleSidebar={toggleSidebar}
                isSidebarCollapsed={isSidebarCollapsed}
                isMobileSidebarOpen={isMobileSidebarOpen}
                setMobileSidebarOpen={setMobileSidebarOpen}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
