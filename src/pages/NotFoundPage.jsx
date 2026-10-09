import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Grid, RefreshCw, Minimize2, Maximize2, ShieldAlert } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';

export default function NotFoundPage() {
  return (
    <main className="main-content" style={{ flex: 1, maxWidth: 800, margin: '0 auto', width: '100%', padding: '60px 24px', textAlign: 'center' }}>
      <SEOHead title="404 - Page Not Found | PicCraft" description="The page you are looking for does not exist or has been moved." />

      <div style={{ display: 'inline-flex', padding: 20, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', color: '#EF4444', marginBottom: 24 }}>
        <ShieldAlert size={56} />
      </div>

      <h1 style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-1)', marginBottom: 12 }}>
        404 — Page Not Found
      </h1>

      <p style={{ fontSize: '1.05rem', color: 'var(--text-3)', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.6 }}>
        Oops! The tool or page you are looking for doesn't exist, was renamed, or has been moved.
      </p>

      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
        <Link to="/" className="btn btn-primary btn-md" style={{ borderRadius: 12 }}>
          <Home size={18} /> Go to Homepage
        </Link>
        <Link to="/converters" className="btn btn-ghost btn-md" style={{ borderRadius: 12, border: '1px solid var(--border)' }}>
          <Grid size={18} /> Browse All 70+ Tools
        </Link>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 28, textAlign: 'left' }}>
        <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-1)', marginBottom: 16 }}>
          Popular Image Tools
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          <Link to="/jpg-to-png" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start', borderRadius: 10 }}>
            <RefreshCw size={14} color="#3B82F6" /> JPG to PNG Converter
          </Link>
          <Link to="/heic-to-jpg" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start', borderRadius: 10 }}>
            <RefreshCw size={14} color="#10B981" /> HEIC to JPG Converter
          </Link>
          <Link to="/compress" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start', borderRadius: 10 }}>
            <Minimize2 size={14} color="#8B5CF6" /> Target KB Compressor
          </Link>
          <Link to="/resize" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start', borderRadius: 10 }}>
            <Maximize2 size={14} color="#F59E0B" /> Passport Photo Resizer
          </Link>
        </div>
      </div>
    </main>
  );
}
