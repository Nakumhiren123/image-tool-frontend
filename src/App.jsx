// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SEOContentSection from './components/seo/SEOContentSection';
import AdSlot from './components/AdSlot';
import AdInterstitialModal from './components/AdInterstitialModal';
import AuthModal from './components/auth/AuthModal';
import PricingModal from './components/pricing/PricingModal';
import AdminPanelModal from './components/admin/AdminPanelModal';
import ScrollToTop from './components/ScrollToTop';

// Tool pages
import ConverterPage from './pages/ConverterPage';
import CompressPage from './pages/CompressPage';
import ResizePage from './pages/ResizePage';
import FilterPage from './pages/FilterPage';
import CropPage from './pages/CropPage';
import RotatePage from './pages/RotatePage';
import WatermarkPage from './pages/WatermarkPage';
import NameDatePage from './pages/NameDatePage';
import MergePage from './pages/MergePage';
import ConvertersHubPage from './pages/ConvertersHubPage';

// ── Legal & Docs pages (new dedicated full pages) ──────────────────────────
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ApiDocsPage from './pages/ApiDocsPage';


function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed', bottom: 32, right: 28, zIndex: 9999,
        width: 44, height: 44, borderRadius: '50%',
        background: 'linear-gradient(135deg, #3B82F6, #0EA5E9)',
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(59,130,246,0.4)',
        transition: 'transform 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      title="Back to top"
    >
      ↑
    </button>
  );
}

export default function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adModal, setAdModal] = useState({ open: false, onComplete: null, fileName: '' });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        onOpenAuth={(mode) => { setAuthModalMode(mode); setAuthModalOpen(true); }}
        onOpenPricing={() => setPricingModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      <div className="side-ad-gutter side-ad-left"><AdSlot type="skyscraper" /></div>
      <div className="side-ad-gutter side-ad-right"><AdSlot type="skyscraper" /></div>

      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/jpg-to-png" replace />} />

        {/* ── Generic converter (user picks format manually) ── */}
        <Route path="/convert" element={<ConverterPage />} />
        <Route path="/converters" element={<ConvertersHubPage />} />

        {/* ── JPG conversions ── */}
        <Route path="/jpg-to-png"   element={<ConverterPage from="jpg" to="png"  />} />
        <Route path="/jpg-to-jpeg"  element={<ConverterPage from="jpg" to="jpeg" />} />
        <Route path="/jpg-to-webp"  element={<ConverterPage from="jpg" to="webp" />} />
        <Route path="/jpg-to-avif"  element={<ConverterPage from="jpg" to="avif" />} />
        <Route path="/jpg-to-gif"   element={<ConverterPage from="jpg" to="gif"  />} />
        <Route path="/jpg-to-bmp"   element={<ConverterPage from="jpg" to="bmp"  />} />
        <Route path="/jpg-to-pdf"   element={<ConverterPage from="jpg" to="pdf"  />} />
        <Route path="/jpg-to-ico"   element={<ConverterPage from="jpg" to="ico"  />} />

        {/* ── PNG conversions ── */}
        <Route path="/png-to-jpg"   element={<ConverterPage from="png" to="jpg"  />} />
        <Route path="/png-to-jpeg"  element={<ConverterPage from="png" to="jpeg" />} />
        <Route path="/png-to-webp"  element={<ConverterPage from="png" to="webp" />} />
        <Route path="/png-to-avif"  element={<ConverterPage from="png" to="avif" />} />
        <Route path="/png-to-gif"   element={<ConverterPage from="png" to="gif"  />} />
        <Route path="/png-to-bmp"   element={<ConverterPage from="png" to="bmp"  />} />
        <Route path="/png-to-pdf"   element={<ConverterPage from="png" to="pdf"  />} />
        <Route path="/png-to-ico"   element={<ConverterPage from="png" to="ico"  />} />

        {/* ── JPEG conversions ── */}
        <Route path="/jpeg-to-jpg"  element={<ConverterPage from="jpeg" to="jpg"  />} />
        <Route path="/jpeg-to-png"  element={<ConverterPage from="jpeg" to="png"  />} />
        <Route path="/jpeg-to-webp" element={<ConverterPage from="jpeg" to="webp" />} />
        <Route path="/jpeg-to-avif" element={<ConverterPage from="jpeg" to="avif" />} />
        <Route path="/jpeg-to-gif"  element={<ConverterPage from="jpeg" to="gif"  />} />
        <Route path="/jpeg-to-bmp"  element={<ConverterPage from="jpeg" to="bmp"  />} />
        <Route path="/jpeg-to-pdf"  element={<ConverterPage from="jpeg" to="pdf"  />} />
        <Route path="/jpeg-to-ico"  element={<ConverterPage from="jpeg" to="ico"  />} />

        {/* ── WEBP conversions ── */}
        <Route path="/webp-to-jpg"  element={<ConverterPage from="webp" to="jpg"  />} />
        <Route path="/webp-to-jpeg" element={<ConverterPage from="webp" to="jpeg" />} />
        <Route path="/webp-to-png"  element={<ConverterPage from="webp" to="png"  />} />
        <Route path="/webp-to-avif" element={<ConverterPage from="webp" to="avif" />} />
        <Route path="/webp-to-gif"  element={<ConverterPage from="webp" to="gif"  />} />
        <Route path="/webp-to-bmp"  element={<ConverterPage from="webp" to="bmp"  />} />
        <Route path="/webp-to-ico"  element={<ConverterPage from="webp" to="ico"  />} />

        {/* ── AVIF conversions ── */}
        <Route path="/avif-to-jpg"  element={<ConverterPage from="avif" to="jpg"  />} />
        <Route path="/avif-to-jpeg" element={<ConverterPage from="avif" to="jpeg" />} />
        <Route path="/avif-to-png"  element={<ConverterPage from="avif" to="png"  />} />
        <Route path="/avif-to-webp" element={<ConverterPage from="avif" to="webp" />} />
        <Route path="/avif-to-ico"  element={<ConverterPage from="avif" to="ico"  />} />

        {/* ── GIF conversions ── */}
        <Route path="/gif-to-jpg"   element={<ConverterPage from="gif" to="jpg"  />} />
        <Route path="/gif-to-jpeg"  element={<ConverterPage from="gif" to="jpeg" />} />
        <Route path="/gif-to-png"   element={<ConverterPage from="gif" to="png"  />} />
        <Route path="/gif-to-webp"  element={<ConverterPage from="gif" to="webp" />} />
        <Route path="/gif-to-ico"   element={<ConverterPage from="gif" to="ico"  />} />

        {/* ── BMP conversions ── */}
        <Route path="/bmp-to-jpg"   element={<ConverterPage from="bmp" to="jpg"  />} />
        <Route path="/bmp-to-jpeg"  element={<ConverterPage from="bmp" to="jpeg" />} />
        <Route path="/bmp-to-png"   element={<ConverterPage from="bmp" to="png"  />} />
        <Route path="/bmp-to-webp"  element={<ConverterPage from="bmp" to="webp" />} />
        <Route path="/bmp-to-ico"   element={<ConverterPage from="bmp" to="ico"  />} />

        {/* ── HEIC / HEIF conversions (iPhone photos) ── */}
        <Route path="/heic-to-jpg"  element={<ConverterPage from="heic" to="jpg"  />} />
        <Route path="/heic-to-jpeg" element={<ConverterPage from="heic" to="jpeg" />} />
        <Route path="/heic-to-png"  element={<ConverterPage from="heic" to="png"  />} />
        <Route path="/heic-to-webp" element={<ConverterPage from="heic" to="webp" />} />
        <Route path="/heic-to-ico"  element={<ConverterPage from="heic" to="ico"  />} />
        <Route path="/heif-to-jpg"  element={<ConverterPage from="heif" to="jpg"  />} />
        <Route path="/heif-to-png"  element={<ConverterPage from="heif" to="png"  />} />

        {/* ── Tool pages ── */}
        <Route path="/compress"  element={<CompressPage />} />
        <Route path="/resize"    element={<ResizePage />} />
        <Route path="/filter"    element={<FilterPage />} />
        <Route path="/crop"      element={<CropPage />} />
        <Route path="/rotate"    element={<RotatePage />} />
        <Route path="/watermark" element={<WatermarkPage />} />
        <Route path="/name-date" element={<NameDatePage />} />
        <Route path="/merge"     element={<MergePage />} />

        {/* ── Legal & Docs dedicated pages ── */}
        <Route path="/privacy"  element={<PrivacyPage />} />
        <Route path="/terms"    element={<TermsPage />} />
        <Route path="/api-docs" element={<ApiDocsPage />} />
      </Routes>

      <SEOContentSection />
      <div style={{ padding: '0 24px 32px' }}><AdSlot type="leaderboard" /></div>
      <Footer />

      {/* Global Modals */}
      <AdInterstitialModal
        isOpen={adModal.open}
        onClose={() => setAdModal(m => ({ ...m, open: false }))}
        onAdComplete={adModal.onComplete || (() => {})}
        onOpenPricing={() => { setAdModal(m => ({ ...m, open: false })); setPricingModalOpen(true); }}
        fileName={adModal.fileName}
      />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
      <PricingModal
        isOpen={pricingModalOpen}
        onClose={() => setPricingModalOpen(false)}
        onOpenAuth={(mode) => { setAuthModalMode(mode); setAuthModalOpen(true); }}
      />
      <AdminPanelModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />
      <ScrollToTopButton />
    </div>
  );
}


// import React, { useState, useEffect } from 'react';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import UploadArea from './components/UploadArea';
// import FileCard from './components/FileCard';
// import ImagePreview from './components/ImagePreview';
// import InteractiveCropper from './components/InteractiveCropper';
// import AdSlot from './components/AdSlot';
// import AdInterstitialModal from './components/AdInterstitialModal';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import AuthModal from './components/auth/AuthModal';
// import PricingModal from './components/pricing/PricingModal';
// import AdminPanelModal from './components/admin/AdminPanelModal';
// import SEOHead from './components/seo/SEOHead';
// import SEOContentSection from './components/seo/SEOContentSection';


// import ConvertOptions from './components/controls/ConvertOptions';
// import CompressionSlider from './components/controls/CompressionSlider';
// import ResizeControls from './components/controls/ResizeControls';
// import FilterControls from './components/controls/FilterControls';
// import CropControls from './components/controls/CropControls';
// import RotateControls from './components/controls/RotateControls';
// import WatermarkControls from './components/controls/WatermarkControls';
// import NameDateControls from './components/controls/NameDateControls';
// import MergeControls from './components/controls/MergeControls';
// import DownloadButton from './components/controls/DownloadButton';

// import {
//   convertImage, compressImage, compressToTargetSize,
//   resizeImage, applyFilterToImage, cropImage, rotateAndFlipImage,
//   watermarkImage, addNameAndDate, mergeImages, downloadZip, loadImage,
// } from './lib/imageEngine';
// import { apiService } from './services/api';
// import { Trash2, ImageIcon, ArrowDown } from 'lucide-react';

// /* ── Tool metadata ─────────────────────────────── */
// const TOOL_HEADINGS = {
//   convert:   { h: 'Format Converter',      sub: 'Convert between JPG, PNG, WEBP, AVIF, GIF, PDF, DOCX and more' },
//   compress:  { h: 'Image Compressor',      sub: 'Shrink file size with quality control or target KB precision' },
//   resize:    { h: 'Image Resizer',          sub: 'Resize to exact dimensions, percentage scale, or target KB/MB file size' },
//   filter:    { h: 'Photo Filters & Color Effects', sub: 'Apply Black & White, Sepia Vintage, Invert, Warm Sunset, Cool Cyan, and Cyber Neon filters' },
//   crop:      { h: 'Image Cropper',          sub: 'Crop to any aspect ratio or custom pixel region' },
//   rotate:    { h: 'Rotate & Flip',          sub: 'Rotate 90° / 180° or flip on any axis' },
//   watermark: { h: 'Add Watermark',          sub: 'Overlay text or logo watermark with full control' },
//   nameDate:  { h: 'Name & Date Banner',     sub: 'Format candidate name & date of photo (DOP/DOB) for official exam & passport photos' },
//   merge:     { h: 'Merge Images',           sub: 'Combine multiple images side-by-side, stacked, or in a grid' },
// };

// export default function App() {
//   const { isPro, isAdFree, checkAuth } = useAuth();

//   /* Handle return from Razorpay full-page payment gateway redirect */
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const paymentStatus = params.get('payment');
//     const plan = params.get('plan');

//     if (paymentStatus === 'success') {
//       checkAuth();
//       alert(`🎉 Welcome to PicCraft Pro! Your ${plan === 'yearly' ? 'Pro Yearly' : 'Pro Monthly'} subscription is now active.`);
//       window.history.replaceState({}, document.title, window.location.pathname);
//     } else if (paymentStatus === 'failed' || paymentStatus === 'error') {
//       alert('❌ Payment was not completed or failed. Please try again.');
//       window.history.replaceState({}, document.title, window.location.pathname);
//     }
//   }, []);
//   const [activeTool, setActiveTool] = useState('convert');
//   const [items, setItems] = useState([]);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [previewIndex, setPreviewIndex] = useState(null); // index into `items`
//   const [useBackend, setUseBackend] = useState(false);
//   const [isBackendAvailable, setIsBackendAvailable] = useState(false);

//   /* Auth, Pricing, & Admin Modal state */
//   const [authModalOpen, setAuthModalOpen] = useState(false);
//   const [authModalMode, setAuthModalMode] = useState('login');
//   const [pricingModalOpen, setPricingModalOpen] = useState(false);
//   const [proLimitModalOpen, setProLimitModalOpen] = useState(false);
//   const [adminModalOpen, setAdminModalOpen] = useState(false);

//   // Ad interstitial state — queues a pending download behind an ad for free users
//   const [adModal, setAdModal] = useState({ open: false, onComplete: null, fileName: '' });

//   /* Tool states */
//   const [convertFormat, setConvertFormat] = useState('jpg');
//   const [convertQuality, setConvertQuality] = useState(0.85);
//   const [filterMode, setFilterMode] = useState('normal');

//   const [compressMode, setCompressMode] = useState('quality');
//   const [compressQuality, setCompressQuality] = useState(0.8);
//   const [compressTargetKB, setCompressTargetKB] = useState(100);
//   const [compressFormat, setCompressFormat] = useState('jpg');

//   const [resizeWidth, setResizeWidth] = useState(1920);
//   const [resizeHeight, setResizeHeight] = useState(1080);
//   const [maintainAspect, setMaintainAspect] = useState(true);
//   const [resizeMode, setResizeMode] = useState('dimensions'); // 'dimensions' | 'targetSize'
//   const [resizeTargetSize, setResizeTargetSize] = useState(100);
//   const [resizeTargetUnit, setResizeTargetUnit] = useState('KB');

//   const [cropRect, setCropRect] = useState({ x: 0, y: 0, width: 800, height: 600 });
//   const [rotation, setRotation] = useState(0);
//   const [flipH, setFlipH] = useState(false);
//   const [flipV, setFlipV] = useState(false);

//   const [watermarkConfig, setWatermarkConfig] = useState({
//     type: 'text', text: '© PicCraft', watermarkFile: null,
//     opacity: 0.7, fontSize: 42, color: '#ffffff', position: 'bottom-right',
//   });

//   const [nameDateConfig, setNameDateConfig] = useState({
//     name: 'JOHN DOE',
//     date: '01/01/2026',
//     datePrefix: '',
//     bannerBg: '#FFFFFF',
//     nameColor: '#000000',
//     dateColor: '#DC2626',
//     bannerRatio: 0.18,
//   });

//   const [mergeDirection, setMergeDirection] = useState('horizontal');
//   const [mergePadding, setMergePadding] = useState(12);
//   const [mergeBgColor, setMergeBgColor] = useState('#0f172a');
//   const [errorMessage, setErrorMessage] = useState('');

//   useEffect(() => {
//     apiService.checkBackendStatus().then(setIsBackendAvailable);
//   }, []);

//   /* ── File handling ── */
//   const handleFilesSelected = async (newFiles) => {
//     setErrorMessage('');
    
//     const validImageFiles = [];
//     const invalidFiles = [];
//     const oversizedFiles = [];
//     const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB limit

//     for (const f of newFiles) {
//       if (f.size > MAX_FILE_SIZE) {
//         oversizedFiles.push(f.name);
//       } else if (f.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|avif|bmp|svg|heic|heif)$/i.test(f.name)) {
//         validImageFiles.push(f);
//       } else {
//         invalidFiles.push(f.name);
//       }
//     }

//     if (oversizedFiles.length > 0) {
//       setErrorMessage(
//         `⚠️ File limit exceeded: "${oversizedFiles.slice(0, 2).join(', ')}${oversizedFiles.length > 2 ? '...' : ''}" exceeds the 10 MB per file limit.`
//       );
//     } else if (invalidFiles.length > 0) {
//       setErrorMessage(
//         `⚠️ Invalid file format: "${invalidFiles.slice(0, 2).join(', ')}${invalidFiles.length > 2 ? '...' : ''}". Please select supported image files (JPG, PNG, WEBP, GIF, AVIF, BMP).`
//       );
//     }

//     if (validImageFiles.length === 0) return;

//     // ⚡ Free Plan Batch Upload Limit Check (Max 5 images at a time for non-PRO users)
//     let filesToProcess = validImageFiles;
//     if (!isPro) {
//       const totalCombined = items.length + validImageFiles.length;
//       if (validImageFiles.length > 5 || totalCombined > 5) {
//         setProLimitModalOpen(true);
//         const allowedCount = Math.max(0, 5 - items.length);
//         if (allowedCount === 0) return;
//         filesToProcess = validImageFiles.slice(0, allowedCount);
//       }
//     }

//     const newItems = await Promise.all(
//       filesToProcess.map(async (file) => {
//         let width = 0, height = 0;
//         try { const img = await loadImage(file); width = img.naturalWidth; height = img.naturalHeight; } catch {}
//         return {
//           id: Math.random().toString(36).substring(2, 9),
//           file, previewUrl: URL.createObjectURL(file),
//           width, height, processedResult: null, status: 'idle',
//         };
//       })
//     );
//     setItems((prev) => [...prev, ...newItems]);
//     if (newItems[0]?.width > 0) {
//       setResizeWidth(newItems[0].width); setResizeHeight(newItems[0].height);
//       setCropRect({ x: 0, y: 0, width: newItems[0].width, height: newItems[0].height });
//     }
//   };

//   const handleRemoveItem = (id) => {
//     setItems((prev) => {
//       const item = prev.find(i => i.id === id);
//       if (item) {
//         URL.revokeObjectURL(item.previewUrl);
//         if (item.processedResult?.url) URL.revokeObjectURL(item.processedResult.url);
//       }
//       return prev.filter(i => i.id !== id);
//     });
//   };

//   const handleClearAll = () => {
//     items.forEach(i => {
//       URL.revokeObjectURL(i.previewUrl);
//       if (i.processedResult?.url) URL.revokeObjectURL(i.processedResult.url);
//     });
//     setItems([]);
//   };

//   /* ── Processing ── */
//   const processItemClientSide = async (item) => {
//     const formatToUse = activeTool === 'convert' ? convertFormat : '';

//     switch (activeTool) {
//       case 'convert':   return convertImage(item.file, convertFormat, convertQuality);
//       case 'filter':    return applyFilterToImage(item.file, filterMode);
//       case 'compress':
//         return compressMode === 'targetSize'
//           ? compressToTargetSize(item.file, compressTargetKB, compressFormat)
//           : compressImage(item.file, compressQuality, compressFormat);
//       case 'resize':
//         if (resizeMode === 'targetSize') {
//           const targetKB = resizeTargetUnit === 'MB' ? resizeTargetSize * 1024 : resizeTargetSize;
//           return compressToTargetSize(item.file, targetKB, formatToUse);
//         }
//         return resizeImage(item.file, resizeWidth, resizeHeight, maintainAspect, formatToUse);
//       case 'crop':      return cropImage(item.file, cropRect, formatToUse);
//       case 'rotate':    return rotateAndFlipImage(item.file, rotation, flipH, flipV, formatToUse);
//       case 'watermark': return watermarkImage(item.file, { ...watermarkConfig, format: formatToUse });
//       case 'nameDate':  return addNameAndDate(item.file, { ...nameDateConfig, format: formatToUse });
//       default:          return convertImage(item.file, formatToUse, convertQuality);
//     }
//   };

//   const handleProcessAll = async () => {
//     if (!items.length) return;
//     setIsProcessing(true);
//     try {
//       if (activeTool === 'merge') {
//         const files = items.map(i => i.file);
//         const totalInputSize = files.reduce((acc, f) => acc + f.size, 0);
//         const merged = await mergeImages(files, mergeDirection, mergePadding, mergeBgColor, convertFormat);
        
//         // Dummy file object representing total input size for stats calculation
//         const inputRefFile = { name: `Merged (${files.length} images)`, size: totalInputSize };

//         const mergedItem = {
//           id: Math.random().toString(36).substring(2, 9),
//           file: inputRefFile,
//           previewUrl: merged.url,
//           width: merged.width,
//           height: merged.height,
//           processedResult: {
//             file: merged.file,
//             url: merged.url,
//             width: merged.width,
//             height: merged.height,
//             size: merged.size
//           },
//           status: 'done'
//         };

//         setItems([mergedItem]);
//         setPreviewIndex(0); // Auto-open modal for merged result
//       } else {
//         const updated = [];
//         for (const item of items) {
//           let result;
//           if (useBackend && isBackendAvailable) {
//             if (activeTool === 'convert')  result = await apiService.convertImage(item.file, convertFormat, { quality: Math.round(convertQuality * 100) });
//             else if (activeTool === 'compress') result = await apiService.compressImage(item.file, Math.round(compressQuality * 100), compressMode === 'targetSize' ? compressTargetKB : null);
//             else if (activeTool === 'resize')   result = await apiService.resizeImage(item.file, resizeWidth, resizeHeight, maintainAspect);
//             else result = await processItemClientSide(item);
//           } else {
//             result = await processItemClientSide(item);
//           }
//           updated.push({ ...item, status: 'done', processedResult: result });
//         }
//         setItems(updated);
//         if (updated.length > 0 && updated[0].processedResult) {
//           setPreviewIndex(0); // Auto-open modal for first processed output
//         }
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   /**
//    * Fires the actual file download — used directly by PRO users
//    * and as the onAdComplete callback for free users.
//    */
//   const doDownloadSingle = (item) => {
//     if (!item.processedResult?.url) return;
//     const a = document.createElement('a');
//     a.href = item.processedResult.url;
//     a.download = item.processedResult.file?.name || item.file.name;
//     a.click();
//   };

//   const doDownloadZip = () => {
//     const valid = items.map(i => i.processedResult).filter(r => r?.file);
//     if (valid.length) downloadZip(valid, `piccraft_${activeTool}_batch.zip`);
//   };

//   /**
//    * Ad-gated download handlers.
//    * PRO users → download immediately.
//    * Free users → show the interstitial ad, then download after countdown.
//    */
//   const handleDownloadSingle = (item) => {
//     if (!item.processedResult?.url) return;
//     if (isPro || isAdFree) {
//       doDownloadSingle(item);
//     } else {
//       setAdModal({
//         open: true,
//         onComplete: () => doDownloadSingle(item),
//         fileName: item.processedResult.file?.name || item.file.name,
//       });
//     }
//   };

//   const handleDownloadZip = () => {
//     if (isPro || isAdFree) {
//       doDownloadZip();
//     } else {
//       setAdModal({
//         open: true,
//         onComplete: () => doDownloadZip(),
//         fileName: `piccraft_${activeTool}_batch.zip`,
//       });
//     }
//   };

//   const firstItem = items[0];
//   const { h: toolHeading, sub: toolSub } = TOOL_HEADINGS[activeTool] || {};
//   const processedCount = items.filter(i => i.processedResult).length;

//   return (
//     <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
//       {/* ── Dynamic SEO & Metadata Manager ── */}
//       <SEOHead activeTab={activeTool} />

//       {/* ── Navbar ── */}
//       <Navbar
//         activeTool={activeTool}
//         setActiveTool={setActiveTool}
//         onOpenAuth={(mode) => {
//           setAuthModalMode(mode);
//           setAuthModalOpen(true);
//         }}
//         onOpenPricing={() => setPricingModalOpen(true)}
//         onOpenAdmin={() => setAdminModalOpen(true)}
//       />

//       {/* ── Left & Right Side Gutter Skyscraper Ad Units (160x600) ── */}
//       <div className="side-ad-gutter side-ad-left">
//         <AdSlot type="skyscraper" />
//       </div>
//       <div className="side-ad-gutter side-ad-right">
//         <AdSlot type="skyscraper" />
//       </div>

//       {/* ── Main Workspace ── */}
//       <main className="main-content" style={{ flex: 1, maxWidth: 1280, margin: '0 auto', width: '100%', padding: '40px 24px' }}>

//         {/* Page title */}
//         <div className="page-title-area" style={{ marginBottom: 36, textAlign: 'center' }}>
//           <h1 style={{
//             fontFamily: 'var(--font-head)',
//             fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
//             letterSpacing: '-0.03em', color: 'var(--text-1)', marginBottom: 10,
//           }}>
//             <span className="grad-text">{toolHeading}</span>
//           </h1>
//           <p style={{ fontSize: '0.95rem', color: 'var(--text-3)', maxWidth: 500, margin: '0 auto' }}>
//             {toolSub}
//           </p>
//         </div>

//         {/* Two-column layout */}
//         <div className="workspace-grid" style={{
//           display: 'grid',
//           gridTemplateColumns: items.length ? '1fr 380px' : '1fr',
//           gap: 24,
//           alignItems: 'start',
//           transition: 'grid-template-columns 0.3s ease',
//         }}>

//           {/* ── Left: Upload + File list ── */}
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

//             {/* Upload zone */}
//             <UploadArea onFilesSelected={handleFilesSelected} hasFiles={items.length > 0} />

//             {/* ── Live Image Preview Panel ── */}
//             {items.length > 0 && firstItem && (
//               <div style={{
//                 borderRadius: 20,
//                 overflow: 'hidden',
//                 background: 'var(--bg-card)',
//                 border: '1px solid var(--border)',
//                 backdropFilter: 'blur(20px)',
//                 WebkitBackdropFilter: 'blur(20px)',
//                 boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
//               }}>
//                 {/* Preview header bar */}
//                 <div style={{
//                   display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//                   padding: '12px 18px',
//                   background: 'rgba(99,102,241,0.08)',
//                   borderBottom: '1px solid var(--border)',
//                 }}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                     <div style={{
//                       width: 8, height: 8, borderRadius: '50%',
//                       background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
//                       boxShadow: '0 0 8px rgba(99,102,241,0.6)',
//                     }} />
//                     <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-2)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
//                       Image Preview
//                     </span>
//                     <span style={{
//                       background: 'rgba(99,102,241,0.18)',
//                       color: 'var(--primary-light)',
//                       fontSize: '0.72rem',
//                       fontWeight: 700,
//                       padding: '2px 10px',
//                       borderRadius: 99,
//                       border: '1px solid rgba(99,102,241,0.25)',
//                     }}>
//                       {TOOL_HEADINGS[activeTool]?.h || activeTool}
//                     </span>
//                   </div>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                     {firstItem.width && firstItem.height && (
//                       <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 600 }}>
//                         {firstItem.width} &times; {firstItem.height}px
//                       </span>
//                     )}
//                     {items.length > 1 && (
//                       <span style={{
//                         background: 'rgba(16,185,129,0.15)',
//                         color: '#34d399',
//                         fontSize: '0.72rem',
//                         fontWeight: 700,
//                         padding: '2px 8px',
//                         borderRadius: 99,
//                         border: '1px solid rgba(16,185,129,0.25)',
//                       }}>
//                         +{items.length - 1} more
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Image display area */}
//                 <div style={{
//                   position: 'relative',
//                   width: '100%',
//                   minHeight: 260,
//                   maxHeight: 420,
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   background: 'repeating-conic-gradient(rgba(255,255,255,0.025) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px',
//                   overflow: 'hidden',
//                 }}>
//                   <img
//                     src={firstItem.processedResult?.url || firstItem.previewUrl}
//                     alt={firstItem.file?.name}
//                     style={{
//                       maxWidth: '100%',
//                       maxHeight: 420,
//                       objectFit: 'contain',
//                       display: 'block',
//                       borderRadius: 4,
//                       filter: activeTool === 'filter' ? ({
//                         grayscale: 'grayscale(1)',
//                         sepia: 'sepia(0.75)',
//                         invert: 'invert(1)',
//                         warm: 'saturate(1.4) hue-rotate(-15deg) brightness(1.05)',
//                         cool: 'saturate(0.9) hue-rotate(20deg) brightness(0.95)',
//                         neon: 'saturate(2.5) contrast(1.3) brightness(1.1)',
//                       })[filterMode] || 'none' : 'none',
//                       transform: activeTool === 'rotate'
//                         ? `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`
//                         : 'none',
//                       transition: 'transform 0.35s ease, filter 0.3s ease',
//                     }}
//                   />

//                   {/* Processing spinner overlay */}
//                   {isProcessing && (
//                     <div style={{
//                       position: 'absolute', inset: 0,
//                       background: 'rgba(15,23,42,0.65)',
//                       display: 'flex', flexDirection: 'column',
//                       alignItems: 'center', justifyContent: 'center', gap: 14,
//                       backdropFilter: 'blur(4px)',
//                     }}>
//                       <div style={{
//                         width: 44, height: 44, borderRadius: '50%',
//                         border: '3px solid rgba(99,102,241,0.25)',
//                         borderTopColor: 'var(--primary-light)',
//                         animation: 'spin 0.8s linear infinite',
//                       }} />
//                       <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c7d2fe' }}>Processing…</span>
//                     </div>
//                   )}

//                   {/* Ready badge */}
//                   {firstItem.status === 'done' && firstItem.processedResult && (
//                     <div style={{
//                       position: 'absolute', top: 12, right: 12,
//                       background: 'rgba(16,185,129,0.9)',
//                       color: '#fff',
//                       fontSize: '0.72rem', fontWeight: 800,
//                       padding: '4px 12px', borderRadius: 99,
//                       backdropFilter: 'blur(8px)',
//                       boxShadow: '0 2px 12px rgba(16,185,129,0.4)',
//                     }}>
//                       ✓ Ready to Download
//                     </div>
//                   )}
//                 </div>

//                 {/* Footer meta bar */}
//                 <div style={{
//                   display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//                   padding: '10px 18px',
//                   borderTop: '1px solid var(--border)',
//                   background: 'rgba(255,255,255,0.02)',
//                   gap: 8,
//                 }}>
//                   <span style={{
//                     fontSize: '0.8rem', color: 'var(--text-3)',
//                     whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '60%',
//                     fontWeight: 600,
//                   }} title={firstItem.file?.name}>
//                     📄 {firstItem.file?.name}
//                   </span>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
//                     <span style={{ fontSize: '0.78rem', color: 'var(--text-3)', fontWeight: 600 }}>
//                       {firstItem.file?.size ? (firstItem.file.size / 1024).toFixed(1) + ' KB' : ''}
//                     </span>
//                     {firstItem.processedResult?.size && (
//                       <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700 }}>
//                         → {(firstItem.processedResult.size / 1024).toFixed(1)} KB
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Error Message Banner */}
//             {errorMessage && (
//               <div style={{
//                 padding: '12px 16px',
//                 borderRadius: 12,
//                 background: '#FEF2F2',
//                 border: '1px solid #FECACA',
//                 color: '#991B1B',
//                 fontSize: '0.85rem',
//                 fontWeight: 600,
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 gap: 12,
//               }}>
//                 <span>{errorMessage}</span>
//                 <button
//                   onClick={() => setErrorMessage('')}
//                   style={{
//                     background: 'transparent',
//                     border: 'none',
//                     color: '#991B1B',
//                     fontWeight: 700,
//                     cursor: 'pointer',
//                     fontSize: '1rem',
//                   }}
//                 >
//                   ✕
//                 </button>
//               </div>
//             )}

//             {/* Interactive Visual Cropper Overlay (When Crop tool is active) */}
//             {activeTool === 'crop' && items.length > 0 && (
//               <InteractiveCropper
//                 item={firstItem}
//                 cropRect={cropRect}
//                 setCropRect={setCropRect}
//               />
//             )}

//             {/* File workspace */}
//             {items.length > 0 && (
//               <div className="animate-in">
//                 {/* List header */}
//                 <div style={{
//                   display: 'flex', alignItems: 'center',
//                   justifyContent: 'space-between', marginBottom: 12,
//                 }}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                     <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-1)' }}>
//                       {items.length} Image{items.length !== 1 ? 's' : ''} Selected
//                     </span>
//                     {processedCount > 0 && (
//                       <span className="badge badge-emerald">{processedCount} processed</span>
//                     )}
//                   </div>

//                   <button
//                     onClick={handleClearAll}
//                     className="btn btn-danger btn-sm"
//                     style={{ gap: 6 }}
//                   >
//                     <Trash2 size={13} />
//                     Clear All
//                   </button>
//                 </div>

//                 {/* Cards */}
//                 <div style={{
//                   display: 'flex', flexDirection: 'column', gap: 8,
//                   maxHeight: 480, overflowY: 'auto', paddingRight: 4,
//                 }}>
//                   {items.map((item) => (
//                     <FileCard
//                       key={item.id}
//                       item={item}
//                       onRemove={handleRemoveItem}
//                       onPreview={(item) => setPreviewIndex(items.indexOf(item))}
//                       onDownloadSingle={handleDownloadSingle}
//                       isProcessing={isProcessing}
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}

//           </div>

//           {/* ── Right: Settings Panel ── */}
//           {items.length > 0 && (
//             <div className="settings-panel" style={{ position: 'sticky', top: 90, display: 'flex', flexDirection: 'column', gap: 16 }}>
//               <div style={{
//                 background: 'var(--bg-card)',
//                 backdropFilter: 'blur(20px)',
//                 WebkitBackdropFilter: 'blur(20px)',
//                 border: '1px solid var(--border)',
//                 borderRadius: 20,
//                 padding: 24,
//                 display: 'flex',
//                 flexDirection: 'column',
//                 gap: 24,
//               }}>

//                 {/* Tool-specific controls */}
//                 {activeTool === 'convert'   && <ConvertOptions format={convertFormat} setFormat={setConvertFormat} quality={convertQuality} setQuality={setConvertQuality} />}
//                 {activeTool === 'filter'    && <FilterControls filterMode={filterMode} setFilterMode={setFilterMode} />}
//                 {activeTool === 'compress'  && <CompressionSlider mode={compressMode} setMode={setCompressMode} quality={compressQuality} setQuality={setCompressQuality} targetKB={compressTargetKB} setTargetKB={setCompressTargetKB} format={compressFormat} setFormat={setCompressFormat} />}
//                 {activeTool === 'resize'    && (
//                   <ResizeControls
//                     width={resizeWidth} setWidth={setResizeWidth}
//                     height={resizeHeight} setHeight={setResizeHeight}
//                     maintainAspect={maintainAspect} setMaintainAspect={setMaintainAspect}
//                     originalWidth={firstItem?.width} originalHeight={firstItem?.height}
//                     resizeMode={resizeMode} setResizeMode={setResizeMode}
//                     targetFileSize={resizeTargetSize} setTargetFileSize={setResizeTargetSize}
//                     targetFileUnit={resizeTargetUnit} setTargetFileUnit={setResizeTargetUnit}
//                   />
//                 )}
//                 {activeTool === 'crop'      && <CropControls cropRect={cropRect} setCropRect={setCropRect} originalWidth={firstItem?.width} originalHeight={firstItem?.height} />}
//                 {activeTool === 'rotate'    && <RotateControls rotation={rotation} setRotation={setRotation} flipH={flipH} setFlipH={setFlipH} flipV={flipV} setFlipV={setFlipV} />}
//                 {activeTool === 'watermark' && <WatermarkControls watermarkConfig={watermarkConfig} setWatermarkConfig={setWatermarkConfig} />}
//                 {activeTool === 'nameDate'  && <NameDateControls nameDateConfig={nameDateConfig} setNameDateConfig={setNameDateConfig} />}
//                 {activeTool === 'merge'     && <MergeControls direction={mergeDirection} setDirection={setMergeDirection} padding={mergePadding} setPadding={setMergePadding} bgColor={mergeBgColor} setBgColor={setMergeBgColor} />}

//                 {/* Divider */}
//                 <hr className="divider" />

//                 {/* CTA Buttons */}
//                 <DownloadButton
//                   onProcessAll={handleProcessAll}
//                   onDownloadZip={handleDownloadZip}
//                   isProcessing={isProcessing}
//                   processedCount={processedCount}
//                   totalCount={items.length}
//                   activeTool={activeTool}
//                 />
//               </div>

//               {/* Sidebar Ad Unit (300x250 Medium Rectangle) */}
//               <AdSlot type="rectangle" />
//             </div>
//           )}

//         </div>

//         {/* ── Empty State ── */}
//         {items.length === 0 && (
//           <div style={{ textAlign: 'center', marginTop: 40, color: 'var(--text-3)' }}>
//             <ImageIcon size={36} style={{ margin: '0 auto 10px', opacity: 0.25 }} />
//             <p style={{ fontSize: '0.85rem' }}>Upload images above to get started</p>
//           </div>
//         )}

//       </main>

//       {/* ── Ad Interstitial Modal (free plan users only) ── */}
//       <AdInterstitialModal
//         isOpen={adModal.open}
//         onClose={() => setAdModal(m => ({ ...m, open: false }))}
//         onAdComplete={adModal.onComplete || (() => {})}
//         onOpenPricing={() => {
//           setAdModal(m => ({ ...m, open: false }));
//           setPricingModalOpen(true);
//         }}
//         fileName={adModal.fileName}
//       />

//       {/* ── Preview Modal ── */}
//       {previewIndex !== null && (
//         <ImagePreview
//           items={items}
//           currentIndex={previewIndex}
//           onNavigate={setPreviewIndex}
//           onClose={() => setPreviewIndex(null)}
//           onDownload={handleDownloadSingle}
//         />
//       )}

//       {/* ── PRO Plan Limit Warning Modal ── */}
//       {proLimitModalOpen && (
//         <div style={{
//           position: 'fixed', inset: 0, zIndex: 9999,
//           background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)',
//           display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
//         }}>
//           <div style={{
//             background: '#FFFFFF', borderRadius: 24, maxWidth: 460, width: '100%',
//             padding: 32, textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
//             position: 'relative', border: '1px solid #E2E8F0', animation: 'modalScale 0.25s ease',
//           }}>
//             <div style={{
//               width: 64, height: 64, borderRadius: '50%', background: '#FEF3C7',
//               color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center',
//               margin: '0 auto 16px auto', fontSize: 32, fontWeight: 900,
//             }}>
//               ⚡
//             </div>
//             <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.4rem', color: '#0F172A', marginBottom: 12 }}>
//               Free Plan Upload Limit
//             </h3>
//             <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, marginBottom: 24 }}>
//               You cannot add more than <strong>5 files at a time</strong> on the Free Plan. Upgrade to <strong>PRO Lifetime ($9.99)</strong> to process unlimited files (100+ at once)!
//             </p>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
//               <button
//                 onClick={() => {
//                   setProLimitModalOpen(false);
//                   setPricingModalOpen(true);
//                 }}
//                 style={{
//                   padding: '14px 24px', borderRadius: 14,
//                   background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
//                   color: '#FFFFFF', fontWeight: 800, fontSize: '0.95rem',
//                   border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)',
//                   transition: 'transform 0.15s ease',
//                 }}
//               >
//                 🚀 Upgrade to PRO Lifetime Now
//               </button>
//               <button
//                 onClick={() => setProLimitModalOpen(false)}
//                 style={{
//                   padding: '10px 20px', borderRadius: 12,
//                   background: 'transparent', color: '#64748B',
//                   fontWeight: 700, fontSize: '0.85rem', border: 'none', cursor: 'pointer',
//                 }}
//               >
//                 Continue with 5 Files (Free)
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Auth Modal ── */}
//       <AuthModal
//         isOpen={authModalOpen}
//         onClose={() => setAuthModalOpen(false)}
//         initialMode={authModalMode}
//       />

//       {/* ── Pricing Modal ── */}
//       <PricingModal
//         isOpen={pricingModalOpen}
//         onClose={() => setPricingModalOpen(false)}
//         onOpenAuth={(mode) => {
//           setAuthModalMode(mode);
//           setAuthModalOpen(true);
//         }}
//       />

//       {/* ── Admin Control Panel Modal ── */}
//       <AdminPanelModal
//         isOpen={adminModalOpen}
//         onClose={() => setAdminModalOpen(false)}
//       />

//       {/* ── SEO Keyword & Rich Snippets FAQ Section ── */}
//       <SEOContentSection />

//       {/* ── Bottom Leaderboard Ad Unit (728x90) ── */}
//       <div style={{ padding: '0 24px 32px' }}>
//         <AdSlot type="leaderboard" />
//       </div>

//       {/* ── Footer ── */}
//       <Footer />
//     </div>
//   );
// }
