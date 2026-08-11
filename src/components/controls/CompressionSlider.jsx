import React from 'react';
import { Minimize2, Sliders, Target } from 'lucide-react';

const FORMAT_OPTS = ['jpg', 'webp', 'png'];
const SIZE_PRESETS = [50, 100, 200, 500, 1000];

export default function CompressionSlider({ mode, setMode, quality, setQuality, targetKB, setTargetKB, format, setFormat }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Section header + mode switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="section-title">
          <Minimize2 size={14} color="var(--primary-light)" />
          Compression
        </div>

        <div className="segment">
          <button className={`segment-btn${mode === 'quality' ? ' active' : ''}`} onClick={() => setMode('quality')}>
            <Sliders size={12} /> Quality
          </button>
          <button className={`segment-btn${mode === 'targetSize' ? ' active' : ''}`} onClick={() => setMode('targetSize')}>
            <Target size={12} /> Target KB
          </button>
        </div>
      </div>

      {/* Format selector */}
      <div>
        <p className="label" style={{ marginBottom: 8 }}>Output Format</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {FORMAT_OPTS.map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`option-card${format === f ? ' selected' : ''}`}
              style={{ textAlign: 'center', padding: '10px 8px' }}
            >
              <span style={{
                fontFamily: 'var(--font-head)', fontWeight: 800,
                textTransform: 'uppercase', fontSize: '0.9rem',
                color: format === f ? 'var(--primary-light)' : 'var(--text-2)',
              }}>{f}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quality mode */}
      {mode === 'quality' ? (
        <div style={{
          padding: 16,
          background: '#F1F5F9',
          border: '1px solid var(--border)',
          borderRadius: 12,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span className="label">Compression Quality</span>
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary-light)' }}>
              {Math.round(quality * 100)}%
            </span>
          </div>
          <input
            type="range" min="0.05" max="0.95" step="0.05"
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.7rem', color: 'var(--text-3)' }}>
            <span>Max compression</span>
            <span>Best quality</span>
          </div>
        </div>
      ) : (
        /* Target KB mode */
        <div style={{
          padding: 16,
          background: '#F1F5F9',
          border: '1px solid var(--border)',
          borderRadius: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="label">Target File Size</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input
                type="number"
                value={targetKB}
                onChange={(e) => setTargetKB(Math.max(1, parseInt(e.target.value) || 100))}
                style={{
                  width: 72,
                  padding: '5px 8px',
                  borderRadius: 8,
                  background: '#E2E8F0',
                  border: '1px solid var(--border)',
                  color: 'var(--primary-light)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-head)',
                  outline: 'none',
                  textAlign: 'right',
                }}
              />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-3)' }}>KB</span>
            </div>
          </div>

          {/* Preset buttons */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {SIZE_PRESETS.map((kb) => (
              <button
                key={kb}
                onClick={() => setTargetKB(kb)}
                className={`btn btn-ghost btn-sm${targetKB === kb ? '' : ''}`}
                style={{
                  borderRadius: 8, padding: '5px 11px',
                  background: targetKB === kb ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                  borderColor: targetKB === kb ? 'rgba(99,102,241,0.5)' : 'var(--border)',
                  color: targetKB === kb ? 'var(--primary-light)' : 'var(--text-3)',
                }}
              >
                {kb >= 1000 ? `${kb / 1000} MB` : `${kb} KB`}
              </button>
            ))}
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', lineHeight: 1.5, fontStyle: 'italic' }}>
            ⚡ Uses iterative binary search to automatically tune quality until output matches your target size.
          </p>
        </div>
      )}
    </div>
  );
}

