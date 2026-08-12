import React, { useState, useEffect, useCallback, memo } from 'react';
import { X, User, Mail, Lock, UserPlus, LogIn, CheckCircle2, ShieldCheck } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';

const GoogleSignInButton = memo(function GoogleSignInButton({ onSuccess, onError }) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isUnconfigured = !clientId || clientId.includes('REPLACE_WITH_YOUR');

  if (isUnconfigured) {
    return (
      <div style={{
        padding: '10px 14px',
        borderRadius: 12,
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
        fontSize: '0.78rem',
        color: '#64748B',
        textAlign: 'center',
        width: '100%'
      }}>
        Google Sign-In (Set <code>VITE_GOOGLE_CLIENT_ID</code> in <code>frontend/.env</code>)
      </div>
    );
  }

  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={onError}
      useOneTap={false}
      theme="outline"
      size="large"
      shape="pill"
      text="continue_with"
      width="380"
    />
  );
});

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loginUser, registerUser, loginWithGoogle } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
      setSuccess('');
    }
  }, [isOpen, initialMode]);

  const handleGoogleSuccess = useCallback(async (credentialResponse) => {
    try {
      setError('');
      setIsSubmitting(true);
      await loginWithGoogle(credentialResponse.credential);
      setSuccess('Successfully signed in with Google!');
      setTimeout(() => {
        onClose();
        if (typeof onSuccess === 'function') onSuccess();
      }, 600);
    } catch (err) {
      setError(err.message || 'Google authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  }, [loginWithGoogle, onClose, onSuccess]);

  const handleGoogleError = useCallback(() => {
    setError('Google Sign-In failed. Check Authorized Javascript Origins in Google Cloud Console.');
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'register') {
      if (!name.trim()) return setError('Please enter your name.');
      if (!email.trim()) return setError('Please enter your email.');
      if (!password) return setError('Please enter a password.');
      if (password.length < 6) return setError('Password must be at least 6 characters.');
      if (password !== confirmPassword) return setError('Passwords do not match.');
    } else {
      if (!email.trim() || !password) return setError('Please enter email and password.');
    }

    setIsSubmitting(true);

    try {
      if (mode === 'register') {
        await registerUser(name, email, password);
        setSuccess('Account created successfully! Welcome to PicCraft PRO.');
      } else {
        await loginUser(email, password);
        setSuccess('Welcome back!');
      }
      setTimeout(() => {
        onClose();
        if (typeof onSuccess === 'function') onSuccess();
      }, 600);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel animate-in"
        style={{ maxWidth: 440, borderRadius: 20, padding: 0, overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Strip */}
        <div style={{
          padding: '24px 28px 16px',
          background: 'linear-gradient(135deg, #FAFBFD, #EFF6FF)',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'linear-gradient(135deg, #3B82F6, #0EA5E9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(59,130,246,0.25)',
            }}>
              <ShieldCheck size={20} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
                {mode === 'login' ? 'Welcome Back' : 'Create Free Account'}
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#64748B' }}>
                {mode === 'login' ? 'Sign in to access your saved presets' : 'Join PicCraft for unlimited tools & history'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ borderRadius: '50%', width: 32, height: 32, padding: 0 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ padding: '16px 28px 0' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4,
            padding: 4, background: '#F1F5F9', borderRadius: 12, border: '1px solid #E2E8F0',
          }}>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              style={{
                padding: '8px', borderRadius: 9, fontSize: '0.85rem', fontWeight: 700,
                border: 'none', cursor: 'pointer', transition: 'all 0.18s',
                background: mode === 'login' ? '#fff' : 'transparent',
                color: mode === 'login' ? '#1D4ED8' : '#64748B',
                boxShadow: mode === 'login' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <LogIn size={13} style={{ display: 'inline', marginRight: 6 }} />
              Sign In
            </button>

            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
              style={{
                padding: '8px', borderRadius: 9, fontSize: '0.85rem', fontWeight: 700,
                border: 'none', cursor: 'pointer', transition: 'all 0.18s',
                background: mode === 'register' ? '#fff' : 'transparent',
                color: mode === 'register' ? '#1D4ED8' : '#64748B',
                boxShadow: mode === 'register' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <UserPlus size={13} style={{ display: 'inline', marginRight: 6 }} />
              Sign Up
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div style={{ padding: '20px 28px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: 10, background: '#FEF2F2',
              border: '1px solid #FECACA', color: '#991B1B', fontSize: '0.8rem', fontWeight: 600,
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              padding: '10px 14px', borderRadius: 10, background: '#ECFDF5',
              border: '1px solid #A7F3D0', color: '#065F46', fontSize: '0.8rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <CheckCircle2 size={16} color="#059669" />
              {success}
            </div>
          )}

          {/* ── Official Google Sign-In Button via @react-oauth/google ── */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <GoogleSignInButton
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '2px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>OR EMAIL</span>
            <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Name field (Register only) */}
            {mode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={15} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 12 }} />
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                    style={{ paddingLeft: 36 }}
                    required
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 12 }} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  style={{ paddingLeft: 36 }}
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 12 }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  style={{ paddingLeft: 36 }}
                  required
                />
              </div>
            </div>

            {/* Confirm Password field (Register only) */}
            {mode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 12 }} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input"
                    style={{ paddingLeft: 36 }}
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ width: '100%', padding: '12px', borderRadius: 12, marginTop: 6, fontWeight: 800, fontSize: '0.9rem' }}
            >
              {isSubmitting ? 'Processing...' : mode === 'login' ? 'Sign In to Account' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
