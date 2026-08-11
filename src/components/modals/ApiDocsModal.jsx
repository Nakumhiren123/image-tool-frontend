import React, { useState } from 'react';
import { X, Code2, Terminal, Copy, Check, Zap } from 'lucide-react';

const API_ENDPOINTS = [
  {
    name: 'Image Format Converter',
    path: 'POST /api/convert',
    desc: 'Convert any image file to JPG, PNG, WEBP, AVIF, or GIF format with custom quality ratings.',
    curl: `curl -X POST "http://localhost:5000/api/convert" \\
  -F "image=@photo.jpg" \\
  -F "format=webp" \\
  -F "quality=80" \\
  --output converted.webp`,
    js: `const formData = new FormData();
formData.append('image', file);
formData.append('format', 'webp');
formData.append('quality', '80');

const res = await fetch('http://localhost:5000/api/convert', {
  method: 'POST',
  body: formData
});
const blob = await res.blob();`
  },
  {
    name: 'Target KB Size Compressor',
    path: 'POST /api/compress',
    desc: 'Compress images to an exact target file size in KB using our iterative binary search algorithm.',
    curl: `curl -X POST "http://localhost:5000/api/compress" \\
  -F "image=@large_photo.jpg" \\
  -F "targetKB=50" \\
  --output compressed_50kb.jpg`,
    js: `const formData = new FormData();
formData.append('image', file);
formData.append('targetKB', '50');

const res = await fetch('http://localhost:5000/api/compress', {
  method: 'POST',
  body: formData
});
const blob = await res.blob();`
  },
  {
    name: 'Image Dimension Resizer',
    path: 'POST /api/resize',
    desc: 'Resize images by width, height, or percentage scale while maintaining aspect ratio.',
    curl: `curl -X POST "http://localhost:5000/api/resize" \\
  -F "image=@input.png" \\
  -F "width=800" \\
  -F "height=600" \\
  -F "maintainAspect=true" \\
  --output resized.png`,
    js: `const formData = new FormData();
formData.append('image', file);
formData.append('width', '800');
formData.append('height', '600');
formData.append('maintainAspect', 'true');

const res = await fetch('http://localhost:5000/api/resize', {
  method: 'POST',
  body: formData
});
const blob = await res.blob();`
  }
];

export default function ApiDocsModal({ isOpen, onClose }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [lang, setLang] = useState('curl'); // 'curl' | 'js'

  if (!isOpen) return null;

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div
        className="modal-panel animate-in"
        style={{
          maxWidth: 740, width: '100%', borderRadius: 24, background: '#FFFFFF',
          padding: 0, overflow: 'hidden', maxHeight: '90vh', display: 'flex',
          flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '24px 32px', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: '#FFFFFF', position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 18, right: 18, borderRadius: '50%',
              width: 32, height: 32, padding: 0, color: '#94A3B8',
              background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Code2 size={20} color="#0EA5E9" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Developer API Documentation
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
            PicCraft REST API v1.0
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: 4, margin: 0 }}>
            Integrate high-speed Sharp image processing directly into your applications.
          </p>

          {/* Language Selector */}
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button
              onClick={() => setLang('curl')}
              style={{
                padding: '6px 14px', borderRadius: 8, border: 'none', fontSize: '0.78rem',
                fontWeight: 800, cursor: 'pointer',
                background: lang === 'curl' ? '#3B82F6' : 'rgba(255,255,255,0.1)',
                color: lang === 'curl' ? '#FFF' : '#94A3B8'
              }}
            >
              cURL Command
            </button>
            <button
              onClick={() => setLang('js')}
              style={{
                padding: '6px 14px', borderRadius: 8, border: 'none', fontSize: '0.78rem',
                fontWeight: 800, cursor: 'pointer',
                background: lang === 'js' ? '#3B82F6' : 'rgba(255,255,255,0.1)',
                color: lang === 'js' ? '#FFF' : '#94A3B8'
              }}
            >
              JavaScript / Fetch
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 32, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>

          {API_ENDPOINTS.map((endpoint, idx) => {
            const codeText = lang === 'curl' ? endpoint.curl : endpoint.js;
            return (
              <div key={endpoint.path} style={{ background: '#F8FAFC', borderRadius: 16, border: '1px solid #E2E8F0', padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {endpoint.name}
                  </h3>
                  <span style={{
                    padding: '2px 8px', borderRadius: 6, background: '#EFF6FF',
                    color: '#2563EB', fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 800
                  }}>
                    {endpoint.path}
                  </span>
                </div>

                <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: 12 }}>
                  {endpoint.desc}
                </p>

                <div style={{ position: 'relative' }}>
                  <pre style={{
                    background: '#0F172A', color: '#E2E8F0', padding: '14px 16px',
                    borderRadius: 12, fontSize: '0.78rem', fontFamily: 'monospace',
                    overflowX: 'auto', margin: 0, lineHeight: 1.5
                  }}>
                    {codeText}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(codeText, idx)}
                    style={{
                      position: 'absolute', top: 10, right: 10, padding: '4px 8px',
                      borderRadius: 6, background: 'rgba(255,255,255,0.15)', color: '#FFF',
                      border: 'none', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700,
                      display: 'flex', alignItems: 'center', gap: 4
                    }}
                  >
                    {copiedIndex === idx ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                    {copiedIndex === idx ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            );
          })}

        </div>

        {/* Footer */}
        <div style={{ padding: '16px 32px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', textAlign: 'right' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px', borderRadius: 12, background: '#0F172A', color: '#FFFFFF',
              fontWeight: 800, fontSize: '0.85rem', border: 'none', cursor: 'pointer'
            }}
          >
            Close Docs
          </button>
        </div>
      </div>
    </div>
  );
}
