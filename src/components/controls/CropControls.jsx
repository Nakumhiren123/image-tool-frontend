import React from 'react';
import { Crop } from 'lucide-react';

const RATIOS = [
  { label: 'Free',     ratio: null     },
  { label: '1:1',      ratio: 1        },
  { label: '16:9',     ratio: 16 / 9   },
  { label: '4:3',      ratio: 4 / 3    },
  { label: '9:16',     ratio: 9 / 16   },
  { label: '3:2',      ratio: 3 / 2    },
];

export default function CropControls({ cropRect, setCropRect, originalWidth, originalHeight }) {
  const applyRatio = (ratio) => {
    if (!originalWidth || !originalHeight) return;
    if (!ratio) {
      setCropRect({ x: 0, y: 0, width: originalWidth, height: originalHeight });
      return;
    }
    let w = originalWidth;
    let h = Math.round(w / ratio);
    if (h > originalHeight) { h = originalHeight; w = Math.round(h * ratio); }
    const x = Math.round((originalWidth - w) / 2);
    const y = Math.round((originalHeight - h) / 2);
    setCropRect({ x, y, width: w, height: h });
  };

  const inputStyle = {
    padding: '8px 12px',
    borderRadius: 8,
    background: '#FFFFFF',
    border: '1px solid #CBD5E1',
    color: '#0F172A',
    fontWeight: 700,
    fontSize: '0.9rem',
    outline: 'none',
    width: 100,
    textAlign: 'right',
    fontFamily: 'monospace',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Title */}
      <div className="section-title">
        <Crop size={15} color="#3B82F6" />
        Crop Options
      </div>

      {/* Aspect Ratio Presets */}
      <div>
        <p className="label" style={{ marginBottom: 8 }}>Aspect Ratio Presets</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {RATIOS.map((r) => (
            <button
              key={r.label}
              onClick={() => applyRatio(r.ratio)}
              className="btn btn-ghost btn-sm"
              style={{ justifyContent: 'center', borderRadius: 8, fontWeight: 700, fontSize: '0.78rem' }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Synchronized Dimension & Position Fields (iLoveIMG Style) */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: 16,
        background: '#F8FAFD',
        border: '1px solid #E2E8F0',
        borderRadius: 14,
      }}>
        {[
          { label: 'Width (px)',      key: 'width' },
          { label: 'Height (px)',     key: 'height' },
          { label: 'Position X (px)', key: 'x' },
          { label: 'Position Y (px)', key: 'y' },
        ].map(({ label, key }) => (
          <div key={key} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 8,
            borderBottom: '1px solid #F1F5F9',
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
              {label}
            </span>
            <input
              type="number"
              min="0"
              value={cropRect[key] ?? 0}
              onChange={(e) => setCropRect({ ...cropRect, [key]: parseInt(e.target.value) || 0 })}
              style={inputStyle}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
