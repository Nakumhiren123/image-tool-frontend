import React from 'react';
import { UserCheck, Calendar, Palette, Type } from 'lucide-react';

const FONT_FAMILIES = [
  { label: 'Sans-Serif', val: 'sans-serif' },
  { label: 'Serif',      val: 'serif'      },
  { label: 'Monospace',  val: 'monospace'  },
  { label: 'Impact',     val: 'Impact'     },
];

export default function NameDateControls({ nameDateConfig, setNameDateConfig }) {
  const {
    name, date, datePrefix, bannerBg, nameColor, dateColor, bannerRatio,
    fontFamily = 'sans-serif',
    fontWeight = 'bold',
    customFontSize = 0,
    textTransform = 'uppercase'
  } = nameDateConfig;

  const update = (patch) => setNameDateConfig((prev) => ({ ...prev, ...patch }));

  const setTodayDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    update({ date: `${dd}/${mm}/${yyyy}` });
  };

  const inputStyle = {
    width: '100%', padding: '9px 12px', borderRadius: 10,
    background: '#F8FAFD', border: '1px solid var(--border)',
    color: 'var(--text-1)', fontWeight: 600, fontSize: '0.875rem',
    outline: 'none', fontFamily: 'var(--font-body)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Section Title */}
      <div className="section-title">
        <UserCheck size={14} color="var(--primary-light)" />
        Name & Date Banner
      </div>

      {/* Candidate Name Input */}
      <div>
        <p className="label" style={{ marginBottom: 6 }}>Candidate Full Name</p>
        <input
          type="text"
          value={name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="e.g. JOHN DOE"
          style={inputStyle}
        />
      </div>

      {/* Date Input + Today Quick Button */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <p className="label">Date (DD/MM/YYYY)</p>
          <button
            onClick={setTodayDate}
            className="btn btn-ghost btn-sm"
            style={{ padding: '2px 8px', fontSize: '0.7rem', gap: 4 }}
          >
            <Calendar size={11} /> Use Today
          </button>
        </div>
        <input
          type="text"
          value={date}
          onChange={(e) => update({ date: e.target.value })}
          placeholder="e.g. 01/01/2026"
          style={inputStyle}
        />
      </div>

      {/* Date Type / Prefix Selector */}
      <div>
        <p className="label" style={{ marginBottom: 8 }}>Date Prefix Label</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {[
            { label: 'None', val: '' },
            { label: 'DOP:', val: 'DOP: ' },
            { label: 'DOB:', val: 'DOB: ' },
            { label: 'DATE:', val: 'DATE: ' },
          ].map((p) => (
            <button
              key={p.label}
              onClick={() => update({ datePrefix: p.val })}
              className={`segment-btn${datePrefix === p.val ? ' active' : ''}`}
              style={{ justifyContent: 'center', borderRadius: 8, padding: '6px 4px' }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Font Family / Style Selector */}
      <div>
        <p className="label" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
          <Type size={12} color="var(--primary-light)" />
          Font Style / Family
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {FONT_FAMILIES.map((f) => (
            <button
              key={f.label}
              onClick={() => update({ fontFamily: f.val })}
              className={`segment-btn${fontFamily === f.val ? ' active' : ''}`}
              style={{ justifyContent: 'center', borderRadius: 8, padding: '6px 4px', fontFamily: f.val, fontSize: '0.78rem' }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size & Weight Section */}
      <div style={{
        padding: 14,
        background: '#F1F5F9',
        border: '1px solid var(--border)',
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}>
        {/* Custom Font Size */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span className="label">Font Size</span>
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '0.9rem', color: 'var(--primary-light)' }}>
              {customFontSize === 0 ? 'Auto Fit' : `${customFontSize} px`}
            </span>
          </div>
          <input
            type="range" min="0" max="64" step="2"
            value={customFontSize}
            onChange={(e) => update({ customFontSize: parseInt(e.target.value) || 0 })}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: '0.7rem', color: 'var(--text-3)' }}>
            <span>Auto relative to banner</span>
            <span>64 px</span>
          </div>
        </div>

        {/* Font Weight & Text Case */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <p className="label" style={{ marginBottom: 6 }}>Font Weight</p>
            <div className="segment" style={{ width: '100%', padding: 2 }}>
              <button
                className={`segment-btn${fontWeight === 'bold' ? ' active' : ''}`}
                style={{ flex: 1, justifyContent: 'center', padding: '4px 0', fontSize: '0.75rem' }}
                onClick={() => update({ fontWeight: 'bold' })}
              >
                Bold
              </button>
              <button
                className={`segment-btn${fontWeight === 'normal' ? ' active' : ''}`}
                style={{ flex: 1, justifyContent: 'center', padding: '4px 0', fontSize: '0.75rem' }}
                onClick={() => update({ fontWeight: 'normal' })}
              >
                Normal
              </button>
            </div>
          </div>

          <div>
            <p className="label" style={{ marginBottom: 6 }}>Text Case</p>
            <div className="segment" style={{ width: '100%', padding: 2 }}>
              <button
                className={`segment-btn${textTransform === 'uppercase' ? ' active' : ''}`}
                style={{ flex: 1, justifyContent: 'center', padding: '4px 0', fontSize: '0.75rem' }}
                onClick={() => update({ textTransform: 'uppercase' })}
              >
                UPPER
              </button>
              <button
                className={`segment-btn${textTransform === 'none' ? ' active' : ''}`}
                style={{ flex: 1, justifyContent: 'center', padding: '4px 0', fontSize: '0.75rem' }}
                onClick={() => update({ textTransform: 'none' })}
              >
                As Typed
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Colors Section */}
      <div style={{
        padding: 14,
        background: '#F1F5F9',
        border: '1px solid var(--border)',
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        <p className="label" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Palette size={12} color="var(--primary-light)" />
          Banner Colors
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {/* Name Color */}
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: 4, fontWeight: 600 }}>Name Color</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="color"
                value={nameColor}
                onChange={(e) => update({ nameColor: e.target.value })}
                style={{ width: 34, height: 34, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent' }}
              />
              <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-2)', textTransform: 'uppercase' }}>
                {nameColor}
              </span>
            </div>
          </div>

          {/* Date Color */}
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: 4, fontWeight: 600 }}>Date Color</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="color"
                value={dateColor}
                onChange={(e) => update({ dateColor: e.target.value })}
                style={{ width: 34, height: 34, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent' }}
              />
              <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-2)', textTransform: 'uppercase' }}>
                {dateColor}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Height Ratio Slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span className="label">Banner Height</span>
          <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary-light)' }}>
            {Math.round(bannerRatio * 100)}%
          </span>
        </div>
        <input
          type="range" min="0.1" max="0.35" step="0.02"
          value={bannerRatio}
          onChange={(e) => update({ bannerRatio: parseFloat(e.target.value) })}
        />
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontStyle: 'italic', lineHeight: 1.4 }}>
        🪪 Automatically adds a bottom banner formatted for passport & official exam registration photos.
      </p>
    </div>
  );
}

