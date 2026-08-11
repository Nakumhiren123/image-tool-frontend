import React, { useEffect } from 'react';

/**
 * Reusable AdSlot Component for Google AdSense & Third-Party Ad Networks
 * @param {string} type - 'leaderboard' (728x90), 'rectangle' (300x250), 'skyscraper' (160x600)
 * @param {string} adClient - Optional Google AdSense Client ID (e.g. "ca-pub-123456789")
 * @param {string} adSlot - Optional Google AdSense Slot ID (e.g. "9876543210")
 */
export default function AdSlot({ type = 'leaderboard', adClient = null, adSlot = null }) {
  useEffect(() => {
    try {
      if (adClient && adSlot && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // AdSense script error handling
    }
  }, [adClient, adSlot]);

  // If live AdSense Client & Slot IDs are provided, render real Google AdSense ins tag
  if (adClient && adSlot) {
    return (
      <div className="ad-container" style={{ margin: '16px auto', textAlign: 'center', overflow: 'hidden' }}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Placeholder Mode for development & visual layout verification
  const isLeaderboard = type === 'leaderboard';
  const isRectangle = type === 'rectangle';
  const isSkyscraper = type === 'skyscraper';

  const w = isLeaderboard ? 728 : isRectangle ? 300 : isSkyscraper ? 160 : '100%';
  const h = isLeaderboard ? 90 : isRectangle ? 250 : isSkyscraper ? 600 : 120;

  return (
    <div style={{
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
    }}>
      <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        ADVERTISEMENT
      </span>
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', lineHeight: 1.3 }}>
        {isLeaderboard && '728×90 Leaderboard'}
        {isRectangle && '300×250 Rectangle'}
        {isSkyscraper && '160×600 Skyscraper'}
        {!isLeaderboard && !isRectangle && !isSkyscraper && 'Ad Banner'}
      </span>
    </div>
  );
}
