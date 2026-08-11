import React from 'react';
import { Maximize2, Lock, Unlock, Sliders, Target } from 'lucide-react';

const PRESETS = [
  { label: 'Full HD',         w: 1920, h: 1080 },
  { label: '4K',              w: 3840, h: 2160 },
  { label: 'HD 720p',         w: 1280, h: 720  },
  { label: 'Instagram 1:1',   w: 1080, h: 1080 },
  { label: 'Story 9:16',      w: 1080, h: 1920 },
];

const SIZE_PRESETS = [
  { value: 50,  unit: 'KB' },
  { value: 100, unit: 'KB' },
  { value: 200, unit: 'KB' },
  { value: 500, unit: 'KB' },
  { value: 1,   unit: 'MB' },
  { value: 2,   unit: 'MB' },
  { value: 5,   unit: 'MB' },
];

export default function ResizeControls({
  width, setWidth,
  height, setHeight,
  maintainAspect, setMaintainAspect,
  originalWidth, originalHeight,
  resizeMode = 'dimensions', setResizeMode,
  targetFileSize = 100, setTargetFileSize,
  targetFileUnit = 'KB', setTargetFileUnit
}) {

  const handleW = (val) => {
    const w = Math.max(1, parseInt(val) || 0);
    setWidth(w);
    if (maintainAspect && originalWidth && originalHeight)
      setHeight(Math.round((w / originalWidth) * originalHeight));
  };

  const handleH = (val) => {
    const h = Math.max(1, parseInt(val) || 0);
    setHeight(h);
    if (maintainAspect && originalWidth && originalHeight)
      setWidth(Math.round((h / originalHeight) * originalWidth));
  };

  const scale = (pct) => {
    if (!originalWidth || !originalHeight) return;
    setWidth(Math.round(originalWidth * pct / 100));
    setHeight(Math.round(originalHeight * pct / 100));
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: 10,
    background: '#F8FAFD', border: '1px solid var(--border)',
    color: 'var(--text-1)', fontWeight: 700, fontSize: '0.9rem',
    outline: 'none', fontFamily: 'var(--font-body)',
    transition: 'border-color 0.2s ease',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header + Mode Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div className="section-title">
          <Maximize2 size={14} color="var(--primary-light)" />
          Resize Options
        </div>

        <div className="segment">
          <button
            className={`segment-btn${resizeMode === 'dimensions' ? ' active' : ''}`}
            onClick={() => setResizeMode && setResizeMode('dimensions')}
          >
            <Sliders size={12} /> By Pixels
          </button>
          <button
            className={`segment-btn${resizeMode === 'targetSize' ? ' active' : ''}`}
            onClick={() => setResizeMode && setResizeMode('targetSize')}
          >
            <Target size={12} /> By File Size
          </button>
        </div>
      </div>

      {resizeMode === 'targetSize' ? (
        /* ── Target File Size Mode (KB / MB) ── */
        <div style={{
          padding: 16,
          background: '#F1F5F9',
          border: '1px solid var(--border)',
          borderRadius: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <span className="label">Desired Max File Size</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input
                type="number"
                step={targetFileUnit === 'MB' ? '0.1' : '1'}
                min="1"
                value={targetFileSize}
                onChange={(e) => setTargetFileSize && setTargetFileSize(parseFloat(e.target.value) || 1)}
                style={{
                  width: 90,
                  padding: '6px 10px',
                  borderRadius: 8,
                  background: '#E2E8F0',
                  border: '1px solid var(--border)',
                  color: 'var(--primary-light)',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-head)',
                  outline: 'none',
                  textAlign: 'right',
                }}
              />
              <div className="segment" style={{ padding: 2 }}>
                <button
                  className={`segment-btn${targetFileUnit === 'KB' ? ' active' : ''}`}
                  style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                  onClick={() => setTargetFileUnit && setTargetFileUnit('KB')}
                >
                  KB
                </button>
                <button
                  className={`segment-btn${targetFileUnit === 'MB' ? ' active' : ''}`}
                  style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                  onClick={() => setTargetFileUnit && setTargetFileUnit('MB')}
                >
                  MB
                </button>
              </div>
            </div>
          </div>

          {/* Preset Buttons */}
          <div>
            <p className="label" style={{ marginBottom: 8 }}>Quick Size Presets</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {SIZE_PRESETS.map((p) => {
                const isSelected = targetFileSize === p.value && targetFileUnit === p.unit;
                return (
                  <button
                    key={`${p.value}-${p.unit}`}
                    onClick={() => {
                      setTargetFileSize && setTargetFileSize(p.value);
                      setTargetFileUnit && setTargetFileUnit(p.unit);
                    }}
                    className="btn btn-ghost btn-sm"
                    style={{
                      borderRadius: 8,
                      padding: '5px 11px',
                      background: isSelected ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                      borderColor: isSelected ? 'rgba(99,102,241,0.5)' : 'var(--border)',
                      color: isSelected ? 'var(--primary-light)' : 'var(--text-3)',
                      fontWeight: 700,
                    }}
                  >
                    {p.value} {p.unit}
                  </button>
                );
              })}
            </div>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', lineHeight: 1.5, fontStyle: 'italic' }}>
            ⚡ Automatically resizes & compresses the image file size to fit cleanly under your specified limit ({targetFileSize} {targetFileUnit}).
          </p>
        </div>
      ) : (
        /* ── Pixel Dimensions Mode ── */
        <>
          {/* Dimension Inputs */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <p className="label" style={{ marginBottom: 6 }}>Width (px)</p>
              <input
                type="number"
                value={width || ''}
                onChange={(e) => handleW(e.target.value)}
                placeholder="Width"
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* Lock button */}
            <button
              onClick={() => setMaintainAspect(!maintainAspect)}
              style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0, marginBottom: 2,
                background: maintainAspect ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${maintainAspect ? 'rgba(99,102,241,0.45)' : 'var(--border)'}`,
                color: maintainAspect ? 'var(--primary-light)' : 'var(--text-3)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              title={maintainAspect ? 'Locked (click to unlock)' : 'Unlocked (click to lock)'}
            >
              {maintainAspect ? <Lock size={15} /> : <Unlock size={15} />}
            </button>

            <div style={{ flex: 1 }}>
              <p className="label" style={{ marginBottom: 6 }}>Height (px)</p>
              <input
                type="number"
                value={height || ''}
                onChange={(e) => handleH(e.target.value)}
                placeholder="Height"
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>

          {/* Scale shortcuts */}
          <div>
            <p className="label" style={{ marginBottom: 8 }}>Scale by Percentage</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {[25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  onClick={() => scale(pct)}
                  className="btn btn-ghost btn-sm"
                  style={{ borderRadius: 9, justifyContent: 'center', fontWeight: 800 }}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Presets */}
          <div>
            <p className="label" style={{ marginBottom: 8 }}>Common Presets</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => { setWidth(p.w); setHeight(p.h); }}
                  className="btn btn-ghost btn-sm"
                  style={{ borderRadius: 9, fontSize: '0.75rem' }}
                >
                  {p.label}
                  <span style={{ color: 'var(--text-3)', marginLeft: 4 }}>
                    {p.w}×{p.h}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  );
}

