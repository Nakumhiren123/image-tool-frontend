import React from 'react';
import { X, FileText, CheckCircle, RefreshCw, AlertTriangle, CreditCard } from 'lucide-react';

export default function TermsModal({ isOpen, onClose }) {
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
            <FileText size={20} color="#3B82F6" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Legal Agreements
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
            Terms of Service & Refund Policy
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: 4, margin: 0 }}>
            Effective Date: August 3, 2026 • Razorpay Merchant Compliant
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: 32, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>

          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <CheckCircle size={18} color="#10B981" /> 1. Acceptance of Terms
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
              By accessing or using <strong>PicCraft Image Tool</strong>, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must discontinue use of the platform immediately.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <AlertTriangle size={18} color="#F59E0B" /> 2. Fair Usage & Pro Limits
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
              Free tier users are limited to processing up to <strong>5 images per batch</strong> and a maximum file size of 10 MB per upload request. <strong>PicCraft Pro</strong> provides premium processing features and an ad-free experience, subject to the limits and availability described on the platform. Automated scraping, abusive automation, or attempts to bypass platform limits are strictly prohibited.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <CreditCard size={18} color="#3B82F6" /> 3. Subscriptions & Billing
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
              Paid plans are billed through Razorpay according to the plan, price, and duration
              displayed at checkout. Once payment is successfully completed, the purchased plan
              remains active for its applicable period and cannot be cancelled or refunded,
              except where required by applicable law.
            </p>
          </div>

          <div style={{ background: '#FFF7ED', padding: 20, borderRadius: 16, border: '1px solid #FED7AA' }}>
            <h3 style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              color: '#9A3412',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 8
            }}>
              <RefreshCw size={18} color="#F97316" /> 4. Cancellation & Refund Policy
            </h3>

            <p style={{
              fontSize: '0.88rem',
              color: '#9A3412',
              lineHeight: 1.6
            }}>
              Paid plans are non-refundable and cannot be cancelled once the payment has been successfully completed.
              The purchased plan remains active for the applicable subscription period. We do not provide refunds
              for unused time, partial periods, change of mind, or failure to use the service. Any refund required
              by applicable law will be handled in accordance with that law.
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
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
}
