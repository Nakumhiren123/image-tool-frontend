import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Image, Shield, FileText, Code2, Mail } from 'lucide-react';

const TOOL_LINKS = [
  { label: 'Compress Image', to: '/compress' },
  { label: 'Convert Image', to: '/convert' },
  { label: 'Resize / Passport', to: '/resize' },
  { label: 'Crop Image', to: '/crop' },
  { label: 'Rotate & Flip', to: '/rotate' },
  { label: 'Add Watermark', to: '/watermark' },
  { label: 'Photo Filters', to: '/filter' },
  { label: 'Merge Images', to: '/merge' },
];

const CONVERT_LINKS = [
  { label: 'JPG to PNG', to: '/jpg-to-png' },
  { label: 'PNG to WEBP', to: '/png-to-webp' },
  { label: 'HEIC to JPG', to: '/heic-to-jpg' },
  { label: 'JPG to WEBP', to: '/jpg-to-webp' },
  { label: 'PNG to JPG', to: '/png-to-jpg' },
  { label: 'JPG to PDF', to: '/jpg-to-pdf' },
  { label: 'All Converters', to: '/converters' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy', icon: <Shield size={13} /> },
  { label: 'Terms of Service', to: '/terms', icon: <FileText size={13} /> },
  // { label: 'API Docs', to: '/api-docs', icon: <Code2 size={13} /> },
];

export default function Footer() {
  return (
    <footer style={{
      marginTop: 'auto',
      borderTop: '1px solid #E2E8F0',
      background: '#FFFFFF',
    }}>

      {/* ── Main Footer Grid ──────────────────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px 32px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 36,
        }}>

          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #3B82F6, #0EA5E9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
              }}>
                <Image size={18} color="#fff" />
              </div>
              <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#0F172A' }}>PicCraft</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.65, marginBottom: 20 }}>
              Free online image tools — convert, compress, resize, crop, and more. Fast, private, no sign-up needed.
            </p>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 5 }}>
              Made with <Heart size={12} fill="#F43F5E" color="#F43F5E" /> for creators worldwide
            </p>
          </div>

          {/* Tools column */}
          <div>
            <p style={{ fontWeight: 800, fontSize: '0.78rem', color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>
              Tools
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {TOOL_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500, textDecoration: 'none', transition: 'color .15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#2563EB'}
                    onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Converters column */}
          <div>
            <p style={{ fontWeight: 800, fontSize: '0.78rem', color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>
              Converters
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {CONVERT_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500, textDecoration: 'none', transition: 'color .15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#2563EB'}
                    onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Contact column */}
          <div>
            <p style={{ fontWeight: 800, fontSize: '0.78rem', color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>
              Legal & Support
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {LEGAL_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      fontSize: '0.85rem', color: '#64748B', fontWeight: 600,
                      textDecoration: 'none', transition: 'color .15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#2563EB'}
                    onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
                  >
                    {l.icon} {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="mailto:support@piccraft.app"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    fontSize: '0.85rem', color: '#64748B', fontWeight: 600,
                    textDecoration: 'none', transition: 'color .15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#2563EB'}
                  onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
                >
                  <Mail size={13} /> support@piccraft.app
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom Bar ───────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid #F1F5F9', background: '#F8FAFC' }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto', padding: '14px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
        }}>
          <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: 0 }}>
            © {new Date().getFullYear()} PicCraft. All rights reserved.
          </p>

          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600, textDecoration: 'none', transition: 'color .15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#2563EB'}
                onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}