import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Key, Globe, Database, Save, Check } from 'lucide-react';

export function Settings() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    jwtExpiry: '3600',
    maxLoginAttempts: '5',
    sessionTimeout: '1800',
    apiRateLimit: '100',
    enable2FA: true,
    enableAuditLog: true,
    enableNotifications: true,
    dbPoolSize: '20',
    corsOrigins: 'http://localhost:3000,http://localhost:5173',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Configure security, infrastructure, and system parameters</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Settings */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-semibold text-white">Security & Authentication</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">JWT Token Expiry (seconds)</label>
              <input
                type="number"
                value={settings.jwtExpiry}
                onChange={(e) => setSettings({ ...settings, jwtExpiry: e.target.value })}
                className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Max Login Attempts</label>
              <input
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => setSettings({ ...settings, maxLoginAttempts: e.target.value })}
                className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Session Timeout (seconds)</label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-white">Two-Factor Authentication</p>
                <p className="text-xs text-slate-500">Require 2FA for all admin accounts</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, enable2FA: !settings.enable2FA })}
                className={`w-11 h-6 rounded-full transition-colors relative ${settings.enable2FA ? 'bg-primary' : 'bg-surface-lighter'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.enable2FA ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-white">Audit Logging</p>
                <p className="text-xs text-slate-500">Log all admin actions for compliance</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, enableAuditLog: !settings.enableAuditLog })}
                className={`w-11 h-6 rounded-full transition-colors relative ${settings.enableAuditLog ? 'bg-primary' : 'bg-surface-lighter'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.enableAuditLog ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Infrastructure Settings */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Database className="w-5 h-5 text-accent" />
            <h2 className="text-sm font-semibold text-white">Infrastructure</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">API Rate Limit (req/min)</label>
              <input
                type="number"
                value={settings.apiRateLimit}
                onChange={(e) => setSettings({ ...settings, apiRateLimit: e.target.value })}
                className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Database Connection Pool Size</label>
              <input
                type="number"
                value={settings.dbPoolSize}
                onChange={(e) => setSettings({ ...settings, dbPoolSize: e.target.value })}
                className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">CORS Allowed Origins</label>
              <input
                type="text"
                value={settings.corsOrigins}
                onChange={(e) => setSettings({ ...settings, corsOrigins: e.target.value })}
                className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-sm text-white focus:outline-none focus:border-primary font-mono text-xs"
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-white">Push Notifications</p>
                <p className="text-xs text-slate-500">Real-time alerts via WebSocket</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, enableNotifications: !settings.enableNotifications })}
                className={`w-11 h-6 rounded-full transition-colors relative ${settings.enableNotifications ? 'bg-primary' : 'bg-surface-lighter'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.enableNotifications ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Role-Based Access Control Info */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Key className="w-5 h-5 text-warning" />
            <h2 className="text-sm font-semibold text-white">Role-Based Access Control</h2>
          </div>
          <div className="space-y-3">
            {[
              { role: 'ADMIN', desc: 'Full system access, user management, fleet CRUD', color: 'text-danger', endpoints: '/api/admin/**' },
              { role: 'OPERATOR', desc: 'Fleet monitoring, route management, delivery updates', color: 'text-warning', endpoints: '/api/operator/**' },
              { role: 'VIEWER', desc: 'Read-only access to dashboards and reports', color: 'text-accent', endpoints: '/api/public/**' },
            ].map((r) => (
              <div key={r.role} className="p-3 rounded-lg bg-surface-light/50 border border-border/20">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-bold ${r.color}`}>{r.role}</span>
                  <code className="text-[10px] text-slate-500 font-mono">{r.endpoints}</code>
                </div>
                <p className="text-xs text-slate-400">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Globe className="w-5 h-5 text-neon" />
            <h2 className="text-sm font-semibold text-white">System Information</h2>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Platform', value: 'NeuroFleet AI v2.4.1' },
              { label: 'Frontend', value: 'React 19 + Vite + TypeScript' },
              { label: 'Backend', value: 'Spring Boot 3.2.x (Java 21)' },
              { label: 'Database', value: 'PostgreSQL 16' },
              { label: 'Auth', value: 'JWT + Spring Security RBAC' },
              { label: 'Infrastructure', value: 'Docker Compose' },
              { label: 'Admin', value: user?.fullName || 'Unknown' },
              { label: 'Admin Role', value: user?.role || 'Unknown' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-border/10 last:border-0">
                <span className="text-xs text-slate-400">{item.label}</span>
                <span className="text-xs text-white font-mono">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
