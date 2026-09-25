import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Layers, CheckCircle, BarChart2, Activity } from 'lucide-react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://localhost:5000';
  
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/dashboard/stats`);
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return <div className="loading-state">Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="error-state">Failed to load dashboard data.</div>;
  }

  const categoryData = Object.keys(stats.category_distribution || {}).map(key => ({
    name: key,
    value: (stats.category_distribution || {})[key]
  }));

  const confidenceData = Object.keys(stats.confidence_distribution || {}).map(key => ({
    name: key,
    value: (stats.confidence_distribution || {})[key]
  }));

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="dashboard-header">
        <h2>Analytics Dashboard</h2>
        <p>Real-time insights from the SmartWaste classification system.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon"><Layers /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.total_predictions}</span>
            <span className="stat-label">Total Scans</span>
          </div>
        </div>
        
        <div className="stat-card glass-panel">
          <div className="stat-icon"><Activity /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.average_confidence}%</span>
            <span className="stat-label">Avg Confidence</span>
          </div>
        </div>
        
        <div className="stat-card glass-panel">
          <div className="stat-icon"><CheckCircle /></div>
          <div className="stat-info">
            <span className="stat-value">EfficientNet</span>
            <span className="stat-label">Active Model</span>
          </div>
        </div>
        
        <div className="stat-card glass-panel">
          <div className="stat-icon"><BarChart2 /></div>
          <div className="stat-info">
            <span className="stat-value">5</span>
            <span className="stat-label">Classes Supported</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card glass-panel">
          <h3>Waste Category Distribution</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(19, 28, 38, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend">
            {categoryData.map((entry, index) => (
              <div key={entry.name} className="legend-item">
                <div className="legend-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card glass-panel">
          <h3>Confidence Levels</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={confidenceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: 'rgba(19, 28, 38, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Bar dataKey="value" fill="var(--accent-blue)" radius={[4, 4, 0, 0]}>
                  {confidenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={
                      entry.name === 'High' ? 'var(--accent-green)' : 
                      entry.name === 'Moderate' ? 'var(--warning)' : 'var(--danger)'
                    } />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
