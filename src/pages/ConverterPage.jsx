// src/pages/ConverterPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UploadArea from '../components/UploadArea';
import FileCard from '../components/FileCard';
import ConvertOptions from '../components/controls/ConvertOptions';
import DownloadButton from '../components/controls/DownloadButton';
import SEOHead from '../components/seo/SEOHead';
import ImagePreview from '../components/ImagePreview';
import AdSlot from '../components/AdSlot';
import AdInterstitialModal from '../components/AdInterstitialModal';
import PricingModal from '../components/pricing/PricingModal';
import { convertImage, downloadZip, loadImage } from '../lib/imageEngine';
import { Trash2, ImageIcon } from 'lucide-react';

export default function ConverterPage({ from, to }) {
    const { isPro, isAdFree } = useAuth();

    const [items, setItems] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [previewIndex, setPreviewIndex] = useState(null);
    const [convertFormat, setConvertFormat] = useState(to || 'png');
    const [convertQuality, setConvertQuality] = useState(0.85);
    const [errorMessage, setErrorMessage] = useState('');
    const [adModal, setAdModal] = useState({ open: false, onComplete: null, fileName: '' });
    const [proLimitModalOpen, setProLimitModalOpen] = useState(false);
    const [pricingModalOpen, setPricingModalOpen] = useState(false);

    // When route changes (e.g. /jpg-to-png → /png-to-jpg), sync the format
    React.useEffect(() => {
        if (to) setConvertFormat(to);
        setItems([]); // clear files when route changes
        setPreviewIndex(null);
        setErrorMessage('');
    }, [from, to]);

    // Page title and subtitle
    const toolTitle = from && to
        ? `${from.toUpperCase()} to ${to.toUpperCase()} Converter`
        : 'Image Format Converter';
    const toolSub = from && to
        ? `Convert your ${from.toUpperCase()} images to ${to.toUpperCase()} format — free, fast, right in your browser`
        : 'Convert between JPG, PNG, WEBP, AVIF, GIF, BMP and more';

    // ── File handling ──
    const handleFilesSelected = async (newFiles) => {
        setErrorMessage('');

        // If a specific `from` format is set, warn user but still allow (browsers often misreport types)
        const validFiles = newFiles.filter(f =>
            f.type.startsWith('image/') ||
            /\.(jpg|jpeg|png|webp|gif|avif|bmp|heic|heif)$/i.test(f.name)
        );

        if (!validFiles.length) {
            setErrorMessage('⚠️ Please upload valid image files.');
            return;
        }

        // Warn if wrong format uploaded (only when from prop is set)
        if (from) {
            const fromExt = from.toLowerCase() === 'jpg' ? ['jpg', 'jpeg'] : [from.toLowerCase()];
            const wrongFormat = validFiles.filter(f => {
                const ext = f.name.split('.').pop().toLowerCase();
                return !fromExt.includes(ext);
            });
            if (wrongFormat.length > 0) {
                setErrorMessage(`⚠️ This converter is for ${from.toUpperCase()} files. Some uploaded files may be a different format.`);
            }
        }

        let filesToProcess = validFiles;
        if (!isPro) {
            const combined = items.length + validFiles.length;
            if (combined > 5) {
                setProLimitModalOpen(true);
                filesToProcess = validFiles.slice(0, Math.max(0, 5 - items.length));
                if (!filesToProcess.length) return;
            }
        }

        const newItems = await Promise.all(filesToProcess.map(async (file) => {
            let width = 0, height = 0;
            try {
                const img = await loadImage(file);
                width = img.naturalWidth;
                height = img.naturalHeight;
            } catch { }
            return {
                id: Math.random().toString(36).slice(2),
                file,
                previewUrl: URL.createObjectURL(file),
                width,
                height,
                processedResult: null,
                status: 'idle',
            };
        }));

        setItems(prev => [...prev, ...newItems]);
    };

    const handleRemoveItem = (id) => {
        setItems(prev => {
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

    // ── Process ──
    const handleProcessAll = async () => {
        if (!items.length) return;
        setIsProcessing(true);
        try {
            const updated = await Promise.all(items.map(async (item) => {
                const result = await convertImage(item.file, convertFormat, convertQuality);
                return { ...item, status: 'done', processedResult: result };
            }));
            setItems(updated);
            if (updated[0]?.processedResult) setPreviewIndex(0);
        } catch (err) {
            console.error(err);
            setErrorMessage('⚠️ Something went wrong. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    // ── Download ──
    const doDownloadSingle = (item) => {
        if (!item.processedResult?.url) return;
        const a = document.createElement('a');
        a.href = item.processedResult.url;
        a.download = item.processedResult.file?.name || item.file.name;
        a.click();
    };

    const doDownloadZip = () => {
        const valid = items.map(i => i.processedResult).filter(r => r?.file);
        if (valid.length) downloadZip(valid, `piccraft_${from || 'convert'}_to_${convertFormat}_batch.zip`);
    };

    const handleDownloadSingle = (item) => {
        if (!item.processedResult?.url) return;
        if (isPro || isAdFree) { doDownloadSingle(item); return; }
        setAdModal({
            open: true,
            onComplete: () => doDownloadSingle(item),
            fileName: item.processedResult?.file?.name || item.file.name,
        });
    };

    const handleDownloadZip = () => {
        if (isPro || isAdFree) { doDownloadZip(); return; }
        setAdModal({
            open: true,
            onComplete: () => doDownloadZip(),
            fileName: `piccraft_${from || 'convert'}_to_${convertFormat}_batch.zip`,
        });
    };

    const processedCount = items.filter(i => i.processedResult).length;
    const firstItem = items[0];

    return (
        <main className="main-content" style={{ flex: 1, maxWidth: 1280, margin: '0 auto', width: '100%', padding: '40px 24px' }}>
            <SEOHead activeTab="convert" from={from} to={to} />

            {/* Page title */}
            <div className="page-title-area" style={{ marginBottom: 36, textAlign: 'center' }}>
                <h1 style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.03em', color: 'var(--text-1)', marginBottom: 10 }}>
                    <span className="grad-text">{toolTitle}</span>
                </h1>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-3)', maxWidth: 500, margin: '0 auto' }}>{toolSub}</p>
            </div>

            {/* Two-column workspace */}
            <div className="workspace-grid" style={{ display: 'grid', gridTemplateColumns: items.length ? '1fr 380px' : '1fr', gap: 24, alignItems: 'start' }}>

                {/* Left column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <UploadArea onFilesSelected={handleFilesSelected} hasFiles={items.length > 0} />

                    {/* Image preview panel */}
                    {firstItem && (
                        <div style={{ borderRadius: 20, overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid var(--border)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', background: 'rgba(99,102,241,0.08)', borderBottom: '1px solid var(--border)' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-2)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Image Preview</span>
                                {firstItem.width && firstItem.height && (
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 600 }}>{firstItem.width} × {firstItem.height}px</span>
                                )}
                            </div>
                            <div style={{ position: 'relative', width: '100%', minHeight: 260, maxHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'repeating-conic-gradient(rgba(255,255,255,0.025) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px', overflow: 'hidden' }}>
                                <img
                                    src={firstItem.processedResult?.url || firstItem.previewUrl}
                                    alt={firstItem.file?.name}
                                    style={{ maxWidth: '100%', maxHeight: 420, objectFit: 'contain', display: 'block', borderRadius: 4 }}
                                />
                                {isProcessing && (
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.65)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, backdropFilter: 'blur(4px)' }}>
                                        <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid rgba(99,102,241,0.25)', borderTopColor: 'var(--primary-light)', animation: 'spin 0.8s linear infinite' }} />
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c7d2fe' }}>Converting…</span>
                                    </div>
                                )}
                                {firstItem.status === 'done' && firstItem.processedResult && (
                                    <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(16,185,129,0.9)', color: '#fff', fontSize: '0.72rem', fontWeight: 800, padding: '4px 12px', borderRadius: 99 }}>
                                        ✓ Ready to Download
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px', borderTop: '1px solid var(--border)' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontWeight: 600 }}>📄 {firstItem.file?.name}</span>
                                <div style={{ display: 'flex', gap: 10 }}>
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
                        <div style={{ padding: '12px 16px', borderRadius: 12, background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>{errorMessage}</span>
                            <button onClick={() => setErrorMessage('')} style={{ background: 'transparent', border: 'none', color: '#991B1B', fontWeight: 700, cursor: 'pointer' }}>✕</button>
                        </div>
                    )}

                    {/* File list */}
                    {items.length > 0 && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-1)' }}>
                                        {items.length} Image{items.length !== 1 ? 's' : ''} Selected
                                    </span>
                                    {processedCount > 0 && (
                                        <span className="badge badge-emerald">{processedCount} converted</span>
                                    )}
                                </div>
                                <button onClick={handleClearAll} className="btn btn-danger btn-sm" style={{ gap: 6 }}>
                                    <Trash2 size={13} /> Clear All
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 480, overflowY: 'auto', paddingRight: 4 }}>
                                {items.map(item => (
                                    <FileCard
                                        key={item.id}
                                        item={item}
                                        onRemove={handleRemoveItem}
                                        onPreview={() => setPreviewIndex(items.indexOf(item))}
                                        onDownloadSingle={handleDownloadSingle}
                                        isProcessing={isProcessing}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right column: settings panel */}
                {items.length > 0 && (
                    <div className="settings-panel" style={{ position: 'sticky', top: 90, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ background: 'var(--bg-card)', backdropFilter: 'blur(20px)', border: '1px solid var(--border)', borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
                            <ConvertOptions
                                format={convertFormat}
                                setFormat={setConvertFormat}
                                quality={convertQuality}
                                setQuality={setConvertQuality}
                                from={from}  // pass from so ConvertOptions can redirect on format change
                            />
                            <hr className="divider" />
                            <DownloadButton
                                onProcessAll={handleProcessAll}
                                onDownloadZip={handleDownloadZip}
                                isProcessing={isProcessing}
                                processedCount={processedCount}
                                totalCount={items.length}
                                activeTool="convert"
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

            {/* Preview modal */}
            {previewIndex !== null && (
                <ImagePreview
                    items={items}
                    currentIndex={previewIndex}
                    onNavigate={setPreviewIndex}
                    onClose={() => setPreviewIndex(null)}
                    onDownload={handleDownloadSingle}
                />
            )}

            {/* Ad modal */}
            <AdInterstitialModal
                isOpen={adModal.open}
                onClose={() => setAdModal(m => ({ ...m, open: false }))}
                onAdComplete={adModal.onComplete || (() => { })}
                onOpenPricing={() => { setAdModal(m => ({ ...m, open: false })); setPricingModalOpen(true); }}
                fileName={adModal.fileName}
            />

            {/* Pricing modal */}
            <PricingModal isOpen={pricingModalOpen} onClose={() => setPricingModalOpen(false)} />

            {/* PRO limit modal */}
            {proLimitModalOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                    <div style={{ background: '#FFFFFF', borderRadius: 24, maxWidth: 460, width: '100%', padding: 32, textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #E2E8F0' }}>
                        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 32 }}>⚡</div>
                        <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.4rem', color: '#0F172A', marginBottom: 12 }}>Free Plan Upload Limit</h3>
                        <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, marginBottom: 24 }}>
                            You cannot add more than <strong>5 files at a time</strong> on the Free Plan. Upgrade to <strong>PRO</strong> to process with more files!
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <button
                                onClick={() => { setProLimitModalOpen(false); setPricingModalOpen(true); }}
                                style={{ padding: '14px 24px', borderRadius: 14, background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff', fontWeight: 800, fontSize: '0.95rem', border: 'none', cursor: 'pointer' }}
                            >
                                🚀 Upgrade to PRO Now
                            </button>
                            <button
                                onClick={() => setProLimitModalOpen(false)}
                                style={{ padding: '10px 20px', borderRadius: 12, background: 'transparent', color: '#64748B', fontWeight: 700, fontSize: '0.85rem', border: 'none', cursor: 'pointer' }}
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

// // src/pages/ConverterPage.jsx
// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import UploadArea from '../components/UploadArea';
// import FileCard from '../components/FileCard';
// import ConvertOptions from '../components/controls/ConvertOptions';
// import DownloadButton from '../components/controls/DownloadButton';
// import SEOHead from '../components/seo/SEOHead';
// import ImagePreview from '../components/ImagePreview';
// import { convertImage, downloadZip, loadImage } from '../lib/imageEngine';
// import { Trash2, ImageIcon } from 'lucide-react';

// export default function ConverterPage({ from, to }) {
//     // If URL is /jpg-to-png, from="jpg" to="png" is passed as props
//     // If URL is /convert with no props, user picks format manually
//     const { isPro, isAdFree } = useAuth();

//     const [items, setItems] = useState([]);
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [previewIndex, setPreviewIndex] = useState(null);
//     const [convertFormat, setConvertFormat] = useState(to || 'png');
//     const [convertQuality, setConvertQuality] = useState(0.85);
//     const [errorMessage, setErrorMessage] = useState('');
//     const [adModal, setAdModal] = useState({ open: false, onComplete: null, fileName: '' });
//     const [proLimitModalOpen, setProLimitModalOpen] = useState(false);
//     const [pricingModalOpen, setPricingModalOpen] = useState(false);

//     // When the route changes (e.g. from /jpg-to-png to /png-to-jpg), update the target format
//     React.useEffect(() => {
//         if (to) setConvertFormat(to);
//     }, [to]);

//     const toolTitle = from && to
//         ? `${from.toUpperCase()} to ${to.toUpperCase()} Converter`
//         : 'Format Converter';
//     const toolSub = from && to
//         ? `Convert your ${from.toUpperCase()} images to ${to.toUpperCase()} — free, fast, right in your browser`
//         : 'Convert between JPG, PNG, WEBP, AVIF, GIF, PDF, DOCX and more';

//     const handleFilesSelected = async (newFiles) => {
//         setErrorMessage('');
//         const validFiles = newFiles.filter(f => f.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|avif|bmp)$/i.test(f.name));
//         if (!validFiles.length) { setErrorMessage('⚠️ Please upload image files.'); return; }

//         let filesToProcess = validFiles;
//         if (!isPro) {
//             const combined = items.length + validFiles.length;
//             if (combined > 5) {
//                 setProLimitModalOpen(true);
//                 filesToProcess = validFiles.slice(0, Math.max(0, 5 - items.length));
//                 if (!filesToProcess.length) return;
//             }
//         }

//         const newItems = await Promise.all(filesToProcess.map(async (file) => {
//             let width = 0, height = 0;
//             try { const img = await loadImage(file); width = img.naturalWidth; height = img.naturalHeight; } catch { }
//             return { id: Math.random().toString(36).slice(2), file, previewUrl: URL.createObjectURL(file), width, height, processedResult: null, status: 'idle' };
//         }));
//         setItems(prev => [...prev, ...newItems]);
//     };

//     const handleRemoveItem = (id) => {
//         setItems(prev => {
//             const item = prev.find(i => i.id === id);
//             if (item) { URL.revokeObjectURL(item.previewUrl); if (item.processedResult?.url) URL.revokeObjectURL(item.processedResult.url); }
//             return prev.filter(i => i.id !== id);
//         });
//     };

//     const handleClearAll = () => { items.forEach(i => { URL.revokeObjectURL(i.previewUrl); if (i.processedResult?.url) URL.revokeObjectURL(i.processedResult.url); }); setItems([]); };

//     const handleProcessAll = async () => {
//         if (!items.length) return;
//         setIsProcessing(true);
//         try {
//             const updated = await Promise.all(items.map(async (item) => {
//                 const result = await convertImage(item.file, convertFormat, convertQuality);
//                 return { ...item, status: 'done', processedResult: result };
//             }));
//             setItems(updated);
//             if (updated[0]?.processedResult) setPreviewIndex(0);
//         } catch (err) { console.error(err); }
//         finally { setIsProcessing(false); }
//     };

//     const doDownloadSingle = (item) => {
//         if (!item.processedResult?.url) return;
//         const a = document.createElement('a'); a.href = item.processedResult.url;
//         a.download = item.processedResult.file?.name || item.file.name; a.click();
//     };

//     const handleDownloadSingle = (item) => {
//         if (isPro || isAdFree) { doDownloadSingle(item); return; }
//         setAdModal({ open: true, onComplete: () => doDownloadSingle(item), fileName: item.processedResult?.file?.name || item.file.name });
//     };

//     const handleDownloadZip = () => {
//         const valid = items.map(i => i.processedResult).filter(r => r?.file);
//         if (valid.length) downloadZip(valid, `piccraft_convert_batch.zip`);
//     };

//     const processedCount = items.filter(i => i.processedResult).length;
//     const firstItem = items[0];

//     return (
//         <main className="main-content" style={{ flex: 1, maxWidth: 1280, margin: '0 auto', width: '100%', padding: '40px 24px' }}>
//             <SEOHead activeTab="convert" />

//             <div className="page-title-area" style={{ marginBottom: 36, textAlign: 'center' }}>
//                 <h1 style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.03em', color: 'var(--text-1)', marginBottom: 10 }}>
//                     <span className="grad-text">{toolTitle}</span>
//                 </h1>
//                 <p style={{ fontSize: '0.95rem', color: 'var(--text-3)', maxWidth: 500, margin: '0 auto' }}>{toolSub}</p>
//             </div>

//             <div className="workspace-grid" style={{ display: 'grid', gridTemplateColumns: items.length ? '1fr 380px' : '1fr', gap: 24, alignItems: 'start' }}>
//                 {/* Left column */}
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
//                     <UploadArea onFilesSelected={handleFilesSelected} hasFiles={items.length > 0} />

//                     {/* Image preview panel - same style as your original App.jsx */}
//                     {firstItem && (
//                         <div style={{ borderRadius: 20, overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid var(--border)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
//                             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', background: 'rgba(99,102,241,0.08)', borderBottom: '1px solid var(--border)' }}>
//                                 <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-2)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Image Preview</span>
//                                 {firstItem.width && firstItem.height && <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 600 }}>{firstItem.width} × {firstItem.height}px</span>}
//                             </div>
//                             <div style={{ position: 'relative', width: '100%', minHeight: 260, maxHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'repeating-conic-gradient(rgba(255,255,255,0.025) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px', overflow: 'hidden' }}>
//                                 <img src={firstItem.processedResult?.url || firstItem.previewUrl} alt={firstItem.file?.name} style={{ maxWidth: '100%', maxHeight: 420, objectFit: 'contain', display: 'block', borderRadius: 4 }} />
//                                 {isProcessing && (
//                                     <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.65)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, backdropFilter: 'blur(4px)' }}>
//                                         <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid rgba(99,102,241,0.25)', borderTopColor: 'var(--primary-light)', animation: 'spin 0.8s linear infinite' }} />
//                                         <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c7d2fe' }}>Processing…</span>
//                                     </div>
//                                 )}
//                                 {firstItem.status === 'done' && firstItem.processedResult && (
//                                     <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(16,185,129,0.9)', color: '#fff', fontSize: '0.72rem', fontWeight: 800, padding: '4px 12px', borderRadius: 99 }}>✓ Ready to Download</div>
//                                 )}
//                             </div>
//                             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px', borderTop: '1px solid var(--border)' }}>
//                                 <span style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontWeight: 600 }}>📄 {firstItem.file?.name}</span>
//                                 <div style={{ display: 'flex', gap: 10 }}>
//                                     <span style={{ fontSize: '0.78rem', color: 'var(--text-3)', fontWeight: 600 }}>{firstItem.file?.size ? (firstItem.file.size / 1024).toFixed(1) + ' KB' : ''}</span>
//                                     {firstItem.processedResult?.size && <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700 }}>→ {(firstItem.processedResult.size / 1024).toFixed(1)} KB</span>}
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {errorMessage && (
//                         <div style={{ padding: '12px 16px', borderRadius: 12, background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                             <span>{errorMessage}</span>
//                             <button onClick={() => setErrorMessage('')} style={{ background: 'transparent', border: 'none', color: '#991B1B', fontWeight: 700, cursor: 'pointer' }}>✕</button>
//                         </div>
//                     )}

//                     {items.length > 0 && (
//                         <div>
//                             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
//                                 <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-1)' }}>{items.length} Image{items.length !== 1 ? 's' : ''} Selected</span>
//                                 <button onClick={handleClearAll} className="btn btn-danger btn-sm" style={{ gap: 6 }}><Trash2 size={13} /> Clear All</button>
//                             </div>
//                             <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 480, overflowY: 'auto', paddingRight: 4 }}>
//                                 {items.map(item => (
//                                     <FileCard key={item.id} item={item} onRemove={handleRemoveItem} onPreview={(item) => setPreviewIndex(items.indexOf(item))} onDownloadSingle={handleDownloadSingle} isProcessing={isProcessing} />
//                                 ))}
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* Right column: settings panel */}
//                 {items.length > 0 && (
//                     <div className="settings-panel" style={{ position: 'sticky', top: 90 }}>
//                         <div style={{ background: 'var(--bg-card)', backdropFilter: 'blur(20px)', border: '1px solid var(--border)', borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
//                             <ConvertOptions format={convertFormat} setFormat={setConvertFormat} quality={convertQuality} setQuality={setConvertQuality} />
//                             <hr className="divider" />
//                             <DownloadButton onProcessAll={handleProcessAll} onDownloadZip={handleDownloadZip} isProcessing={isProcessing} processedCount={processedCount} totalCount={items.length} activeTool="convert" />
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {items.length === 0 && (
//                 <div style={{ textAlign: 'center', marginTop: 40, color: 'var(--text-3)' }}>
//                     <ImageIcon size={36} style={{ margin: '0 auto 10px', opacity: 0.25 }} />
//                     <p style={{ fontSize: '0.85rem' }}>Upload images above to get started</p>
//                 </div>
//             )}

//             {previewIndex !== null && <ImagePreview items={items} currentIndex={previewIndex} onNavigate={setPreviewIndex} onClose={() => setPreviewIndex(null)} onDownload={handleDownloadSingle} />}
//         </main>
//     );
// }