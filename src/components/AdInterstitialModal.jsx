import React, { useState, useEffect, useCallback } from 'react';
import { X, Download, Crown, Clock, ShieldCheck } from 'lucide-react';

const AD_DURATION = 5; // seconds user must watch before download unlocks

/**
 * AdInterstitialModal
 *
 * Props:
 *  isOpen        — boolean
 *  onClose       — () => void  (called when user dismisses WITHOUT downloading)
 *  onAdComplete  — () => void  (called when countdown finishes AND user clicks download)
 *  onOpenPricing — () => void  (opens the pricing/upgrade modal)
 *  fileName      — string      (display name of the file being downloaded)
 */
export default function AdInterstitialModal({ isOpen, onClose, onAdComplete, onOpenPricing, fileName }) {
  const [secondsLeft, setSecondsLeft] = useState(AD_DURATION);
  const [adWatched, setAdWatched] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Reset state every time the modal opens
  useEffect(() => {
    if (isOpen) {
      setSecondsLeft(AD_DURATION);
      setAdWatched(false);
      setDownloading(false);
    }
  }, [isOpen]);

  // Countdown timer — only runs while modal is open and ad hasn't been watched yet
  useEffect(() => {
    if (!isOpen || adWatched) return;
    if (secondsLeft <= 0) {
      setAdWatched(true);
      return;
    }
    const timer = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [isOpen, secondsLeft, adWatched]);

  const handleDownload = useCallback(() => {
    if (!adWatched) return;
    setDownloading(true);
    // Short delay so the button state is visible, then fire the download callback
    setTimeout(() => {
      onAdComplete();
      onClose();
    }, 300);
  }, [adWatched, onAdComplete, onClose]);

  if (!isOpen) return null;

  const progress = ((AD_DURATION - secondsLeft) / AD_DURATION) * 100;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(10, 15, 30, 0.88)',
        backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        style={{
          background: '#FFFFFF', borderRadius: 24,
          maxWidth: 520, width: '100%',
          overflow: 'hidden', boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
          animation: 'modalScale 0.25s ease',
          display: 'flex', flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #0F172A, #1E293B)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Download size={16} color="#93C5FD" />
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: '0.9rem', color: '#F8FAFC' }}>
                Your download is almost ready
              </p>
              <p style={{
                fontSize: '0.7rem', color: '#94A3B8', fontWeight: 500,
                maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {fileName || 'processed image'}
              </p>
            </div>
          </div>

          {/* Only allow closing after ad is watched */}
          {adWatched && (
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
                width: 30, height: 30, cursor: 'pointer', color: '#94A3B8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* ── Progress bar ── */}
        <div style={{ height: 3, background: '#E2E8F0', position: 'relative' }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: adWatched
              ? 'linear-gradient(90deg, #059669, #10B981)'
              : 'linear-gradient(90deg, #3B82F6, #0EA5E9)',
            transition: 'width 1s linear, background 0.3s ease',
          }} />
        </div>

        {/* ── Ad Content Area ── */}
        <div style={{ padding: '24px 28px', background: '#FAFBFD' }}>

          {/* Countdown badge */}
          {!adWatched && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 8, marginBottom: 16,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#FEF3C7', border: '1px solid #FDE68A',
                borderRadius: 99, padding: '5px 14px',
              }}>
                <Clock size={13} color="#D97706" />
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#D97706' }}>
                  Download unlocks in {secondsLeft}s
                </span>
              </div>
            </div>
          )}

          {adWatched && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 8, marginBottom: 16,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#ECFDF5', border: '1px solid #A7F3D0',
                borderRadius: 99, padding: '5px 14px',
              }}>
                <ShieldCheck size={13} color="#059669" />
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#059669' }}>
                  ✓ Ad complete — download is ready!
                </span>
              </div>
            </div>
          )}

          {/* ── Simulated Ad Banner (replace with real AdSense ins tag) ── */}
          <div style={{
            width: '100%', minHeight: 200, borderRadius: 16,
            background: 'linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%)',
            border: '1.5px dashed #BFDBFE',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '24px 20px', textAlign: 'center', gap: 12,
            marginBottom: 20,
            position: 'relative',
          }}>
            <span style={{
              position: 'absolute', top: 10, right: 12,
              fontSize: '0.55rem', fontWeight: 800, color: '#94A3B8',
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>AD</span>

            {/* Replace everything inside this div with your real AdSense <ins> tag */}
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: 'linear-gradient(135deg, #3B82F6, #0EA5E9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(59,130,246,0.3)',
            }}>
              <Crown size={26} color="#fff" fill="#fff" />
            </div>
            <div>
              <p style={{ fontWeight: 900, fontSize: '1rem', color: '#0F172A', marginBottom: 4 }}>
                Upgrade to PicCraft PRO
              </p>
              <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.5, maxWidth: 300 }}>
                Skip ads forever, process 100+ images at once, and unlock 500 MB uploads.
                One-time payment — no subscriptions.
              </p>
            </div>
            <button
              onClick={() => { onClose(); onOpenPricing(); }}
              style={{
                padding: '9px 20px', borderRadius: 10,
                background: 'linear-gradient(135deg, #3B82F6, #0EA5E9)',
                color: '#fff', fontWeight: 800, fontSize: '0.82rem',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
              }}
            >
              View PRO Plans →
            </button>
            {/* ── End of ad content ── */}
          </div>
        </div>

        {/* ── Footer: Download Button ── */}
        <div style={{
          padding: '0 28px 24px',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <button
            onClick={handleDownload}
            disabled={!adWatched || downloading}
            style={{
              width: '100%', padding: '13px 20px', borderRadius: 14,
              background: adWatched
                ? 'linear-gradient(135deg, #059669, #10B981)'
                : '#E2E8F0',
              color: adWatched ? '#fff' : '#94A3B8',
              fontWeight: 900, fontSize: '0.95rem',
              border: 'none',
              cursor: adWatched ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: adWatched ? '0 6px 20px rgba(5,150,105,0.3)' : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            <Download size={18} />
            {downloading ? 'Starting Download…' : adWatched ? 'Download Now' : `Wait ${secondsLeft}s…`}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#94A3B8', fontWeight: 500 }}>
            <Crown size={11} style={{ display: 'inline', marginRight: 4, color: '#F59E0B' }} />
            <button
              onClick={() => { onClose(); onOpenPricing(); }}
              style={{
                background: 'none', border: 'none', color: '#3B82F6',
                fontWeight: 700, fontSize: '0.7rem', cursor: 'pointer', padding: 0,
              }}
            >
              Upgrade to PRO
            </button>
            {' '}to skip ads and download instantly
          </p>
        </div>
      </div>
    </div>
  );
}
