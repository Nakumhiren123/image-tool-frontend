// src/pages/ConvertersHubPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search, Zap, Shield, Globe } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import AdSlot from '../components/AdSlot';
import { getConvertersGrouped, FORMAT_COLORS } from '../config/converters';

const GROUPED = getConvertersGrouped();

// ── Format group order (most popular first) ──
const FORMAT_ORDER = ['JPG', 'PNG', 'JPEG', 'WEBP', 'AVIF', 'GIF', 'BMP', 'HEIC', 'HEIF'];

// ── Feature highlights ──
const FEATURES = [
    { icon: Zap, label: 'Lightning Fast', desc: '100% browser-based, no upload to server' },
    { icon: Shield, label: 'Private & Secure', desc: 'Your files never leave your device' },
    { icon: Globe, label: 'All Formats', desc: '46+ conversion pairs supported' },
];

export default function ConvertersHubPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    // Filter converters by search query
    const filteredGroups = FORMAT_ORDER.reduce((acc, groupKey) => {
        const converters = (GROUPED[groupKey] || []).filter(c => {
            if (!search.trim()) return true;
            const q = search.toLowerCase();
            return (
                c.label.toLowerCase().includes(q) ||
                c.from.toLowerCase().includes(q) ||
                c.to.toLowerCase().includes(q) ||
                c.slug.toLowerCase().includes(q)
            );
        });
        if (converters.length > 0) acc[groupKey] = converters;
        return acc;
    }, {});

    const totalResults = Object.values(filteredGroups).flat().length;

    return (
        <main className="main-content" style={{ flex: 1, maxWidth: 1280, margin: '0 auto', width: '100%', padding: '40px 24px' }}>
            <SEOHead activeTab="convert" />

            {/* ── Page Title ── */}
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <h1 style={{
                    fontFamily: 'var(--font-head)', fontWeight: 900,
                    fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                    letterSpacing: '-0.03em', color: 'var(--text-1)', marginBottom: 14,
                }}>
                    <span className="grad-text">Image Format Converters</span>
                </h1>
                <p style={{ fontSize: '1rem', color: 'var(--text-3)', maxWidth: 560, margin: '0 auto 32px' }}>
                    Free online converters for every image format — JPG, PNG, WEBP, AVIF, GIF, BMP, HEIC and more.
                    No signup, no upload limit on Pro, 100% browser-based.
                </p>

                {/* ── Feature badges ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
                    {FEATURES.map(({ icon: Icon, label, desc }) => (
                        <div key={label} style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '8px 16px', borderRadius: 99,
                            background: 'var(--bg-card)', border: '1px solid var(--border)',
                            fontSize: '0.82rem', color: 'var(--text-2)', fontWeight: 600,
                        }}>
                            <Icon size={13} color="var(--primary-light)" />
                            {label}
                        </div>
                    ))}
                </div>

                {/* ── Search bar ── */}
                <div style={{ position: 'relative', maxWidth: 420, margin: '0 auto' }}>
                    <Search size={16} color="var(--text-3)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search converters… e.g. jpg to png"
                        style={{
                            width: '100%', padding: '12px 16px 12px 42px',
                            borderRadius: 14, border: '1.5px solid var(--border)',
                            background: 'var(--bg-card)', color: 'var(--text-1)',
                            fontSize: '0.9rem', fontWeight: 600, outline: 'none',
                            fontFamily: 'var(--font-body)', boxSizing: 'border-box',
                        }}
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontWeight: 700, fontSize: '1rem' }}
                        >✕</button>
                    )}
                </div>

                {/* Search result count */}
                {search && (
                    <p style={{ marginTop: 10, fontSize: '0.82rem', color: 'var(--text-3)', fontWeight: 600 }}>
                        {totalResults} converter{totalResults !== 1 ? 's' : ''} found for "{search}"
                    </p>
                )}
            </div>

            {/* ── No results ── */}
            {totalResults === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)' }}>
                    <Search size={36} style={{ margin: '0 auto 12px', opacity: 0.2 }} />
                    <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>No converters found for "{search}"</p>
                    <button onClick={() => setSearch('')} style={{ marginTop: 10, background: 'transparent', border: 'none', color: 'var(--primary-light)', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
                        Clear search
                    </button>
                </div>
            )}

            {/* ── Converter groups ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
                {Object.entries(filteredGroups).map(([groupKey, converters]) => {
                    const colors = FORMAT_COLORS[groupKey.toLowerCase()] || { bg: '#EDE9FE', color: '#7C3AED' };

                    return (
                        <div key={groupKey}>

                            {/* Group header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 12,
                                    background: colors.color,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <span style={{ color: '#fff', fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: '0.8rem' }}>
                                        {groupKey}
                                    </span>
                                </div>
                                <div>
                                    <h2 style={{ margin: 0, fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-1)' }}>
                                        {groupKey} Converters
                                    </h2>
                                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-3)', fontWeight: 500 }}>
                                        {converters.length} format{converters.length !== 1 ? 's' : ''} available
                                    </p>
                                </div>
                                <div style={{ flex: 1, height: 1, background: 'var(--border)', marginLeft: 8 }} />
                            </div>

                            {/* Converter cards grid */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                gap: 12,
                            }}>
                                {converters.map((converter) => {
                                    const toColors = FORMAT_COLORS[converter.to] || { bg: '#EDE9FE', color: '#7C3AED' };
                                    return (
                                        <button
                                            key={converter.slug}
                                            onClick={() => navigate(`/${converter.slug}`)}
                                            style={{
                                                display: 'flex', flexDirection: 'column', gap: 10,
                                                padding: '16px', borderRadius: 16, textAlign: 'left',
                                                background: 'var(--bg-card)', border: '1px solid var(--border)',
                                                cursor: 'pointer', transition: 'all 0.15s ease',
                                                backdropFilter: 'blur(12px)',
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.borderColor = colors.color;
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = `0 8px 24px ${colors.color}22`;
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.borderColor = 'var(--border)';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            {/* FROM → TO badges */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                {/* FROM badge */}
                                                <span style={{
                                                    padding: '3px 10px', borderRadius: 6,
                                                    background: colors.bg, color: colors.color,
                                                    fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '0.78rem',
                                                }}>
                                                    {converter.from.toUpperCase()}
                                                </span>

                                                <ArrowRight size={13} color="var(--text-3)" />

                                                {/* TO badge */}
                                                <span style={{
                                                    padding: '3px 10px', borderRadius: 6,
                                                    background: toColors.bg, color: toColors.color,
                                                    fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '0.78rem',
                                                }}>
                                                    {converter.to.toUpperCase()}
                                                </span>
                                            </div>

                                            {/* Label */}
                                            <p style={{
                                                margin: 0, fontFamily: 'var(--font-head)',
                                                fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-1)',
                                            }}>
                                                {converter.label}
                                            </p>

                                            {/* Description */}
                                            <p style={{
                                                margin: 0, fontSize: '0.72rem',
                                                color: 'var(--text-3)', lineHeight: 1.4,
                                            }}>
                                                {converter.description}
                                            </p>

                                            {/* CTA */}
                                            <div style={{
                                                display: 'flex', alignItems: 'center', gap: 4,
                                                marginTop: 4, color: colors.color,
                                                fontSize: '0.75rem', fontWeight: 700,
                                            }}>
                                                Convert now <ArrowRight size={11} />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Bottom Ad ── */}
            <div style={{ marginTop: 60 }}>
                <AdSlot type="leaderboard" />
            </div>
        </main>
    );
}