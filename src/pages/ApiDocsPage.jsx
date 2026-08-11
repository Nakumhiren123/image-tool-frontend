import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Code2, Copy, Check, ArrowLeft, Image, Zap, Key, BookOpen, Terminal } from 'lucide-react';

const API_ENDPOINTS = [
    {
        name: 'Image Format Converter',
        method: 'POST',
        path: '/api/convert',
        desc: 'Convert any image file to JPG, PNG, WEBP, AVIF, or GIF format with custom quality settings.',
        params: [
            { name: 'image', type: 'File', required: true, desc: 'The image file to convert.' },
            { name: 'format', type: 'string', required: true, desc: 'Target format: jpg | png | webp | avif | gif | bmp | ico | pdf' },
            { name: 'quality', type: 'number', required: false, desc: 'Output quality 1–100 (default: 85). Applies to JPG/WEBP/AVIF.' },
        ],
        curl: `curl -X POST "https://api.piccraft.app/api/convert" \\
  -F "image=@photo.jpg" \\
  -F "format=webp" \\
  -F "quality=80" \\
  --output converted.webp`,
        js: `const formData = new FormData();
formData.append('image', file);
formData.append('format', 'webp');
formData.append('quality', '80');

const res = await fetch('https://api.piccraft.app/api/convert', {
  method: 'POST',
  body: formData
});
const blob = await res.blob();
// blob is the converted image file`,
    },
    {
        name: 'Target KB Size Compressor',
        method: 'POST',
        path: '/api/compress',
        desc: 'Compress images to an exact target file size in KB using an iterative binary search algorithm.',
        params: [
            { name: 'image', type: 'File', required: true, desc: 'The image file to compress.' },
            { name: 'targetKB', type: 'number', required: true, desc: 'Target output size in kilobytes (e.g. 50 for 50KB).' },
        ],
        curl: `curl -X POST "https://api.piccraft.app/api/compress" \\
  -F "image=@large_photo.jpg" \\
  -F "targetKB=50" \\
  --output compressed_50kb.jpg`,
        js: `const formData = new FormData();
formData.append('image', file);
formData.append('targetKB', '50');

const res = await fetch('https://api.piccraft.app/api/compress', {
  method: 'POST',
  body: formData
});
const blob = await res.blob();`,
    },
    {
        name: 'Image Dimension Resizer',
        method: 'POST',
        path: '/api/resize',
        desc: 'Resize images by width, height, or percentage scale while maintaining aspect ratio.',
        params: [
            { name: 'image', type: 'File', required: true, desc: 'The image file to resize.' },
            { name: 'width', type: 'number', required: false, desc: 'Target width in pixels.' },
            { name: 'height', type: 'number', required: false, desc: 'Target height in pixels.' },
            { name: 'maintainAspect', type: 'boolean', required: false, desc: 'Preserve aspect ratio (default: true).' },
        ],
        curl: `curl -X POST "https://api.piccraft.app/api/resize" \\
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

const res = await fetch('https://api.piccraft.app/api/resize', {
  method: 'POST',
  body: formData
});
const blob = await res.blob();`,
    },
    {
        name: 'Image Cropper',
        method: 'POST',
        path: '/api/crop',
        desc: 'Crop an image to a specific region or aspect ratio.',
        params: [
            { name: 'image', type: 'File', required: true, desc: 'The image file to crop.' },
            { name: 'x', type: 'number', required: true, desc: 'Left offset in pixels.' },
            { name: 'y', type: 'number', required: true, desc: 'Top offset in pixels.' },
            { name: 'width', type: 'number', required: true, desc: 'Crop width in pixels.' },
            { name: 'height', type: 'number', required: true, desc: 'Crop height in pixels.' },
        ],
        curl: `curl -X POST "https://api.piccraft.app/api/crop" \\
  -F "image=@photo.jpg" \\
  -F "x=100" -F "y=50" \\
  -F "width=400" -F "height=400" \\
  --output cropped.jpg`,
        js: `const formData = new FormData();
formData.append('image', file);
formData.append('x', '100');
formData.append('y', '50');
formData.append('width', '400');
formData.append('height', '400');

const res = await fetch('https://api.piccraft.app/api/crop', {
  method: 'POST',
  body: formData
});
const blob = await res.blob();`,
    },
    {
        name: 'Rotate & Flip',
        method: 'POST',
        path: '/api/rotate',
        desc: 'Rotate or flip an image.',
        params: [
            { name: 'image', type: 'File', required: true, desc: 'The image file.' },
            { name: 'angle', type: 'number', required: false, desc: 'Rotation angle: 90 | 180 | 270.' },
            { name: 'flipH', type: 'boolean', required: false, desc: 'Flip horizontally.' },
            { name: 'flipV', type: 'boolean', required: false, desc: 'Flip vertically.' },
        ],
        curl: `curl -X POST "https://api.piccraft.app/api/rotate" \\
  -F "image=@photo.jpg" \\
  -F "angle=90" \\
  --output rotated.jpg`,
        js: `const formData = new FormData();
formData.append('image', file);
formData.append('angle', '90');

const res = await fetch('https://api.piccraft.app/api/rotate', {
  method: 'POST',
  body: formData
});
const blob = await res.blob();`,
    },
];

export default function ApiDocsPage() {
    const [lang, setLang] = useState('curl');
    const [copiedIdx, setCopiedIdx] = useState(null);

    const copy = (text, idx) => {
        navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>

            {/* ── Hero ────────────────────────────────────────────────────────── */}
            <div style={{
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                color: '#fff', padding: '48px 24px 56px',
            }}>
                <div style={{ maxWidth: 900, margin: '0 auto' }}>
                    <Link to="/" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        color: '#94A3B8', fontSize: '0.82rem', fontWeight: 600,
                        textDecoration: 'none', marginBottom: 28,
                    }}
                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
                    >
                        <ArrowLeft size={14} /> Back to PicCraft
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <Code2 size={22} color="#0EA5E9" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                            Developer API Documentation
                        </span>
                    </div>

                    <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', margin: '0 0 10px' }}>
                        PicCraft REST API v1.0
                    </h1>
                    <p style={{ fontSize: '0.92rem', color: '#94A3B8', margin: '0 0 28px', maxWidth: 560 }}>
                        Integrate high-speed Sharp image processing directly into your apps. All endpoints accept
                        multipart/form-data and return the processed image as a binary stream.
                    </p>

                    {/* Language toggle */}
                    <div style={{ display: 'flex', gap: 8 }}>
                        {[['curl', 'cURL'], ['js', 'JavaScript / Fetch']].map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => setLang(key)}
                                style={{
                                    padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
                                    fontWeight: 800, fontSize: '0.8rem',
                                    background: lang === key ? '#3B82F6' : 'rgba(255,255,255,0.1)',
                                    color: lang === key ? '#fff' : '#94A3B8',
                                    transition: 'all .18s',
                                }}
                            >{label}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Content ────────────────────────────────────────────────────── */}
            <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}>

                {/* Quick info boxes */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 40 }}>
                    {[
                        { icon: <Zap size={18} color="#F59E0B" />, label: 'Base URL', value: 'https://api.piccraft.app' },
                        { icon: <Key size={18} color="#6366F1" />, label: 'Authentication', value: 'No key required (Free Tier)' },
                        { icon: <Terminal size={18} color="#10B981" />, label: 'Response Format', value: 'Binary image stream' },
                        { icon: <BookOpen size={18} color="#3B82F6" />, label: 'Rate Limit', value: '100 req / hour (Free)' },
                    ].map((box) => (
                        <div key={box.label} style={{
                            background: '#fff', borderRadius: 14, border: '1.5px solid #E2E8F0',
                            padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 6,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {box.icon}
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{box.label}</span>
                            </div>
                            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>{box.value}</span>
                        </div>
                    ))}
                </div>

                {/* Endpoints */}
                <h2 style={{ fontWeight: 900, fontSize: '1.1rem', color: '#0F172A', marginBottom: 20 }}>
                    API Endpoints
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {API_ENDPOINTS.map((ep, idx) => (
                        <div key={ep.path} style={{
                            background: '#fff', borderRadius: 16,
                            border: '1.5px solid #E2E8F0', overflow: 'hidden',
                        }}>
                            {/* Endpoint header */}
                            <div style={{ padding: '20px 24px', borderBottom: '1.5px solid #F1F5F9' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                                    <span style={{
                                        padding: '3px 10px', borderRadius: 8,
                                        background: '#DBEAFE', color: '#1D4ED8',
                                        fontFamily: 'monospace', fontWeight: 900, fontSize: '0.78rem',
                                    }}>{ep.method}</span>
                                    <code style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.92rem', color: '#0F172A' }}>{ep.path}</code>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>&mdash; {ep.name}</span>
                                </div>
                                <p style={{ fontSize: '0.88rem', color: '#64748B', marginTop: 8, marginBottom: 0, lineHeight: 1.5 }}>{ep.desc}</p>
                            </div>

                            {/* Parameters */}
                            <div style={{ padding: '16px 24px', borderBottom: '1.5px solid #F1F5F9' }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Parameters</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {ep.params.map((p) => (
                                        <div key={p.name} style={{ display: 'flex', gap: 10, fontSize: '0.83rem', flexWrap: 'wrap', alignItems: 'baseline' }}>
                                            <code style={{ fontFamily: 'monospace', fontWeight: 800, color: '#0F172A', minWidth: 110 }}>{p.name}</code>
                                            <span style={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600 }}>{p.type}</span>
                                            <span style={{
                                                padding: '1px 7px', borderRadius: 5, fontSize: '0.68rem', fontWeight: 800,
                                                background: p.required ? '#FEE2E2' : '#F1F5F9',
                                                color: p.required ? '#991B1B' : '#64748B',
                                            }}>{p.required ? 'required' : 'optional'}</span>
                                            <span style={{ color: '#64748B', flex: 1 }}>{p.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Code block */}
                            <div style={{ position: 'relative', background: '#0F172A' }}>
                                <pre style={{
                                    margin: 0, padding: '20px 24px',
                                    color: '#E2E8F0', fontFamily: 'monospace',
                                    fontSize: '0.82rem', lineHeight: 1.6,
                                    overflowX: 'auto',
                                }}>
                                    {lang === 'curl' ? ep.curl : ep.js}
                                </pre>
                                <button
                                    onClick={() => copy(lang === 'curl' ? ep.curl : ep.js, idx)}
                                    style={{
                                        position: 'absolute', top: 12, right: 14,
                                        padding: '5px 10px', borderRadius: 8,
                                        background: 'rgba(255,255,255,0.12)', color: '#E2E8F0',
                                        border: 'none', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700,
                                        display: 'flex', alignItems: 'center', gap: 5, transition: 'background .15s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                                >
                                    {copiedIdx === idx ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
                                    {copiedIdx === idx ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Rate limits note */}
                <div style={{
                    marginTop: 36, background: '#EFF6FF', border: '1.5px solid #BFDBFE',
                    borderRadius: 14, padding: '20px 24px',
                }}>
                    <p style={{ fontWeight: 800, fontSize: '0.88rem', color: '#1E40AF', marginBottom: 6 }}>
                        🚀 Need higher rate limits or a Pro API key?
                    </p>
                    <p style={{ fontSize: '0.85rem', color: '#1E40AF', margin: 0, lineHeight: 1.6 }}>
                        PicCraft Pro subscribers get 1,000 API requests / hour and priority processing.
                        Contact us at{' '}
                        <a href="mailto:api@piccraft.app" style={{ color: '#1D4ED8', fontWeight: 700 }}>api@piccraft.app</a>{' '}
                        for enterprise or custom integrations.
                    </p>
                </div>

                {/* Back link */}
                <div style={{ marginTop: 48, paddingTop: 28, borderTop: '1.5px solid #E2E8F0', textAlign: 'center' }}>
                    <Link to="/" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '12px 28px', borderRadius: 12,
                        background: '#0F172A', color: '#fff',
                        fontWeight: 800, fontSize: '0.88rem', textDecoration: 'none',
                    }}>
                        <Image size={15} /> Back to PicCraft
                    </Link>
                </div>

            </div>
        </div>
    );
}
