import React, { useRef } from 'react';
import { Type, ImageIcon, Upload, Grid } from 'lucide-react';

const POSITIONS = [
  'top-left','top-center','top-right',
  'center-left','center','center-right',
  'bottom-left','bottom-center','bottom-right',
];

const POS_LABELS = {
  'top-left':'TL','top-center':'TC','top-right':'TR',
  'center-left':'ML','center':'C','center-right':'MR',
  'bottom-left':'BL','bottom-center':'BC','bottom-right':'BR',
};

export default function WatermarkControls({ watermarkConfig, setWatermarkConfig }) {
  const logoRef = useRef(null);
  const { type, text, opacity, fontSize, color, position, watermarkFile } = watermarkConfig;
  const update = (patch) => setWatermarkConfig((prev) => ({ ...prev, ...patch }));

  const inputStyle = {
    width: '100%', padding: '9px 12px', borderRadius: 10,
    background: '#F8FAFD', border: '1px solid var(--border)',
    color: 'var(--text-1)', fontWeight: 600, fontSize: '0.875rem',
    outline: 'none', fontFamily: 'var(--font-body)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header + type toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="section-title">
          <Type size={14} color="var(--primary-light)" />
          Watermark
        </div>
        <div className="segment">
          <button className={`segment-btn${type === 'text'  ? ' active' : ''}`} onClick={() => update({ type: 'text' })}>
            <Type size={12} /> Text
          </button>
          <button className={`segment-btn${type === 'image' ? ' active' : ''}`} onClick={() => update({ type: 'image' })}>
            <ImageIcon size={12} /> Logo
          </button>
        </div>
      </div>

      {/* Text or Logo */}
      {type === 'text' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <p className="label" style={{ marginBottom: 6 }}>Watermark Text</p>
            <input
              type="text"
              value={text}
              onChange={(e) => update({ text: e.target.value })}
              placeholder="© Your Brand"
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <p className="label" style={{ marginBottom: 6 }}>Font Size — {fontSize}px</p>
              <input
                type="range" min={10} max={120} value={fontSize}
                onChange={(e) => update({ fontSize: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <p className="label" style={{ marginBottom: 6 }}>Text Color</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => update({ color: e.target.value })}
                  style={{ width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent' }}
                />
                <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-2)', textTransform: 'uppercase' }}>
                  {color}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p className="label" style={{ marginBottom: 8 }}>Logo Image File</p>
          <input ref={logoRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={(e) => e.target.files?.[0] && update({ watermarkFile: e.target.files[0] })}
          />
          <button
            onClick={() => logoRef.current?.click()}
            className="btn btn-ghost btn-md"
            style={{ width: '100%', borderStyle: 'dashed', justifyContent: 'center', gap: 8, borderRadius: 12, padding: '14px 16px' }}
          >
            <Upload size={15} color="var(--primary-light)" />
            {watermarkFile ? watermarkFile.name : 'Select Logo / PNG Image'}
          </button>
        </div>
      )}

      {/* Opacity */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span className="label">Opacity</span>
          <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary-light)' }}>
            {Math.round(opacity * 100)}%
          </span>
        </div>
        <input
          type="range" min="0.05" max="1.0" step="0.05"
          value={opacity}
          onChange={(e) => update({ opacity: parseFloat(e.target.value) })}
        />
      </div>

      {/* Position grid */}
      <div>
        <div className="section-title" style={{ marginBottom: 10 }}>
          <Grid size={13} color="var(--primary-light)" />
          Placement
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5,
          maxWidth: 180, margin: '0 auto',
          padding: 8, background: '#F8FAFD',
          border: '1px solid var(--border)', borderRadius: 12,
        }}>
          {POSITIONS.map((pos) => {
            const isActive = position === pos;
            return (
              <button
                key={pos}
                onClick={() => update({ position: pos })}
                title={pos}
                style={{
                  height: 36, borderRadius: 7, fontSize: '0.68rem', fontWeight: 800,
                  background: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isActive ? 'var(--primary)' : 'transparent'}`,
                  color: isActive ? '#fff' : 'var(--text-3)',
                  cursor: 'pointer', transition: 'all 0.15s ease',
                }}
              >
                {POS_LABELS[pos]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

