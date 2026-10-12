import React, { useState } from 'react';
import { Shield, Users, Download, Lock, Unlock, Trash2, UserCheck, UserX, FileText, BarChart2, Settings2 } from 'lucide-react';

// Mock user data
const MOCK_USERS = [
  { id: 1, name: 'Admin User', email: 'admin@smartwaste.ai', role: 'Admin', status: 'Active', joined: 'Jan 2026', scans: 156 },
  { id: 2, name: 'Poorani', email: 'poorani@smartwaste.ai', role: 'User', status: 'Active', joined: 'Feb 2026', scans: 42 },
  { id: 3, name: 'Ravi Kumar', email: 'ravi@waste.org', role: 'User', status: 'Active', joined: 'Mar 2026', scans: 89 },
  { id: 4, name: 'Meena S', email: 'meena@waste.org', role: 'User', status: 'Suspended', joined: 'Mar 2026', scans: 12 },
  { id: 5, name: 'Karthik V', email: 'karthik@smartwaste.ai', role: 'User', status: 'Active', joined: 'Apr 2026', scans: 67 },
];

const PERMISSIONS = [
  { id: 'classify', label: 'Classify Waste', desc: 'Upload images for AI classification', icon: '🧠' },
  { id: 'history', label: 'View History', desc: 'Access classification history', icon: '📋' },
  { id: 'analytics', label: 'Analytics', desc: 'View charts and statistics', icon: '📊' },
  { id: 'batch', label: 'Batch Analysis', desc: 'Process multiple images at once', icon: '📦' },
  { id: 'reports', label: 'Download Reports', desc: 'Export PDF classification reports', icon: '📄' },
  { id: 'models', label: 'Model Performance', desc: 'View AI model metrics', icon: '⚡' },
];

const StatusBadge = ({ status }) => (
  <span style={{
    padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700,
    background: status === 'Active' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
    color: status === 'Active' ? '#10b981' : '#ef4444',
  }}>{status}</span>
);

const RoleBadge = ({ role }) => (
  <span style={{
    padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700,
    background: role === 'Admin' ? 'rgba(139,92,246,0.12)' : 'rgba(59,130,246,0.12)',
    color: role === 'Admin' ? '#8b5cf6' : '#3b82f6',
  }}>{role}</span>
);

const AdminPanel = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [permissions, setPermissions] = useState({
    classify: true, history: true, analytics: true,
    batch: false, reports: false, models: true,
  });
  const [activeTab, setActiveTab] = useState('users');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u
    ));
    showToast('User status updated');
  };

  const promoteToAdmin = (id) => {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, role: u.role === 'Admin' ? 'User' : 'Admin' } : u
    ));
    showToast('User role updated');
  };

  const removeUser = (id) => {
    if (id === 1) { showToast('Cannot remove primary admin!', 'error'); return; }
    setUsers(prev => prev.filter(u => u.id !== id));
    showToast('User removed', 'error');
  };

  const togglePermission = (key) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
    showToast(`Permission "${key}" ${permissions[key] ? 'disabled' : 'enabled'}`);
  };

  const downloadUserReport = () => {
    const now = new Date().toLocaleString();
    const rows = users.map(u =>
      `<tr>
        <td>${u.name}</td><td>${u.email}</td>
        <td>${u.role}</td><td>${u.status}</td>
        <td>${u.joined}</td><td>${u.scans}</td>
      </tr>`
    ).join('');

    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/>
<title>SmartWaste_Admin_User_Report</title>
<style>
  @media print { .no-print { display:none; } }
  body { font-family:'Segoe UI',Arial,sans-serif; max-width:800px; margin:32px auto; color:#111; }
  h1 { color:#8b5cf6; } .subtitle { color:#6b7280; font-size:0.88rem; margin-bottom:24px; }
  table { border-collapse:collapse; width:100%; font-size:0.9rem; }
  th { background:#f3f4f6; padding:10px 14px; text-align:left; font-weight:700; border-bottom:2px solid #e5e7eb; }
  td { padding:10px 14px; border-bottom:1px solid #f3f4f6; }
  tr:last-child td { border:none; }
  footer { margin-top:28px; font-size:0.78rem; color:#9ca3af; border-top:1px solid #e5e7eb; padding-top:12px; }
  .btn { display:inline-block; margin-top:20px; padding:10px 24px; background:#8b5cf6; color:#fff; border:none; border-radius:8px; font-size:0.95rem; cursor:pointer; }
</style>
</head><body>
<h1>🛡 SmartWaste AI — Admin Report</h1>
<div class="subtitle">User Management Report &nbsp;·&nbsp; Generated: ${now}</div>
<table>
  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Scans</th></tr></thead>
  <tbody>${rows}</tbody>
</table>
<footer>SmartWaste AI Admin Panel — Confidential. For internal use only.</footer>
<button class="btn no-print" onclick="window.print()">⬇ Save as PDF</button>
<script>window.onload=function(){setTimeout(function(){window.print();},400);};<\/script>
</body></html>`;

    const w = window.open('', '_blank', 'width=900,height=700');
    if (w) { w.document.write(html); w.document.close(); }
  };

  const tabs = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'permissions', label: 'Permissions', icon: Settings2 },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '2rem' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '90px', right: '24px', zIndex: 9999,
          padding: '12px 20px', borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem',
          background: toast.type === 'error' ? '#ef4444' : '#10b981',
          color: 'white', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          animation: 'slideUp 0.3s ease'
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(139,92,246,0.15)', borderRadius: '1rem', color: '#8b5cf6' }}>
            <Shield size={40} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>Admin Panel</h1>
            <p style={{ margin: '0.4rem 0 0', color: 'var(--text-secondary)' }}>Manage users, permissions and download reports</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ padding: '4px 14px', background: 'rgba(139,92,246,0.12)', color: '#8b5cf6', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700, border: '1.5px solid rgba(139,92,246,0.3)' }}>
            🛡 Admin Access
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { icon: Users, label: 'Total Users', value: users.length, color: '#3b82f6' },
          { icon: UserCheck, label: 'Active', value: users.filter(u => u.status === 'Active').length, color: '#10b981' },
          { icon: UserX, label: 'Suspended', value: users.filter(u => u.status === 'Suspended').length, color: '#ef4444' },
          { icon: Shield, label: 'Admins', value: users.filter(u => u.role === 'Admin').length, color: '#8b5cf6' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', borderRadius: '1rem' }}>
            <div style={{ padding: '0.6rem', background: `${color}18`, borderRadius: '0.6rem', color }}>
              <Icon size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1, color: 'var(--text-primary)' }}>{value}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              padding: '0.6rem 1.2rem', borderRadius: '2rem', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontWeight: 600, fontSize: '0.9rem', fontFamily: 'Outfit, sans-serif',
              background: activeTab === id ? '#8b5cf6' : 'var(--surface)',
              color: activeTab === id ? 'white' : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === id ? '0 4px 14px rgba(139,92,246,0.3)' : 'none',
            }}
          >
            <Icon size={16} />{label}
          </button>
        ))}
      </div>

      {/* ── User Management Tab ── */}
      {activeTab === 'users' && (
        <div className="glass-panel" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Registered Users</h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{users.length} users total</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--surface-hover)' }}>
                  {['User', 'Email', 'Role', 'Status', 'Joined', 'Scans', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-color)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
                          {u.name.charAt(0)}
                        </div>
                        {u.name}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{u.email}</td>
                    <td style={{ padding: '14px 16px' }}><RoleBadge role={u.role} /></td>
                    <td style={{ padding: '14px 16px' }}><StatusBadge status={u.status} /></td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{u.joined}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-primary)', fontWeight: 600 }}>{u.scans}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          title={u.role === 'Admin' ? 'Demote to User' : 'Promote to Admin'}
                          onClick={() => promoteToAdmin(u.id)}
                          style={{ padding: '5px 8px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: u.role === 'Admin' ? 'rgba(139,92,246,0.15)' : 'rgba(59,130,246,0.1)', color: u.role === 'Admin' ? '#8b5cf6' : '#3b82f6' }}
                        >
                          <Shield size={14} />
                        </button>
                        <button
                          title={u.status === 'Active' ? 'Suspend user' : 'Activate user'}
                          onClick={() => toggleStatus(u.id)}
                          style={{ padding: '5px 8px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: u.status === 'Active' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: u.status === 'Active' ? '#ef4444' : '#10b981' }}
                        >
                          {u.status === 'Active' ? <Lock size={14} /> : <Unlock size={14} />}
                        </button>
                        <button
                          title="Remove user"
                          onClick={() => removeUser(u.id)}
                          style={{ padding: '5px 8px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Permissions Tab ── */}
      {activeTab === 'permissions' && (
        <div className="glass-panel" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Default User Permissions</h3>
            <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Control what regular users can access by default</p>
          </div>
          <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {PERMISSIONS.map(perm => (
              <div
                key={perm.id}
                style={{
                  padding: '1.25rem', borderRadius: '0.75rem',
                  border: `1.5px solid ${permissions[perm.id] ? 'rgba(16,185,129,0.3)' : 'var(--border-color)'}`,
                  background: permissions[perm.id] ? 'rgba(16,185,129,0.05)' : 'var(--surface-hover)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.4rem' }}>{perm.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{perm.label}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{perm.desc}</div>
                  </div>
                </div>
                {/* Toggle switch */}
                <button
                  onClick={() => togglePermission(perm.id)}
                  style={{
                    width: '48px', height: '26px', borderRadius: '13px', border: 'none',
                    cursor: 'pointer', position: 'relative', flexShrink: 0,
                    background: permissions[perm.id] ? 'var(--accent-green)' : 'var(--border-color)',
                    transition: 'background 0.25s ease',
                  }}
                >
                  <span style={{
                    position: 'absolute', top: '3px',
                    left: permissions[perm.id] ? '25px' : '3px',
                    width: '20px', height: '20px',
                    background: 'white', borderRadius: '50%',
                    transition: 'left 0.25s ease',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
                  }} />
                </button>
              </div>
            ))}
          </div>
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', background: 'var(--surface-hover)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            ⚠ Admins always have full access regardless of these settings.
          </div>
        </div>
      )}

      {/* ── Reports Tab ── */}
      {activeTab === 'reports' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[
            {
              icon: Users, color: '#8b5cf6', title: 'User Report',
              desc: 'Export all registered users with roles, status and activity stats.',
              action: downloadUserReport, btnLabel: 'Download User Report'
            },
            {
              icon: BarChart2, color: '#3b82f6', title: 'Analytics Report',
              desc: 'Classification statistics, confidence distributions and category breakdowns.',
              action: () => window.open('/dashboard', '_blank'), btnLabel: 'View Analytics'
            },
            {
              icon: FileText, color: '#10b981', title: 'System Report',
              desc: 'Model performance, uptime and classification accuracy report.',
              action: () => window.open('/models', '_blank'), btnLabel: 'View Model Stats'
            },
          ].map(({ icon: Icon, color, title, desc, action, btnLabel }) => (
            <div key={title} className="glass-panel" style={{ padding: '1.75rem', borderRadius: '1rem' }}>
              <div style={{ padding: '0.75rem', background: `${color}18`, borderRadius: '0.75rem', color, width: 'fit-content', marginBottom: '1rem' }}>
                <Icon size={28} />
              </div>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{title}</h3>
              <p style={{ margin: '0 0 1.5rem', color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>{desc}</p>
              <button
                onClick={action}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.6rem 1.25rem', borderRadius: '0.6rem', border: 'none',
                  background: color, color: 'white', fontWeight: 600, cursor: 'pointer',
                  fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif',
                }}
              >
                <Download size={15} /> {btnLabel}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
