// src/pages/CompressPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UploadArea from '../components/UploadArea';
import FileCard from '../components/FileCard';
import CompressionSlider from '../components/controls/CompressionSlider';
import DownloadButton from '../components/controls/DownloadButton';
import SEOHead from '../components/seo/SEOHead';
import ImagePreview from '../components/ImagePreview';
import AdSlot from '../components/AdSlot';
import AdInterstitialModal from '../components/AdInterstitialModal';
import PricingModal from '../components/pricing/PricingModal';
import { compressImage, compressToTargetSize, downloadZip, loadImage } from '../lib/imageEngine';
import { Trash2, ImageIcon } from 'lucide-react';

export default function CompressPage() {
    const { isPro, isAdFree } = useAuth();

    // ── File state ──
    const [items, setItems] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [previewIndex, setPreviewIndex] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    // ── Compress-specific state (from original App.jsx) ──
    const [compressMode, setCompressMode] = useState('quality');
    const [compressQuality, setCompressQuality] = useState(0.8);
    const [compressTargetKB, setCompressTargetKB] = useState(100);
    const [compressFormat, setCompressFormat] = useState('jpg');

    // ── Modal state ──
    const [adModal, setAdModal] = useState({ open: false, onComplete: null, fileName: '' });
    const [proLimitModalOpen, setProLimitModalOpen] = useState(false);
    const [pricingModalOpen, setPricingModalOpen] = useState(false);

    // ── File handling (exact copy from original App.jsx) ──
    const handleFilesSelected = async (newFiles) => {
        setErrorMessage('');

        const validImageFiles = [];
        const invalidFiles = [];
        const oversizedFiles = [];
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

        for (const f of newFiles) {
            if (f.size > MAX_FILE_SIZE) {
                oversizedFiles.push(f.name);
            } else if (f.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|avif|bmp|svg|heic|heif)$/i.test(f.name)) {
                validImageFiles.push(f);
            } else {
                invalidFiles.push(f.name);
            }
        }

        if (oversizedFiles.length > 0) {
            setErrorMessage(
                `⚠️ File limit exceeded: "${oversizedFiles.slice(0, 2).join(', ')}${oversizedFiles.length > 2 ? '...' : ''}" exceeds the 10 MB per file limit.`
            );
        } else if (invalidFiles.length > 0) {
            setErrorMessage(
                `⚠️ Invalid file format: "${invalidFiles.slice(0, 2).join(', ')}${invalidFiles.length > 2 ? '...' : ''}". Please select supported image files (JPG, PNG, WEBP, GIF, AVIF, BMP).`
            );
        }

        if (validImageFiles.length === 0) return;

        // Free plan batch limit check
        let filesToProcess = validImageFiles;
        if (!isPro) {
            const totalCombined = items.length + validImageFiles.length;
            if (validImageFiles.length > 5 || totalCombined > 5) {
                setProLimitModalOpen(true);
                const allowedCount = Math.max(0, 5 - items.length);
                if (allowedCount === 0) return;
                filesToProcess = validImageFiles.slice(0, allowedCount);
            }
        }

        const newItems = await Promise.all(
            filesToProcess.map(async (file) => {
                let width = 0, height = 0;
                try {
                    const img = await loadImage(file);
                    width = img.naturalWidth;
                    height = img.naturalHeight;
                } catch { }
                return {
                    id: Math.random().toString(36).substring(2, 9),
                    file,
                    previewUrl: URL.createObjectURL(file),
                    width,
                    height,
                    processedResult: null,
                    status: 'idle',
                };
            })
        );

        setItems((prev) => [...prev, ...newItems]);
    };

    const handleRemoveItem = (id) => {
        setItems((prev) => {
            const item = prev.find(i => i.id === id);
            if (item) {
                URL.revokeObjectURL(item.previewUrl);
                if (item.processedResult?.url) URL.revokeObjectURL(item.processedResult.url);
            }
            return prev.filter(i => i.id !== id);
        });
    };

    const handleClearAll = () => {
        items.forEach(i => {
            URL.revokeObjectURL(i.previewUrl);
            if (i.processedResult?.url) URL.revokeObjectURL(i.processedResult.url);
        });
        setItems([]);
    };

    // ── Process (exact compress logic from original App.jsx) ──
    const handleProcessAll = async () => {
        if (!items.length) return;
        setIsProcessing(true);
        try {
            const updated = [];
            for (const item of items) {
                const result = compressMode === 'targetSize'
                    ? await compressToTargetSize(item.file, compressTargetKB, compressFormat)
                    : await compressImage(item.file, compressQuality, compressFormat);
                updated.push({ ...item, status: 'done', processedResult: result });
            }
            setItems(updated);
            if (updated.length > 0 && updated[0].processedResult) {
                setPreviewIndex(0);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    // ── Download helpers (exact copy from original App.jsx) ──
    const doDownloadSingle = (item) => {
        if (!item.processedResult?.url) return;
        const a = document.createElement('a');
        a.href = item.processedResult.url;
        a.download = item.processedResult.file?.name || item.file.name;
        a.click();
    };

    const doDownloadZip = () => {
        const valid = items.map(i => i.processedResult).filter(r => r?.file);
        if (valid.length) downloadZip(valid, 'piccraft_compress_batch.zip');
    };

    const handleDownloadSingle = (item) => {
        if (!item.processedResult?.url) return;
        if (isPro || isAdFree) {
            doDownloadSingle(item);
        } else {
            setAdModal({
                open: true,
                onComplete: () => doDownloadSingle(item),
                fileName: item.processedResult.file?.name || item.file.name,
            });
        }
    };

    const handleDownloadZip = () => {
        if (isPro || isAdFree) {
            doDownloadZip();
        } else {
            setAdModal({
                open: true,
                onComplete: () => doDownloadZip(),
                fileName: 'piccraft_compress_batch.zip',
            });
        }
    };

    const firstItem = items[0];
    const processedCount = items.filter(i => i.processedResult).length;

    return (
        <main
            className="main-content"
            style={{ flex: 1, maxWidth: 1280, margin: '0 auto', width: '100%', padding: '40px 24px' }}
        >
            <SEOHead activeTab="compress" />

            {/* ── Page title ── */}
            <div className="page-title-area" style={{ marginBottom: 36, textAlign: 'center' }}>
                <h1 style={{
                    fontFamily: 'var(--font-head)',
                    fontWeight: 900,
                    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                    letterSpacing: '-0.03em',
                    color: 'var(--text-1)',
                    marginBottom: 10,
                }}>
                    <span className="grad-text">Image Compressor</span>
                </h1>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-3)', maxWidth: 500, margin: '0 auto' }}>
                    Shrink file size with quality control or target KB precision
                </p>
            </div>

            {/* ── Two-column workspace ── */}
            <div
                className="workspace-grid"
                style={{
                    display: 'grid',
                    gridTemplateColumns: items.length ? '1fr 380px' : '1fr',
                    gap: 24,
                    alignItems: 'start',
                    transition: 'grid-template-columns 0.3s ease',
                }}
            >
                {/* ── Left column ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                    <UploadArea onFilesSelected={handleFilesSelected} hasFiles={items.length > 0} />

                    {/* Live preview panel */}
                    {items.length > 0 && firstItem && (
                        <div style={{
                            borderRadius: 20, overflow: 'hidden',
                            background: 'var(--bg-card)', border: '1px solid var(--border)',
                            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                            boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
                        }}>
                            {/* Header bar */}
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '12px 18px',
                                background: 'rgba(99,102,241,0.08)',
                                borderBottom: '1px solid var(--border)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{
                                        width: 8, height: 8, borderRadius: '50%',
                                        background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                                        boxShadow: '0 0 8px rgba(99,102,241,0.6)',
                                    }} />
                                    <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-2)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                        Image Preview
                                    </span>
                                    <span style={{
                                        background: 'rgba(99,102,241,0.18)', color: 'var(--primary-light)',
                                        fontSize: '0.72rem', fontWeight: 700,
                                        padding: '2px 10px', borderRadius: 99,
                                        border: '1px solid rgba(99,102,241,0.25)',
                                    }}>
                                        Image Compressor
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {firstItem.width && firstItem.height && (
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 600 }}>
                                            {firstItem.width} &times; {firstItem.height}px
                                        </span>
                                    )}
                                    {items.length > 1 && (
                                        <span style={{
                                            background: 'rgba(16,185,129,0.15)', color: '#34d399',
                                            fontSize: '0.72rem', fontWeight: 700,
                                            padding: '2px 8px', borderRadius: 99,
                                            border: '1px solid rgba(16,185,129,0.25)',
                                        }}>
                                            +{items.length - 1} more
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Image area */}
                            <div style={{
                                position: 'relative', width: '100%',
                                minHeight: 260, maxHeight: 420,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'repeating-conic-gradient(rgba(255,255,255,0.025) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px',
                                overflow: 'hidden',
                            }}>
                                <img
                                    src={firstItem.processedResult?.url || firstItem.previewUrl}
                                    alt={firstItem.file?.name}
                                    style={{ maxWidth: '100%', maxHeight: 420, objectFit: 'contain', display: 'block', borderRadius: 4 }}
                                />

                                {isProcessing && (
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: 'rgba(15,23,42,0.65)',
                                        display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', justifyContent: 'center', gap: 14,
                                        backdropFilter: 'blur(4px)',
                                    }}>
                                        <div style={{
                                            width: 44, height: 44, borderRadius: '50%',
                                            border: '3px solid rgba(99,102,241,0.25)',
                                            borderTopColor: 'var(--primary-light)',
                                            animation: 'spin 0.8s linear infinite',
                                        }} />
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c7d2fe' }}>Processing…</span>
                                    </div>
                                )}

                                {firstItem.status === 'done' && firstItem.processedResult && (
                                    <div style={{
                                        position: 'absolute', top: 12, right: 12,
                                        background: 'rgba(16,185,129,0.9)', color: '#fff',
                                        fontSize: '0.72rem', fontWeight: 800,
                                        padding: '4px 12px', borderRadius: 99,
                                        backdropFilter: 'blur(8px)',
                                        boxShadow: '0 2px 12px rgba(16,185,129,0.4)',
                                    }}>
                                        ✓ Ready to Download
                                    </div>
                                )}
                            </div>

                            {/* Footer meta */}
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '10px 18px',
                                borderTop: '1px solid var(--border)',
                                background: 'rgba(255,255,255,0.02)', gap: 8,
                            }}>
                                <span style={{
                                    fontSize: '0.8rem', color: 'var(--text-3)',
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '60%',
                                    fontWeight: 600,
                                }} title={firstItem.file?.name}>
                                    📄 {firstItem.file?.name}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                                    <span style={{ fontSize: '0.78rem', color: 'var(--text-3)', fontWeight: 600 }}>
                                        {firstItem.file?.size ? (firstItem.file.size / 1024).toFixed(1) + ' KB' : ''}
                                    </span>
                                    {firstItem.processedResult?.size && (
                                        <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700 }}>
                                            → {(firstItem.processedResult.size / 1024).toFixed(1)} KB
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error banner */}
                    {errorMessage && (
                        <div style={{
                            padding: '12px 16px', borderRadius: 12,
                            background: '#FEF2F2', border: '1px solid #FECACA',
                            color: '#991B1B', fontSize: '0.85rem', fontWeight: 600,
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                        }}>
                            <span>{errorMessage}</span>
                            <button
                                onClick={() => setErrorMessage('')}
                                style={{ background: 'transparent', border: 'none', color: '#991B1B', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}
                            >✕</button>
                        </div>
                    )}

                    {/* File list */}
                    {items.length > 0 && (
                        <div className="animate-in">
                            <div style={{
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'space-between', marginBottom: 12,
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-1)' }}>
                                        {items.length} Image{items.length !== 1 ? 's' : ''} Selected
                                    </span>
                                    {processedCount > 0 && (
                                        <span className="badge badge-emerald">{processedCount} processed</span>
                                    )}
                                </div>
                                <button onClick={handleClearAll} className="btn btn-danger btn-sm" style={{ gap: 6 }}>
                                    <Trash2 size={13} /> Clear All
                                </button>
                            </div>

                            <div style={{
                                display: 'flex', flexDirection: 'column', gap: 8,
                                maxHeight: 480, overflowY: 'auto', paddingRight: 4,
                            }}>
                                {items.map((item) => (
                                    <FileCard
                                        key={item.id}
                                        item={item}
                                        onRemove={handleRemoveItem}
                                        onPreview={(item) => setPreviewIndex(items.indexOf(item))}
                                        onDownloadSingle={handleDownloadSingle}
                                        isProcessing={isProcessing}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Right column: settings panel ── */}
                {items.length > 0 && (
                    <div className="settings-panel" style={{ position: 'sticky', top: 90, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{
                            background: 'var(--bg-card)',
                            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid var(--border)',
                            borderRadius: 20, padding: 24,
                            display: 'flex', flexDirection: 'column', gap: 24,
                        }}>
                            {/* Compression controls (exact props from original App.jsx) */}
                            <CompressionSlider
                                mode={compressMode}
                                setMode={setCompressMode}
                                quality={compressQuality}
                                setQuality={setCompressQuality}
                                targetKB={compressTargetKB}
                                setTargetKB={setCompressTargetKB}
                                format={compressFormat}
                                setFormat={setCompressFormat}
                            />

                            <hr className="divider" />

                            <DownloadButton
                                onProcessAll={handleProcessAll}
                                onDownloadZip={handleDownloadZip}
                                isProcessing={isProcessing}
                                processedCount={processedCount}
                                totalCount={items.length}
                                activeTool="compress"
                            />
                        </div>

                        <AdSlot type="rectangle" />
                    </div>
                )}
            </div>

            {/* Empty state */}
            {items.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: 40, color: 'var(--text-3)' }}>
                    <ImageIcon size={36} style={{ margin: '0 auto 10px', opacity: 0.25 }} />
                    <p style={{ fontSize: '0.85rem' }}>Upload images above to get started</p>
                </div>
            )}

            {/* ── Modals ── */}
            <AdInterstitialModal
                isOpen={adModal.open}
                onClose={() => setAdModal(m => ({ ...m, open: false }))}
                onAdComplete={adModal.onComplete || (() => { })}
                onOpenPricing={() => { setAdModal(m => ({ ...m, open: false })); setPricingModalOpen(true); }}
                fileName={adModal.fileName}
            />

            {previewIndex !== null && (
                <ImagePreview
                    items={items}
                    currentIndex={previewIndex}
                    onNavigate={setPreviewIndex}
                    onClose={() => setPreviewIndex(null)}
                    onDownload={handleDownloadSingle}
                />
            )}

            <PricingModal isOpen={pricingModalOpen} onClose={() => setPricingModalOpen(false)} />

            {/* PRO limit modal */}
            {proLimitModalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999,
                    background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
                }}>
                    <div style={{
                        background: '#FFFFFF', borderRadius: 24, maxWidth: 460, width: '100%',
                        padding: 32, textAlign: 'center',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                        border: '1px solid #E2E8F0', animation: 'modalScale 0.25s ease',
                    }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: '50%', background: '#FEF3C7',
                            color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px auto', fontSize: 32, fontWeight: 900,
                        }}>⚡</div>
                        <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.4rem', color: '#0F172A', marginBottom: 12 }}>
                            Free Plan Upload Limit
                        </h3>
                        <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, marginBottom: 24 }}>
                            You cannot add more than <strong>5 files at a time</strong> on the Free Plan.
                            Upgrade to <strong>PRO</strong> to process with more files!
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <button
                                onClick={() => { setProLimitModalOpen(false); setPricingModalOpen(true); }}
                                style={{
                                    padding: '14px 24px', borderRadius: 14,
                                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                                    color: '#FFFFFF', fontWeight: 800, fontSize: '0.95rem',
                                    border: 'none', cursor: 'pointer',
                                    boxShadow: '0 4px 14px rgba(245,158,11,0.4)',
                                }}
                            >
                                🚀 Upgrade to PRO Lifetime Now
                            </button>
                            <button
                                onClick={() => setProLimitModalOpen(false)}
                                style={{
                                    padding: '10px 20px', borderRadius: 12,
                                    background: 'transparent', color: '#64748B',
                                    fontWeight: 700, fontSize: '0.85rem', border: 'none', cursor: 'pointer',
                                }}
                            >
                                Continue with 5 Files (Free)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}