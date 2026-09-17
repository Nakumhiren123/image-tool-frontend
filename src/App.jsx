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
// import ScrollToTop from './components/ScrollToTop';
import { useAuth } from './context/useAuth';

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

import ProfilePage from './pages/ProfilePage';

import AdminPanelPage from './pages/AdminPanelPage';

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
  const { isAdFree } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adModal, setAdModal] = useState({ open: false, onComplete: null, fileName: '' });
  const [redirectAfterAuth, setRedirectAfterAuth] = useState(null);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        onOpenAuth={(mode) => { setRedirectAfterAuth(null); setAuthModalMode(mode); setAuthModalOpen(true); }}
        onOpenPricing={() => setPricingModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {!isAdFree && <div className="side-ad-gutter side-ad-left"><AdSlot type="skyscraper" /></div>}
      {!isAdFree && <div className="side-ad-gutter side-ad-right"><AdSlot type="skyscraper" /></div>}

      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/jpg-to-png" replace />} />

        {/* ── Generic converter (user picks format manually) ── */}
        <Route path="/convert" element={<ConverterPage />} />
        <Route path="/converters" element={<ConvertersHubPage />} />

        {/* ── JPG conversions ── */}
        <Route path="/jpg-to-png" element={<ConverterPage from="jpg" to="png" />} />
        <Route path="/jpg-to-jpeg" element={<ConverterPage from="jpg" to="jpeg" />} />
        <Route path="/jpg-to-webp" element={<ConverterPage from="jpg" to="webp" />} />
        <Route path="/jpg-to-avif" element={<ConverterPage from="jpg" to="avif" />} />
        <Route path="/jpg-to-gif" element={<ConverterPage from="jpg" to="gif" />} />
        <Route path="/jpg-to-bmp" element={<ConverterPage from="jpg" to="bmp" />} />
        <Route path="/jpg-to-pdf" element={<ConverterPage from="jpg" to="pdf" />} />
        <Route path="/jpg-to-ico" element={<ConverterPage from="jpg" to="ico" />} />
        <Route path="/jpg-to-docx" element={<ConverterPage from="jpg" to="docx" />} />

        {/* ── PNG conversions ── */}
        <Route path="/png-to-jpg" element={<ConverterPage from="png" to="jpg" />} />
        <Route path="/png-to-jpeg" element={<ConverterPage from="png" to="jpeg" />} />
        <Route path="/png-to-webp" element={<ConverterPage from="png" to="webp" />} />
        <Route path="/png-to-avif" element={<ConverterPage from="png" to="avif" />} />
        <Route path="/png-to-gif" element={<ConverterPage from="png" to="gif" />} />
        <Route path="/png-to-bmp" element={<ConverterPage from="png" to="bmp" />} />
        <Route path="/png-to-pdf" element={<ConverterPage from="png" to="pdf" />} />
        <Route path="/png-to-ico" element={<ConverterPage from="png" to="ico" />} />
        <Route path="/png-to-docx" element={<ConverterPage from="png" to="docx" />} />

        {/* ── JPEG conversions ── */}
        <Route path="/jpeg-to-jpg" element={<ConverterPage from="jpeg" to="jpg" />} />
        <Route path="/jpeg-to-png" element={<ConverterPage from="jpeg" to="png" />} />
        <Route path="/jpeg-to-webp" element={<ConverterPage from="jpeg" to="webp" />} />
        <Route path="/jpeg-to-avif" element={<ConverterPage from="jpeg" to="avif" />} />
        <Route path="/jpeg-to-gif" element={<ConverterPage from="jpeg" to="gif" />} />
        <Route path="/jpeg-to-bmp" element={<ConverterPage from="jpeg" to="bmp" />} />
        <Route path="/jpeg-to-pdf" element={<ConverterPage from="jpeg" to="pdf" />} />
        <Route path="/jpeg-to-ico" element={<ConverterPage from="jpeg" to="ico" />} />
        <Route path="/jpeg-to-docx" element={<ConverterPage from="jpeg" to="docx" />} />


        {/* ── WEBP conversions ── */}
        <Route path="/webp-to-jpg" element={<ConverterPage from="webp" to="jpg" />} />
        <Route path="/webp-to-jpeg" element={<ConverterPage from="webp" to="jpeg" />} />
        <Route path="/webp-to-png" element={<ConverterPage from="webp" to="png" />} />
        <Route path="/webp-to-avif" element={<ConverterPage from="webp" to="avif" />} />
        <Route path="/webp-to-gif" element={<ConverterPage from="webp" to="gif" />} />
        <Route path="/webp-to-bmp" element={<ConverterPage from="webp" to="bmp" />} />
        <Route path="/webp-to-ico" element={<ConverterPage from="webp" to="ico" />} />
        <Route path="/webp-to-docx" element={<ConverterPage from="webp" to="docx" />} />
        <Route path="/webp-to-pdf" element={<ConverterPage from="webp" to="pdf" />} />

        {/* ── AVIF conversions ── */}
        <Route path="/avif-to-jpg" element={<ConverterPage from="avif" to="jpg" />} />
        <Route path="/avif-to-jpeg" element={<ConverterPage from="avif" to="jpeg" />} />
        <Route path="/avif-to-png" element={<ConverterPage from="avif" to="png" />} />
        <Route path="/avif-to-webp" element={<ConverterPage from="avif" to="webp" />} />
        <Route path="/avif-to-ico" element={<ConverterPage from="avif" to="ico" />} />

        {/* ── GIF conversions ── */}
        <Route path="/gif-to-jpg" element={<ConverterPage from="gif" to="jpg" />} />
        <Route path="/gif-to-jpeg" element={<ConverterPage from="gif" to="jpeg" />} />
        <Route path="/gif-to-png" element={<ConverterPage from="gif" to="png" />} />
        <Route path="/gif-to-webp" element={<ConverterPage from="gif" to="webp" />} />
        <Route path="/gif-to-ico" element={<ConverterPage from="gif" to="ico" />} />

        {/* ── BMP conversions ── */}
        <Route path="/bmp-to-jpg" element={<ConverterPage from="bmp" to="jpg" />} />
        <Route path="/bmp-to-jpeg" element={<ConverterPage from="bmp" to="jpeg" />} />
        <Route path="/bmp-to-png" element={<ConverterPage from="bmp" to="png" />} />
        <Route path="/bmp-to-webp" element={<ConverterPage from="bmp" to="webp" />} />
        <Route path="/bmp-to-ico" element={<ConverterPage from="bmp" to="ico" />} />

        {/* ── HEIC / HEIF conversions (iPhone photos) ── */}
        <Route path="/heic-to-jpg" element={<ConverterPage from="heic" to="jpg" />} />
        <Route path="/heic-to-jpeg" element={<ConverterPage from="heic" to="jpeg" />} />
        <Route path="/heic-to-png" element={<ConverterPage from="heic" to="png" />} />
        <Route path="/heic-to-webp" element={<ConverterPage from="heic" to="webp" />} />
        <Route path="/heic-to-ico" element={<ConverterPage from="heic" to="ico" />} />
        <Route path="/heif-to-jpg" element={<ConverterPage from="heif" to="jpg" />} />
        <Route path="/heif-to-png" element={<ConverterPage from="heif" to="png" />} />

        {/* ── Tool pages ── */}
        <Route path="/compress" element={<CompressPage />} />
        <Route path="/resize" element={<ResizePage />} />
        <Route path="/filter" element={<FilterPage />} />
        <Route path="/crop" element={<CropPage />} />
        <Route path="/rotate" element={<RotatePage />} />
        <Route path="/watermark" element={<WatermarkPage />} />
        <Route path="/name-date" element={<NameDatePage />} />
        <Route path="/merge" element={<MergePage />} />

        {/* ── Legal & Docs dedicated pages ── */}
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/api-docs" element={<ApiDocsPage />} />

        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/admin" element={<AdminPanelPage />} />
      </Routes>

      <SEOContentSection />

      {!isAdFree && <div style={{ padding: '0 24px 32px' }}><AdSlot type="leaderboard" /></div>}
      <Footer />

      {/* Global Modals */}
      <AdInterstitialModal
        isOpen={adModal.open}
        onClose={() => setAdModal(m => ({ ...m, open: false }))}
        onAdComplete={adModal.onComplete || (() => { })}
        onOpenPricing={() => { setAdModal(m => ({ ...m, open: false })); setPricingModalOpen(true); }}
        fileName={adModal.fileName}
      />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={() => {
          if (redirectAfterAuth) {
            setRedirectAfterAuth(null);
            setPricingModalOpen(true);
          }
        }}
      />
      <PricingModal
        isOpen={pricingModalOpen}
        onClose={() => setPricingModalOpen(false)}
        onOpenAuth={(mode, planId) => {
          setRedirectAfterAuth(planId || 'pricing');
          setPricingModalOpen(false);
          setAuthModalMode(mode);
          setAuthModalOpen(true);
        }}
      />
      <AdminPanelModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />
      <ScrollToTopButton />
    </div>
  );
}
