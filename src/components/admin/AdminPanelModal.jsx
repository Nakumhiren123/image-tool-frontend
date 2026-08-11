import React, { useState, useEffect } from 'react';
import { X, Users, Crown, Shield, Zap, Search, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminPanelModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    if (isOpen && user?.is_admin) {
      fetchAdminData();
    }
  }, [isOpen, user]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/admin/users`, { credentials: 'include' }),
        fetch(`${API_BASE}/admin/stats`, { credentials: 'include' }),
      ]);

      const usersData = await usersRes.json();
      const statsData = await statsRes.json();

      if (usersData.success) setUsersList(usersData.users || []);
      if (statsData.success) setStats(statsData.stats);
    } catch (err) {
      console.error('Fetch Admin Data Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlan = async (userId, newPlan, days) => {
    setActionMessage('');
    try {
      const res = await fetch(`${API_BASE}/admin/users/update-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId, plan: newPlan, days }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(`✅ ${data.message}`);
        fetchAdminData();
      } else {
        alert(data.error || 'Action failed');
      }
    } catch (e) {
      alert('Error updating user plan');
    }
  };

  const handleToggleAdmin = async (userId, currentIsAdmin) => {
    setActionMessage('');
    try {
      const res = await fetch(`${API_BASE}/admin/users/toggle-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId, isAdmin: !currentIsAdmin }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(`✅ ${data.message}`);
        fetchAdminData();
      } else {
        alert(data.error || 'Action failed');
      }
    } catch (e) {
      alert('Error updating admin role');
    }
  };

  if (!isOpen) return null;
  if (!user?.is_admin) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-panel" style={{ maxWidth: 440, padding: 32, textAlign: 'center', borderRadius: 20 }}>
          <AlertCircle size={48} color="#EF4444" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>Access Denied</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: 6, marginBottom: 20 }}>
            Only designated Admin users have permission to open this control panel.
          </p>
          <button onClick={onClose} className="btn btn-primary">Close</button>
        </div>
      </div>
    );
  }

  const filteredUsers = usersList.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel animate-in"
        style={{
          maxWidth: 960, borderRadius: 24, padding: 0, overflow: 'hidden',
          display: 'flex', flexDirection: 'column', maxHeight: '92vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div style={{
          padding: '24px 32px 20px',
          background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
          color: '#fff', position: 'relative',
        }}>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{
              position: 'absolute', top: 16, right: 16,
              borderRadius: '50%', width: 32, height: 32, padding: 0,
              color: '#94A3B8', background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{
              padding: '3px 10px', borderRadius: 99,
              background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
              color: '#fff', fontSize: '0.68rem', fontWeight: 900,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              <Shield size={12} />
              Platform Administrator
            </span>
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
            👑 PicCraft Admin Control Panel
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: 2 }}>
            Manage registered users, control subscription plans, and monitor SaaS platform analytics.
          </p>

          {/* Stats Bar */}
          {stats && (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 18,
            }}>
              <div style={{ padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>Total Users</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff' }}>{stats.totalUsers}</div>
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>Active Pro Users</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#38BDF8' }}>{stats.activeProUsers}</div>
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>Pro Monthly</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#818CF8' }}>{stats.monthlySubscribers}</div>
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>Pro Yearly</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#34D399' }}>{stats.yearlySubscribers}</div>
              </div>
            </div>
          )}
        </div>

        {/* ── Filter Controls ── */}
        <div style={{
          padding: '14px 32px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, maxWidth: 360, position: 'relative' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: 12 }} />
            <input
              type="text"
              placeholder="Search user by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '8px 12px 8px 36px', borderRadius: 10,
                border: '1px solid #CBD5E1', fontSize: '0.82rem', outline: 'none',
              }}
            />
          </div>

          {actionMessage && (
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669' }}>
              {actionMessage}
            </span>
          )}

          <button
            onClick={fetchAdminData}
            className="btn btn-ghost btn-sm"
            style={{ borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh List
          </button>
        </div>

        {/* ── Users Table ── */}
        <div style={{ padding: '0 32px 32px', background: '#FFFFFF', overflowY: 'auto', flex: 1 }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>Loading user data...</div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#94A3B8' }}>No matching users found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16, fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                  <th style={{ padding: '10px 8px' }}>User Details</th>
                  <th style={{ padding: '10px 8px' }}>Role</th>
                  <th style={{ padding: '10px 8px' }}>Current Plan</th>
                  <th style={{ padding: '10px 8px' }}>Expiry Date</th>
                  <th style={{ padding: '10px 8px', textAlign: 'right' }}>Admin Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const isProUser = u.is_pro && (!u.expires_at || new Date(u.expires_at) > new Date());
                  return (
                    <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 8px' }}>
                        <div style={{ fontWeight: 800, color: '#0F172A' }}>{u.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{u.email}</div>
                      </td>

                      <td style={{ padding: '12px 8px' }}>
                        {u.is_admin ? (
                          <span className="badge badge-purple" style={{ fontSize: '0.65rem', fontWeight: 900 }}>
                            👑 ADMIN
                          </span>
                        ) : (
                          <span className="badge badge-gray" style={{ fontSize: '0.65rem' }}>USER</span>
                        )}
                      </td>

                      <td style={{ padding: '12px 8px' }}>
                        <span className={`badge ${isProUser ? 'badge-indigo' : 'badge-gray'}`}>
                          {isProUser ? (u.plan?.toUpperCase() || 'PRO') : 'FREE'}
                        </span>
                      </td>

                      <td style={{ padding: '12px 8px', color: '#64748B' }}>
                        {u.expires_at
                          ? new Date(u.expires_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                          : 'Lifetime / Free'}
                      </td>

                      <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleUpdatePlan(u.id, 'monthly', 30)}
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.7rem', background: '#EFF6FF', color: '#2563EB', borderRadius: 6, fontWeight: 700 }}
                            title="Grant 30 days Monthly Pro"
                          >
                            +30 Days Pro
                          </button>
                          <button
                            onClick={() => handleUpdatePlan(u.id, 'yearly', 365)}
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.7rem', background: '#ECFDF5', color: '#059669', borderRadius: 6, fontWeight: 700 }}
                            title="Grant 365 days Yearly Pro"
                          >
                            +1 Year Pro
                          </button>
                          {isProUser && (
                            <button
                              onClick={() => handleUpdatePlan(u.id, 'free', 0)}
                              className="btn btn-ghost btn-sm"
                              style={{ padding: '4px 8px', fontSize: '0.7rem', background: '#FEF2F2', color: '#DC2626', borderRadius: 6, fontWeight: 700 }}
                              title="Set to Free"
                            >
                              Revoke Pro
                            </button>
                          )}
                          <button
                            onClick={() => handleToggleAdmin(u.id, u.is_admin)}
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.7rem', background: '#F5F3FF', color: '#7C3AED', borderRadius: 6, fontWeight: 700 }}
                            title="Toggle Admin Access"
                          >
                            {u.is_admin ? 'Demote' : 'Make Admin'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
