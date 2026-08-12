import React, { useState } from 'react';
import { X, Check, Crown, Sparkles, ShieldCheck, Calendar, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function PricingModal({ isOpen, onClose, onOpenAuth }) {
  const { user, updateSubscription } = useAuth();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingPlan, setProcessingPlan] = useState(null);
  const [successData, setSuccessData] = useState(null);

  if (!isOpen) return null;

  /**
   * Loads the Razorpay checkout script dynamically (only once).
   */
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) return resolve(true);
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  /**
   * Handles Subscription Purchase by redirecting full-page to Razorpay Hosted Gateway
   */
  const handleSubscribe = async (planId) => {
    if (!user) {
      onClose();
      if (typeof onOpenAuth === 'function') onOpenAuth('register', planId);
      return;
    }

    setIsProcessing(true);
    setProcessingPlan(planId);

    try {
      // 1. Create Razorpay order on backend with selected plan
      const orderRes = await fetch(`${API_BASE}/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ plan: planId }),
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        alert(orderData.error || 'Could not create payment order. Please try again.');
        setIsProcessing(false);
        setProcessingPlan(null);
        return;
      }

      // 2. Redirect to Razorpay Hosted Payment Gateway Page via HTML form POST
      const callbackUrl = `${API_BASE}/payment/verify-redirect`;
      const cancelUrl = window.location.href;

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://api.razorpay.com/v1/checkout/embedded';

      const fields = {
        key_id: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'PicCraft Pro',
        description: orderData.productName,
        order_id: orderData.orderId,
        'prefill[name]': user.name || '',
        'prefill[email]': user.email || '',
        callback_url: callbackUrl,
        cancel_url: cancelUrl,
      };

      for (const [key, value] of Object.entries(fields)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit(); // Redirects browser full page to Razorpay Payment Gateway!

    } catch (err) {
      console.error('Payment Error:', err);
      alert('Something went wrong. Please try again.');
      setIsProcessing(false);
      setProcessingPlan(null);
    }
  };

  const formattedExpiry = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel animate-in"
        style={{
          maxWidth: 820,
          borderRadius: 24,
          padding: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Success Popup View ── */}
        {successData ? (
          <div style={{ padding: '40px 32px', textAlign: 'center', background: '#FFFFFF' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%', background: '#ECFDF5',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
            }}>
              <Sparkles size={36} color="#10B981" />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A', marginBottom: 8 }}>
              🎉 Welcome to PicCraft Pro!
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#64748B', marginBottom: 24 }}>
              Your subscription is active. All premium tools and limits are unlocked.
            </p>

            <div style={{
              maxWidth: 380, margin: '0 auto 28px', padding: 20, borderRadius: 16,
              background: '#F8FAFC', border: '1px solid #E2E8F0', textAlign: 'left',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Plan:</span>
                <span style={{ fontSize: '0.85rem', color: '#0F172A', fontWeight: 800 }}>{successData.plan}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Status:</span>
                <span className="badge badge-emerald">ACTIVE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Next Billing / Expiry:</span>
                <span style={{ fontSize: '0.85rem', color: '#3B82F6', fontWeight: 800 }}>{formattedExpiry(successData.expiresAt)}</span>
              </div>
            </div>

            <button
              onClick={() => { setSuccessData(null); onClose(); }}
              className="btn btn-primary btn-lg"
              style={{ borderRadius: 12, padding: '12px 32px', fontWeight: 800 }}
            >
              Continue to Dashboard
            </button>
          </div>
        ) : (
          <>
            {/* ── Header ── */}
            <div style={{
              padding: '24px 32px 20px',
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              color: '#fff',
              position: 'relative',
            }}>
              <button
                onClick={onClose}
                className="btn btn-ghost btn-sm"
                style={{
                  position: 'absolute', top: 16, right: 16,
                  borderRadius: '50%', width: 32, height: 32, padding: 0,
                  color: '#94A3B8', background: 'rgba(255,255,255,0.1)', border: 'none',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{
                  padding: '3px 10px', borderRadius: 99,
                  background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                  color: '#fff', fontSize: '0.68rem', fontWeight: 900,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                }}>
                  <Crown size={12} />
                  🚀 Upgrade to PicCraft Pro
                </span>
              </div>

              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
                Monthly or Yearly Plans • Cancel Anytime
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: 2 }}>
                Unlock batch processing (100+ images), 500 MB uploads, target KB precision, and 100% ad-free experience.
              </p>

              {/* ── Billing Cycle Selector ── */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 18,
                background: 'rgba(255,255,255,0.06)', padding: '6px 12px', borderRadius: 14,
              }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94A3B8' }}>Billing:</span>

                <button
                  onClick={() => setBillingCycle('monthly')}
                  style={{
                    padding: '7px 16px', borderRadius: 10, border: 'none',
                    fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.18s',
                    background: billingCycle === 'monthly' ? '#3B82F6' : 'transparent',
                    color: billingCycle === 'monthly' ? '#fff' : '#94A3B8',
                    boxShadow: billingCycle === 'monthly' ? '0 2px 8px rgba(59,130,246,0.4)' : 'none',
                  }}
                >
                  ● Monthly
                </button>

                <button
                  onClick={() => setBillingCycle('yearly')}
                  style={{
                    padding: '7px 16px', borderRadius: 10, border: 'none',
                    fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.18s',
                    background: billingCycle === 'yearly' ? '#10B981' : 'transparent',
                    color: billingCycle === 'yearly' ? '#fff' : '#94A3B8',
                    display: 'flex', alignItems: 'center', gap: 6,
                    boxShadow: billingCycle === 'yearly' ? '0 2px 8px rgba(16,185,129,0.4)' : 'none',
                  }}
                >
                  ○ Yearly
                  <span style={{
                    background: '#F59E0B', color: '#0F172A', padding: '1px 7px',
                    borderRadius: 99, fontSize: '0.65rem', fontWeight: 900,
                  }}>
                    1 Month Free
                  </span>
                </button>
              </div>
            </div>

            {/* ── Current Plan Status Bar ── */}
            <div style={{
              padding: '10px 32px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>Current Plan:</span>
                <span className={`badge ${user?.is_pro ? 'badge-indigo' : 'badge-gray'}`} style={{ fontWeight: 800 }}>
                  {user?.is_pro ? `PRO (${user?.plan?.toUpperCase() || 'ACTIVE'})` : 'FREE'}
                </span>
                {!user?.is_pro && (
                  <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>— 5 Images/batch limit · Ads Enabled</span>
                )}
              </div>
              {user?.expires_at && (
                <span style={{ fontSize: '0.74rem', color: '#3B82F6', fontWeight: 700 }}>
                  Next Billing: {formattedExpiry(user.expires_at)}
                </span>
              )}
            </div>

            {/* ── Pricing Cards Body ── */}
            <div style={{ padding: '24px 32px 32px', background: '#FFFFFF', overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>

                {/* Card 1: FREE Plan */}
                <div style={{
                  padding: 20, borderRadius: 18, border: '1px solid #E2E8F0',
                  background: '#FAFBFD', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      CURRENT
                    </span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A', marginTop: 2, marginBottom: 6 }}>
                      Free
                    </h3>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', marginBottom: 4 }}>
                      ₹0
                    </div>
                    <p style={{ fontSize: '0.76rem', color: '#94A3B8', marginBottom: 16 }}>
                      Free forever, standard limits
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid #F1F5F9', paddingTop: 12 }}>
                      {['5 Images per batch limit', '50 MB Max upload size', 'Standard processing speed', 'Banner Ads enabled', 'Basic export formats'].map((f) => (
                        <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Check size={13} color="#94A3B8" />
                          <span style={{ fontSize: '0.76rem', color: '#64748B' }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    disabled
                    className="btn btn-ghost btn-sm"
                    style={{ marginTop: 20, borderRadius: 10, width: '100%', fontWeight: 700, color: '#94A3B8', background: '#F1F5F9' }}
                  >
                    {user?.is_pro ? 'Free Tier' : 'Current Plan'}
                  </button>
                </div>

                {/* Card 2: PRO MONTHLY Plan */}
                <div style={{
                  padding: 20, borderRadius: 18,
                  border: billingCycle === 'monthly' ? '2px solid #3B82F6' : '1px solid #E2E8F0',
                  background: billingCycle === 'monthly' ? '#F0F7FF' : '#FFFFFF',
                  boxShadow: billingCycle === 'monthly' ? '0 4px 20px rgba(59,130,246,0.15)' : 'none',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  position: 'relative',
                }}>
                  {billingCycle === 'monthly' && (
                    <span style={{
                      position: 'absolute', top: -11, right: 16,
                      background: '#3B82F6', color: '#fff', fontSize: '0.65rem', fontWeight: 900,
                      padding: '2px 8px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>
                      ⭐ POPULAR
                    </span>
                  )}

                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      MONTHLY
                    </span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A', marginTop: 2, marginBottom: 6 }}>
                      Pro Monthly
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 2 }}>
                      <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A' }}>₹399</span>
                      <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>/month</span>
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginLeft: 4 }}>($4.99)</span>
                    </div>
                    <p style={{ fontSize: '0.76rem', color: '#64748B', marginBottom: 16 }}>
                      Billed monthly, cancel anytime
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid #E2E8F0', paddingTop: 12 }}>
                      {[
                        'Unlimited Images (100+ batch)',
                        '500 MB Max upload size',
                        '100% Ad-Free Clean Workspace',
                        '10x Faster Sharp Engine',
                        'Target KB Precision Search',
                        'All Passport & Exam Presets',
                        'Unlimited Watermark Presets',
                      ].map((f) => (
                        <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Check size={13} color="#2563EB" strokeWidth={2.5} />
                          <span style={{ fontSize: '0.76rem', color: '#1E293B', fontWeight: 600 }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSubscribe('monthly')}
                    disabled={isProcessing && processingPlan === 'monthly'}
                    className="btn btn-primary"
                    style={{ marginTop: 20, borderRadius: 10, width: '100%', fontWeight: 800, padding: '10px 0' }}
                  >
                    {isProcessing && processingPlan === 'monthly' ? 'Opening...' : 'Subscribe Now'}
                  </button>
                </div>

                {/* Card 3: PRO YEARLY Plan */}
                <div style={{
                  padding: 20, borderRadius: 18,
                  border: billingCycle === 'yearly' ? '2px solid #10B981' : '1px solid #E2E8F0',
                  background: billingCycle === 'yearly' ? '#ECFDF5' : '#FFFFFF',
                  boxShadow: billingCycle === 'yearly' ? '0 4px 20px rgba(16,185,129,0.15)' : 'none',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  position: 'relative',
                }}>
                  <span style={{
                    position: 'absolute', top: -11, right: 16,
                    background: '#10B981', color: '#fff', fontSize: '0.65rem', fontWeight: 900,
                    padding: '2px 8px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>
                    🔥 BEST VALUE • 1 MONTH FREE
                  </span>

                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      YEARLY
                    </span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A', marginTop: 2, marginBottom: 6 }}>
                      Pro Yearly
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 2 }}>
                      <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A' }}>₹4,999</span>
                      <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>/year</span>
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginLeft: 4 }}>($59.99)</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 800, marginBottom: 12 }}>
                      Equivalent ₹366/month · Save ₹399 (1 Month Free)
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid #E2E8F0', paddingTop: 12 }}>
                      {[
                        'Everything in Monthly Plan',
                        '365 Days Access',
                        'Priority 10x Sharp Engine',
                        'Unlimited Images (100+ batch)',
                        '500 MB Max upload size',
                        '100% Ad-Free Clean Workspace',
                        'Target KB Precision Search',
                        'All Passport & Exam Presets',
                      ].map((f) => (
                        <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Check size={13} color="#059669" strokeWidth={2.5} />
                          <span style={{ fontSize: '0.76rem', color: '#1E293B', fontWeight: 600 }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSubscribe('yearly')}
                    disabled={isProcessing && processingPlan === 'yearly'}
                    className="btn btn-emerald"
                    style={{ marginTop: 20, borderRadius: 10, width: '100%', fontWeight: 800, padding: '10px 0', background: '#10B981', color: '#fff' }}
                  >
                    {isProcessing && processingPlan === 'yearly' ? 'Opening...' : 'Subscribe Now'}
                  </button>
                </div>

              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}
