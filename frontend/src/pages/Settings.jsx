import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Lock, Clock } from 'lucide-react';

const Settings = ({ onLogout }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 800);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem' }}>
      <div className="page-header glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div className="icon-container" style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '1rem', color: 'var(--accent-green)' }}>
          <SettingsIcon size={40} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>System Settings</h1>
          <p style={{ margin: '0.5rem 0 0 0', opacity: 0.8, fontSize: '1.1rem' }}>Configure application preferences and AI parameters</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', maxWidth: '800px' }}>
        


        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1rem' }}>
          <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.3rem' }}>
            <Bell size={20} color="var(--accent-green)" /> Notifications
          </h3>
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontWeight: 600 }}>System Alerts</div>
              <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Receive alerts for model updates and system downtime</div>
            </div>
            <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--accent-green)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Batch Processing</div>
              <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Notify when a batch analysis is complete</div>
            </div>
            <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--accent-green)' }} />
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1rem' }}>
          <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.3rem' }}>
            <Lock size={20} color="var(--accent-green)" /> Data Privacy
          </h3>
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Help Improve SmartWaste AI</div>
              <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Allow anonymous use of uploaded images to improve model accuracy</div>
            </div>
            <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--accent-green)' }} />
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1rem' }}>
          <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.3rem' }}>
            <Clock size={20} color="var(--accent-green)" /> History Retention
          </h3>
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Auto-Delete History</label>
              <select style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(150,150,150,0.3)', color: 'inherit' }}>
                <option value="never" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Never (Keep indefinitely)</option>
                <option value="30" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>After 30 days</option>
                <option value="90" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>After 90 days</option>
                <option value="365" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>After 1 year</option>
              </select>
            </div>
          </div>
        </div>

        {onLogout && (
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.3rem', color: '#ef4444' }}>
              <Shield size={20} /> Account & Session
            </h3>
            <p style={{ opacity: 0.8, fontSize: '0.95rem', margin: '0.5rem 0 1.25rem 0' }}>
              Sign out of your active session on this device.
            </p>
            <button
              onClick={onLogout}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(239,68,68,0.4)',
                background: 'rgba(239,68,68,0.1)',
                color: '#ef4444',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.95rem'
              }}
            >
              Sign Out
            </button>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              fontWeight: 600,
              background: isSaved ? '#22c55e' : 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '1rem',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              width: 'fit-content',
              transition: 'background-color 0.3s ease, opacity 0.3s ease',
              opacity: isSaving ? 0.7 : 1
            }}>
            {isSaving ? 'Saving...' : isSaved ? 'Preferences Saved!' : 'Save Preferences'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Settings;
