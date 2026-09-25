import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Leaf, Scan, LayoutDashboard, History, 
  Settings, Info, Layers, Beaker, FileBox
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isCollapsed }) => {
  return (
    <aside className={`sidebar glass-panel ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-icon-wrapper">
          <Leaf className="logo-icon" size={28} />
        </div>
        {!isCollapsed && (
          <h1 className="logo-text">SmartWaste<span className="logo-highlight">AI</span></h1>
        )}
      </div>
      
      <div className="sidebar-content">
        <div className="nav-group">
          {!isCollapsed && <span className="nav-group-label">MAIN</span>}
          <nav className="sidebar-nav">
            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end title="Overview">
              <div className="nav-icon"><LayoutDashboard size={20} /></div>
              {!isCollapsed && <span>Overview</span>}
            </NavLink>
            
            <NavLink to="/classify" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Classify Waste">
              <div className="nav-icon"><Scan size={20} /></div>
              {!isCollapsed && <span>Classify Waste</span>}
            </NavLink>
            
            <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Analytics">
              <div className="nav-icon"><Beaker size={20} /></div>
              {!isCollapsed && <span>Analytics</span>}
            </NavLink>
            
            <NavLink to="/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="History">
              <div className="nav-icon"><History size={20} /></div>
              {!isCollapsed && <span>History</span>}
            </NavLink>
          </nav>
        </div>

        <div className="nav-group">
          {!isCollapsed && <span className="nav-group-label">AI & MODELS</span>}
          <nav className="sidebar-nav">
            <NavLink to="/models" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Model Performance">
              <div className="nav-icon"><Layers size={20} /></div>
              {!isCollapsed && <span>Model Performance</span>}
            </NavLink>
          </nav>
        </div>

        <div className="nav-group">
          {!isCollapsed && <span className="nav-group-label">WASTE</span>}
          <nav className="sidebar-nav">
            <NavLink to="/waste-guide" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Waste Guide">
              <div className="nav-icon"><Leaf size={20} /></div>
              {!isCollapsed && <span>Waste Guide</span>}
            </NavLink>
            <NavLink to="/batch" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Batch Analysis">
              <div className="nav-icon"><FileBox size={20} /></div>
              {!isCollapsed && <span>Batch Analysis</span>}
            </NavLink>
          </nav>
        </div>

        <div className="nav-group mt-auto">
          {!isCollapsed && <span className="nav-group-label">SYSTEM</span>}
          <nav className="sidebar-nav">
            <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Settings">
              <div className="nav-icon"><Settings size={20} /></div>
              {!isCollapsed && <span>Settings</span>}
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="About">
              <div className="nav-icon"><Info size={20} /></div>
              {!isCollapsed && <span>About</span>}
            </NavLink>
          </nav>
        </div>
      </div>
      
      <div className="sidebar-footer">
        <div className="system-status" title="API Status: Online">
          <div className="status-indicator online"></div>
          {!isCollapsed && <span>System Online</span>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
