import React from 'react';
import { Grid, Columns3, Rows3, LayoutGrid } from 'lucide-react';

const LAYOUTS = [
  { id: 'horizontal', label: 'Side by Side',  icon: Columns3 },
  { id: 'vertical',   label: 'Stacked',        icon: Rows3 },
  { id: 'grid',       label: 'Grid Collage',   icon: LayoutGrid },
];

export default function MergeControls({ direction, setDirection, padding, setPadding, bgColor, setBgColor }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="section-title">
        <Grid size={14} color="var(--primary-light)" />
        Merge Settings
      </div>

      {/* Layout selector */}
      <div>
        <p className="label" style={{ marginBottom: 10 }}>Layout Style</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {LAYOUTS.map(({ id, label, icon: Icon }) => {
            const isSelected = direction === id;
            return (
              <button
                key={id}
                onClick={() => setDirection(id)}
                className={`option-card${isSelected ? ' selected' : ''}`}
                style={{ textAlign: 'center', padding: '14px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
              >
                <Icon size={18} color={isSelected ? 'var(--primary-light)' : 'var(--text-3)'} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isSelected ? 'var(--text-1)' : 'var(--text-3)' }}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Padding */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span className="label">Image Spacing</span>
          <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, color: 'var(--primary-light)', fontSize: '0.95rem' }}>
            {padding}px
          </span>
        </div>
        <input
          type="range" min={0} max={60} value={padding}
          onChange={(e) => setPadding(parseInt(e.target.value))}
        />
      </div>

      {/* Background color */}
      <div>
        <p className="label" style={{ marginBottom: 10 }}>Canvas Background</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            style={{ width: 44, height: 44, borderRadius: 10, border: 'none', cursor: 'pointer', background: 'transparent' }}
          />
          <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-2)', textTransform: 'uppercase' }}>
            {bgColor}
          </span>

          {/* Quick presets */}
          {['#0f172a', '#ffffff', '#000000', '#1a1a2e'].map((c) => (
            <button
              key={c}
              onClick={() => setBgColor(c)}
              style={{
                width: 24, height: 24, borderRadius: 6, background: c,
                border: bgColor === c ? '2px solid var(--primary)' : '2px solid var(--border)',
                cursor: 'pointer', transition: 'border-color 0.15s ease',
              }}
              title={c}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

