import React from 'react';
import { Palette, Check } from 'lucide-react';

const FILTERS = [
  { id: 'normal', label: 'Full Color', icon: '🎨', desc: 'Original Colors' },
  { id: 'grayscale', label: 'Black & White', icon: '🌗', desc: 'Classic B&W' },
  { id: 'sepia', label: 'Sepia Vintage', icon: '📜', desc: 'Warm Antique' },
  { id: 'invert', label: 'Invert Colors', icon: '🔄', desc: 'Negative FX' },
  { id: 'warm', label: 'Warm Sunset', icon: '🌅', desc: 'Golden Glow' },
  { id: 'cool', label: 'Cool Cyan', icon: '❄️', desc: 'Ocean Breeze' },
  { id: 'contrast', label: 'High Contrast', icon: '⚡', desc: 'Dramatic Punch' },
  { id: 'neon', label: 'Cyber Neon', icon: '👾', desc: 'Vibrant Pop' },
];

export default function FilterControls({ filterMode = 'normal', setFilterMode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="section-title">
        <Palette size={14} color="var(--primary-light)" />
        Photo Filters & Color Effects
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {FILTERS.map((f) => {
          const isSelected = filterMode === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterMode && setFilterMode(f.id)}
              className={`option-card${isSelected ? ' selected' : ''}`}
              style={{
                padding: '12px 14px',
                borderRadius: 12,
                border: isSelected ? '2px solid #3B82F6' : '1px solid #E2E8F0',
                background: isSelected ? '#EFF6FF' : '#F8FAFC',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                textAlign: 'left',
                position: 'relative',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: '1.4rem' }}>{f.icon}</span>
              <div>
                <p style={{
                  fontFamily: 'var(--font-head)',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  color: isSelected ? '#1D4ED8' : '#0F172A',
                  margin: 0,
                }}>{f.label}</p>
                <p style={{ fontSize: '0.7rem', color: '#64748B', margin: '2px 0 0 0' }}>
                  {f.desc}
                </p>
              </div>
              {isSelected && (
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 18, height: 18, borderRadius: '50%',
                  background: '#3B82F6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Check size={10} color="#fff" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
