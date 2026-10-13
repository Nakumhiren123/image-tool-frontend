import { useState, useEffect, useRef } from 'react';

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000/api' : '');


// Module-level cache — shared across all AdSlot instances
const _adsCache = { data: null, ts: 0 };
const ADS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchAdsWithCache(apiBase) {
  if (_adsCache.data && (Date.now() - _adsCache.ts) < ADS_CACHE_TTL) {
    return _adsCache.data;
  }
  const res = await fetch(`${apiBase}/ads`);
  const json = await res.json();
  if (json.success) {
    _adsCache.data = json.ads;
    _adsCache.ts = Date.now();
  }
  return json.success ? json.ads : [];
}

const AD_SIZES = {
  leaderboard: { w: 728, h: 90, label: '728×90 Leaderboard' },
  rectangle: { w: 300, h: 250, label: '300×250 Rectangle' },
  skyscraper: { w: 160, h: 600, label: '160×600 Skyscraper' },
  interstitial: { w: '100%', h: 120, label: 'Interstitial Banner' },
};

function TestAdPlaceholder({ type }) {
  const { w, h, label } = AD_SIZES[type] || AD_SIZES.interstitial;

  return (
    <div
      style={{
        width: w,
        height: h,
        maxWidth: '100%',
        margin: '12px auto',
        borderRadius: 10,
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #e0e7ff 100%)',
        border: '2px dashed #93c5fd',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        flexShrink: 0,
      }}
    >
      {/* subtle animated shimmer strip */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: '-60%',
          width: '40%', height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)',
          animation: 'adShimmer 2.4s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      <style>{`
        @keyframes adShimmer {
          0%   { left: -60%; }
          100% { left: 120%; }
        }
      `}</style>

      {/* DEV badge */}
      <span
        style={{
          position: 'absolute',
          top: 6, right: 8,
          fontSize: '0.55rem',
          fontWeight: 800,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          background: '#3b82f6',
          color: '#fff',
          borderRadius: 4,
          padding: '1px 5px',
        }}
      >
        DEV
      </span>

      {/* Ad icon */}
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>

      <span
        style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          color: '#2563eb',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        Test Ad — {type}
      </span>

      <span
        style={{
          fontSize: '0.63rem',
          color: '#6b7280',
          fontWeight: 500,
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function AdSlot({ type = 'leaderboard', adClient = null, adSlot = null, testMode = false }) {
  const [adData, setAdData] = useState(null);
  const adRef = useRef(null);

  useEffect(() => {
    fetchAdsWithCache(API_BASE)
      .then(ads => {
        const match = ads.find(ad => ad.position === type);
        setAdData(match || null);
      })
      .catch(() => setAdData(null));
  }, [type]);

  const activeClient = adData?.ad_client || adClient;
  const activeSlot = adData?.ad_slot || adSlot;

  useEffect(() => {
    if (!activeClient || !activeSlot) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Only push ad when element is visible in viewport
            try {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
              console.error('Ad error:', e);
            }
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => observer.disconnect();
  }, [activeClient, activeSlot, adData]);

  // ── Test / Dev mode: show visual dummy ──
  if (testMode || import.meta.env.DEV) {
    return <TestAdPlaceholder type={type} />;
  }

  const isRectangle = type === 'rectangle';
  const isSkyscraper = type === 'skyscraper';
  const containerMinHeight = isRectangle ? '250px' : isSkyscraper ? '600px' : '90px';
  const containerWidth = isRectangle ? '300px' : isSkyscraper ? '160px' : '100%';
  const containerClass = isRectangle ? 'ad-slot-rectangle' : 'ad-slot-leaderboard';

  // ── Real AdSense ad ──
  if (activeClient && activeSlot) {
    return (
      <div
        ref={adRef}
        className={containerClass}
        style={{
          minHeight: containerMinHeight,
          width: containerWidth,
          margin: '16px auto',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            minHeight: containerMinHeight,
            width: containerWidth,
          }}
          data-ad-client={activeClient}
          data-ad-slot={activeSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // ── Fallback placeholder (no ad configured) ──
  const { w, h, label } = AD_SIZES[type] || AD_SIZES.interstitial;
  return (
    <div
      className={containerClass}
      style={{
        minHeight: containerMinHeight,
        width: containerWidth,
        maxWidth: w,
        height: h,
        margin: '0 auto',
        borderRadius: 12,
        border: '1.5px dashed #CBD5E1',
        background: '#FAFBFD',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        textAlign: 'center',
        gap: 4,
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)',
        flexShrink: 0,
        boxSizing: 'border-box',
      }}
    >
      <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'rgb(71, 85, 105)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        ADVERTISEMENT
      </span>
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', lineHeight: 1.3 }}>
        {label}
      </span>
    </div>
  );
}
