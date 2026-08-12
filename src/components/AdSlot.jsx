import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

  useEffect(() => {
    fetch(`${API_BASE}/ads`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const match = data.ads.find(ad => ad.position === type);
          setAdData(match || null);
        }
      })
      .catch(() => setAdData(null));
  }, [type]);

  const activeClient = adData?.ad_client || adClient;
  const activeSlot = adData?.ad_slot || adSlot;

  useEffect(() => {
    try {
      if (activeClient && activeSlot && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) { /* silent */ }
  }, [activeClient, activeSlot]);

  // ── Test / Dev mode: show visual dummy ──
  if (testMode || import.meta.env.DEV) {
    return <TestAdPlaceholder type={type} />;
  }

  // ── Real AdSense ad ──
  if (activeClient && activeSlot) {
    return (
      <div style={{ margin: '16px auto', textAlign: 'center', overflow: 'hidden' }}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
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
      style={{
        width: '100%',
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
      <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        ADVERTISEMENT
      </span>
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', lineHeight: 1.3 }}>
        {label}
      </span>
    </div>
  );
}

// import { useState, useEffect } from 'react';

// const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// export default function AdSlot({ type = 'leaderboard', adClient = null, adSlot = null }) {

//   // 1. Hooks first
//   const [adData, setAdData] = useState(null);

//   useEffect(() => {
//     fetch(`${API_BASE}/ads`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.success) {
//           const match = data.ads.find(ad => ad.position === type);
//           setAdData(match || null);
//         }
//       })
//       .catch(() => setAdData(null));
//   }, [type]);

//   // 2. Variables
//   const activeClient = adData?.ad_client || adClient;
//   const activeSlot = adData?.ad_slot || adSlot;

//   useEffect(() => {
//     try {
//       if (activeClient && activeSlot && window.adsbygoogle) {
//         (window.adsbygoogle = window.adsbygoogle || []).push({});
//       }
//     } catch (e) { }
//   }, [activeClient, activeSlot]);

//   const isLeaderboard = type === 'leaderboard';
//   const isRectangle = type === 'rectangle';
//   const isSkyscraper = type === 'skyscraper';
//   const w = isLeaderboard ? 728 : isRectangle ? 300 : isSkyscraper ? 160 : '100%';
//   const h = isLeaderboard ? 90 : isRectangle ? 250 : isSkyscraper ? 600 : 120;

//   // 3. Return
//   if (activeClient && activeSlot) {
//     return (
//       <div className="ad-container" style={{ margin: '16px auto', textAlign: 'center', overflow: 'hidden' }}>
//         <ins
//           className="adsbygoogle"
//           style={{ display: 'block' }}
//           data-ad-client={activeClient}
//           data-ad-slot={activeSlot}
//           data-ad-format="auto"
//           data-full-width-responsive="true"
//         />
//       </div>
//     );
//   }

//   return (
//     <div style={{
//       width: '100%', maxWidth: w, height: h,
//       margin: '0 auto', borderRadius: 12,
//       border: '1.5px dashed #CBD5E1', background: '#FAFBFD',
//       display: 'flex', flexDirection: 'column',
//       alignItems: 'center', justifyContent: 'center',
//       padding: 10, textAlign: 'center', gap: 4,
//       boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)',
//       flexShrink: 0, boxSizing: 'border-box',
//     }}>
//       <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
//         ADVERTISEMENT
//       </span>
//       <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', lineHeight: 1.3 }}>
//         {isLeaderboard && '728×90 Leaderboard'}
//         {isRectangle && '300×250 Rectangle'}
//         {isSkyscraper && '160×600 Skyscraper'}
//         {!isLeaderboard && !isRectangle && !isSkyscraper && 'Ad Banner'}
//       </span>
//     </div>
//   );
// }