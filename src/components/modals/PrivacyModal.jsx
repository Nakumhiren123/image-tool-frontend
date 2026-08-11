import React from 'react';
import { X, ShieldCheck, Lock, Eye, Server, Cookie } from 'lucide-react';

export default function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div
        className="modal-panel animate-in"
        style={{
          maxWidth: 680, width: '100%', borderRadius: 24, background: '#FFFFFF',
          padding: 0, overflow: 'hidden', maxHeight: '90vh', display: 'flex',
          flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '24px 32px', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: '#FFFFFF', position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 18, right: 18, borderRadius: '50%',
              width: 32, height: 32, padding: 0, color: '#94A3B8',
              background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <ShieldCheck size={20} color="#10B981" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Data Protection & Trust
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
            Privacy Policy
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: 4, margin: 0 }}>
            Effective Date: August 3, 2026 • Last Updated
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: 32, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>

          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Lock size={18} color="#3B82F6" /> 1. Zero Image Storage Policy
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
              At <strong>PicCraft</strong>, user privacy is our top priority. All client-side operations (Canvas filters, client conversions) occur entirely within your web browser memory without ever touching our servers. For server-assisted processing (Sharp engine), uploaded files are stored temporarily in isolated memory buffers and are <strong>permanently auto-purged immediately</strong> upon download. We never view, archive, or share your images.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Eye size={18} color="#3B82F6" /> 2. Personal Information Collected
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
              When you create an account, we collect minimal information necessary to provide subscription access:
            </p>
            <ul style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, paddingLeft: 20, marginTop: 8 }}>
              <li>Full Name and Email Address (for account authentication).</li>
              <li>Encrypted Password Hash (we never store plain text passwords).</li>
              <li>Basic Browser Telemetry (IP address, OS, browser type for security monitoring).</li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Server size={18} color="#3B82F6" /> 3. Payment Processing & Security
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
              All monetary transactions are processed securely through <strong>Razorpay Payment Gateway</strong> using PCI-DSS compliant encryption. PicCraft does not store credit card numbers, CVVs, or banking credentials on our servers.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Cookie size={18} color="#3B82F6" /> 4. Cookies & Advertising
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
              We use essential HTTP-Only session cookies to maintain your login status and subscription tier. For free users, non-personalized advertising tags may be displayed via Google AdSense compliant with GDPR & CCPA privacy standards.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: '16px 32px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', textAlign: 'right' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px', borderRadius: 12, background: '#0F172A', color: '#FFFFFF',
              fontWeight: 800, fontSize: '0.85rem', border: 'none', cursor: 'pointer'
            }}
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
