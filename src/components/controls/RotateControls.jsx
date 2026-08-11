import React from 'react';
import { RotateCw, RotateCcw, FlipHorizontal2, FlipVertical2, RefreshCcw } from 'lucide-react';

export default function RotateControls({ rotation, setRotation, flipH, setFlipH, flipV, setFlipV }) {
  const reset = () => { setRotation(0); setFlipH(false); setFlipV(false); };

  const BIG_BTN = (props) => (
    <button {...props} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 8, padding: '14px 10px', borderRadius: 12,
      background: props['data-active'] ? 'rgba(99,102,241,0.16)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${props['data-active'] ? 'rgba(99,102,241,0.45)' : 'var(--border)'}`,
      color: props['data-active'] ? 'var(--primary-light)' : 'var(--text-2)',
      cursor: 'pointer', transition: 'all 0.2s ease', flex: 1,
      ...props.style,
    }} />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="section-title">
          <RotateCw size={14} color="var(--primary-light)" />
          Rotate & Flip
        </div>
        <button onClick={reset} className="btn btn-ghost btn-sm" style={{ gap: 5 }}>
          <RefreshCcw size={12} /> Reset
        </button>
      </div>

      {/* Current rotation indicator */}
      <div style={{
        padding: '10px 14px',
        background: 'rgba(99,102,241,0.08)',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span className="label">Current Rotation</span>
        <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-light)' }}>
          {rotation}°
        </span>
      </div>

      {/* Rotate buttons */}
      <div>
        <p className="label" style={{ marginBottom: 10 }}>Rotation Steps</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <BIG_BTN onClick={() => setRotation((r) => (r - 90 + 360) % 360)}>
            <RotateCcw size={20} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>−90°</span>
          </BIG_BTN>
          <BIG_BTN onClick={() => setRotation((r) => (r + 90) % 360)}>
            <RotateCw size={20} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>+90°</span>
          </BIG_BTN>
          <BIG_BTN onClick={() => setRotation((r) => (r + 180) % 360)}>
            <RotateCw size={20} style={{ transform: 'scaleY(-1)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>180°</span>
          </BIG_BTN>
        </div>
      </div>

      {/* Flip buttons */}
      <div>
        <p className="label" style={{ marginBottom: 10 }}>Flip Axis</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <BIG_BTN
            onClick={() => {
              if (flipH) {
                setFlipH(false);
              } else {
                setFlipH(true);
                setFlipV(false);
              }
            }}
            data-active={flipH || undefined}
          >
            <FlipHorizontal2 size={20} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Horizontal</span>
          </BIG_BTN>
          <BIG_BTN
            onClick={() => {
              if (flipV) {
                setFlipV(false);
              } else {
                setFlipV(true);
                setFlipH(false);
              }
            }}
            data-active={flipV || undefined}
          >
            <FlipVertical2 size={20} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Vertical</span>
          </BIG_BTN>
        </div>
      </div>
    </div>
  );
}

