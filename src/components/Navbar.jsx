// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Image, Layers, Minimize2, Maximize2, Crop, RotateCw, Type, Grid, UserCheck, Palette, Menu, X, LogIn, LogOut, User as UserIcon, Crown, ChevronDown, ArrowRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getConvertersGrouped, FORMAT_COLORS } from '../config/converters';
import ScrollToTop from './ScrollToTop';

// ── Format group order in dropdown ──
const FORMAT_ORDER = ['JPG', 'PNG', 'JPEG', 'WEBP', 'AVIF', 'GIF', 'BMP', 'HEIC'];
const GROUPED = getConvertersGrouped();

const tools = [
  { id: 'convert', name: 'Convert', icon: Layers, path: '/jpg-to-png', hasDropdown: true },
  { id: 'compress', name: 'Compress', icon: Minimize2, path: '/compress' },
  { id: 'resize', name: 'Resize', icon: Maximize2, path: '/resize' },
  { id: 'filter', name: 'Filters', icon: Palette, path: '/filter' },
  { id: 'crop', name: 'Crop', icon: Crop, path: '/crop' },
  { id: 'rotate', name: 'Rotate', icon: RotateCw, path: '/rotate' },
  { id: 'watermark', name: 'Watermark', icon: Type, path: '/watermark' },
  { id: 'nameDate', name: 'Name & Date', icon: UserCheck, path: '/name-date' },
  { id: 'merge', name: 'Merge', icon: Grid, path: '/merge' },
];

// ── Convert Dropdown — rendered via Portal to escape navbar overflow:hidden ──
function ConvertDropdown({ onClose, triggerRef, dropdownPortalRef }) {
  const navigate = useNavigate();
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  // Calculate position from the trigger button's screen location
  React.useEffect(() => {
    if (triggerRef?.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX + rect.width / 2,
      });
    }
  }, [triggerRef]);

  const handleClick = (slug) => {
    navigate(`/${slug}`);
    onClose();
  };

  return createPortal(
    <div ref={dropdownPortalRef} style={{
      position: 'absolute',
      top: position.top,
      left: position.left,
      transform: 'translateX(-50%)',
      width: 680,
      maxHeight: '70vh',
      overflowY: 'auto',
      background: '#fff',
      borderRadius: 16,
      border: '1px solid #E2E8F0',
      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      zIndex: 99999,
      padding: 20,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <p style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>All Image Converters</p>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B', marginTop: 2 }}>46 conversion pairs available</p>
        </div>
        <Link
          to="/converters"
          onClick={onClose}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '6px 14px', borderRadius: 8,
            background: 'linear-gradient(135deg, #6366F1, #818CF8)',
            color: '#fff', fontWeight: 700, fontSize: '0.78rem',
            textDecoration: 'none',
          }}
        >
          View All <ArrowRight size={12} />
        </Link>
      </div>

      {/* Format groups */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {FORMAT_ORDER.map(groupKey => {
          const converters = GROUPED[groupKey] || [];
          if (!converters.length) return null;
          const colors = FORMAT_COLORS[groupKey.toLowerCase()] || { bg: '#EDE9FE', color: '#7C3AED' };

          return (
            <div key={groupKey}>
              {/* Group label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{
                  padding: '2px 10px', borderRadius: 6,
                  background: colors.color, color: '#fff',
                  fontWeight: 900, fontSize: '0.7rem', fontFamily: 'monospace',
                }}>
                  {groupKey}
                </span>
                <div style={{ flex: 1, height: 1, background: '#F1F5F9' }} />
              </div>

              {/* Converter pill buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {converters.map(c => {
                  const toColors = FORMAT_COLORS[c.to] || { bg: '#EDE9FE', color: '#7C3AED' };
                  return (
                    <button
                      key={c.slug}
                      onClick={() => handleClick(c.slug)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        padding: '5px 10px', borderRadius: 8,
                        background: '#F8FAFD', border: '1px solid #E2E8F0',
                        cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700,
                        color: '#334155', transition: 'all 0.12s ease', whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = colors.bg;
                        e.currentTarget.style.borderColor = colors.color + '44';
                        e.currentTarget.style.color = colors.color;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = '#F8FAFD';
                        e.currentTarget.style.borderColor = '#E2E8F0';
                        e.currentTarget.style.color = '#334155';
                      }}
                    >
                      <span style={{ color: colors.color, fontWeight: 900 }}>{c.from.toUpperCase()}</span>
                      <ArrowRight size={10} color="#94A3B8" />
                      <span style={{ color: toColors.color, fontWeight: 900 }}>{c.to.toUpperCase()}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>,
    document.body // ← renders outside navbar, escapes overflow:hidden
  );
}

export default function Navbar({ onOpenAuth, onOpenPricing, onOpenAdmin }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileConverterOpen, setMobileConverterOpen] = useState(false); // ← ADD THIS
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const dropdownPortalRef = useRef(null);
  const { user, logoutUser, isPro } = useAuth();
  const location = useLocation();
  const navigate = useNavigate(); // ← ADD THIS

  // Detect active tool from current URL
  const activeTool = tools.find(t => location.pathname.startsWith(t.path))?.id
    || (location.pathname.includes('-to-') ? 'convert' : 'convert');

  // Close dropdown when clicking outside
  // Must check BOTH the trigger wrapper AND the portal dropdown div
  useEffect(() => {
    const handler = (e) => {
      const clickedInsideTrigger = dropdownRef.current?.contains(e.target);
      const clickedInsidePortal = dropdownPortalRef.current?.contains(e.target);
      if (!clickedInsideTrigger && !clickedInsidePortal) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close dropdown and mobile menu on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  const getInitials = (name = '') =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <header className="navbar-header">

      <ScrollToTop />

      {/* ── Main Row ── */}
      <div className="navbar-row">

        {/* Logo */}
        <div className="navbar-logo">
          <div className="navbar-logo-icon">
            <Image size={18} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span className="grad-text navbar-brand">PicCraft</span>
              {isPro && <span className="badge badge-indigo" style={{ padding: '2px 6px', fontSize: '0.6rem' }}>PRO</span>}
            </div>
            <p className="navbar-tagline">All-in-One Toolbox</p>
          </div>
        </div>

        {/* Desktop Tool Tabs */}
        <nav className="navbar-tools-desktop">
          {tools.map(({ id, name, icon: Icon, path, hasDropdown }) => {

            // ── Convert tab with dropdown ──
            if (hasDropdown) {
              return (
                <div key={id} ref={dropdownRef} style={{ position: 'relative' }}>
                  <button
                    ref={triggerRef}
                    onClick={() => setDropdownOpen(v => !v)}
                    className={`tool-tab${activeTool === id ? ' active' : ''}`}
                    style={{
                      flexShrink: 0, padding: '6px 9px', borderRadius: 8,
                      fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap',
                      display: 'flex', alignItems: 'center', gap: 5,
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      color: 'inherit',
                    }}
                  >
                    <Icon size={13} />
                    <span>{name}</span>
                    <ChevronDown
                      size={11}
                      style={{ transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </button>

                  {dropdownOpen && (
                    <ConvertDropdown
                      onClose={() => setDropdownOpen(false)}
                      triggerRef={triggerRef}
                      dropdownPortalRef={dropdownPortalRef}
                    />
                  )}
                </div>
              );
            }

            // ── Regular tabs ──
            return (
              <Link
                key={id}
                to={path}
                className={`tool-tab${activeTool === id ? ' active' : ''}`}
                style={{
                  flexShrink: 0, padding: '6px 9px', borderRadius: 8,
                  fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap',
                  display: 'flex', alignItems: 'center', gap: 5,
                  textDecoration: 'none', color: 'inherit',
                }}
              >
                <Icon size={13} />
                <span>{name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="navbar-right">

          {/* Admin Panel Button */}
          {user?.is_admin && (
            <button
              onClick={onOpenAdmin}
              className="btn btn-ghost btn-sm"
              style={{ borderRadius: 9, padding: '5px 10px', fontSize: '0.76rem', fontWeight: 800, background: '#F5F3FF', color: '#7C3AED', border: '1px solid #DDD6FE' }}
              title="Admin Control Panel"
            >
              👑 Admin Panel
            </button>
          )}

          {/* PRO Button */}
          {!isPro && (
            <button onClick={onOpenPricing} className="navbar-pro-btn">
              <Crown size={13} fill="#fff" />
              <span>PRO</span>
            </button>
          )}

          {/* Desktop auth */}
          <div className="navbar-auth-desktop">
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px 4px 5px', borderRadius: 99, background: '#F1F5F9', border: '1px solid #E2E8F0' }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#fff', fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {getInitials(user.name)}
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name}
                  </span>
                </div>
                <button onClick={logoutUser} className="btn btn-ghost btn-sm" style={{ padding: '6px 9px', borderRadius: 8 }} title="Sign Out">
                  <LogOut size={13} color="#64748B" />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button onClick={() => onOpenAuth('login')} className="btn btn-ghost btn-sm" style={{ borderRadius: 9, padding: '6px 11px', fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                  <LogIn size={13} color="#3B82F6" />
                  <span>Sign In</span>
                </button>
                <button onClick={() => onOpenAuth('register')} className="btn btn-primary btn-sm" style={{ borderRadius: 9, padding: '7px 13px', fontWeight: 800, fontSize: '0.78rem', boxShadow: '0 3px 12px rgba(59,130,246,0.3)', whiteSpace: 'nowrap' }}>
                  <UserIcon size={13} />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>

          {/* Hamburger — mobile only */}
          <button className="navbar-hamburger" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu">
            {menuOpen ? <X size={20} color="#334155" /> : <Menu size={20} color="#334155" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu Dropdown ── */}
      {menuOpen && (
        <div className="navbar-mobile-menu">

          {/* Convert hub link — mobile */}
          <Link
            to="/converters"
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', borderRadius: 12, marginBottom: 8,
              background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
              border: '1px solid #C7D2FE', textDecoration: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Layers size={16} color="#6366F1" />
              <div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: '0.85rem', color: '#4338CA' }}>All Image Converters</p>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#6366F1' }}>46 conversion pairs</p>
              </div>
            </div>
            <ArrowRight size={14} color="#6366F1" />
          </Link>

          {/* 3x3 tool grid on mobile */}
          <div className="navbar-mobile-tools-grid">
            {tools.map(({ id, name, icon: Icon, path, hasDropdown }) => {

              // Convert button — toggles mobile converter list
              if (hasDropdown) {
                return (
                  <button
                    key={id}
                    onClick={() => setMobileConverterOpen(v => !v)}
                    className={`navbar-mobile-tool-btn${activeTool === id ? ' active' : ''}`}
                  >
                    <Icon size={18} />
                    <span>{name}</span>
                    <ChevronDown
                      size={11}
                      style={{ transition: 'transform 0.2s', transform: mobileConverterOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </button>
                );
              }

              return (
                <Link
                  key={id}
                  to={path}
                  onClick={() => setMenuOpen(false)}
                  className={`navbar-mobile-tool-btn${activeTool === id ? ' active' : ''}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Icon size={18} />
                  <span>{name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile converter list — expands below grid */}
          {mobileConverterOpen && (
            <div style={{
              marginTop: 10, padding: 14,
              background: '#F8FAFD', borderRadius: 14,
              border: '1px solid #E2E8F0',
              maxHeight: 360, overflowY: 'auto',
              display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              {FORMAT_ORDER.map(groupKey => {
                const converters = GROUPED[groupKey] || [];
                if (!converters.length) return null;
                const colors = FORMAT_COLORS[groupKey.toLowerCase()] || { bg: '#EDE9FE', color: '#7C3AED' };
                return (
                  <div key={groupKey}>
                    {/* Group label */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: 6,
                        background: colors.color, color: '#fff',
                        fontWeight: 900, fontSize: '0.65rem', fontFamily: 'monospace',
                      }}>
                        {groupKey}
                      </span>
                      <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
                    </div>
                    {/* Converter pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {converters.map(c => {
                        const toColors = FORMAT_COLORS[c.to] || { bg: '#EDE9FE', color: '#7C3AED' };
                        return (
                          <button
                            key={c.slug}
                            onClick={() => { navigate(`/${c.slug}`); setMenuOpen(false); setMobileConverterOpen(false); }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 4,
                              padding: '4px 8px', borderRadius: 6,
                              background: '#fff', border: '1px solid #E2E8F0',
                              cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700,
                              color: '#334155',
                            }}
                          >
                            <span style={{ color: colors.color, fontWeight: 900 }}>{c.from.toUpperCase()}</span>
                            <ArrowRight size={9} color="#94A3B8" />
                            <span style={{ color: toColors.color, fontWeight: 900 }}>{c.to.toUpperCase()}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Auth row in mobile menu */}
          <div className="navbar-mobile-auth-row">
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#fff', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {getInitials(user.name)}
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A' }}>{user.name}</span>
                </div>
                <button onClick={logoutUser} className="btn btn-ghost btn-sm" style={{ gap: 5, borderRadius: 8 }}>
                  <LogOut size={14} color="#64748B" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => { onOpenAuth('login'); setMenuOpen(false); }} className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center', borderRadius: 9, padding: '9px 12px', fontWeight: 700 }}>
                  <LogIn size={15} color="#3B82F6" />
                  <span>Sign In</span>
                </button>
                <button onClick={() => { onOpenAuth('register'); setMenuOpen(false); }} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center', borderRadius: 9, padding: '9px 12px', fontWeight: 800, boxShadow: '0 3px 12px rgba(59,130,246,0.3)' }}>
                  <UserIcon size={15} />
                  <span>Sign Up</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </header>
  );
}

// import React, { useState } from 'react';
// import { Image, Layers, Minimize2, Maximize2, Crop, RotateCw, Type, Grid, UserCheck, Palette, Menu, X, LogIn, LogOut, User as UserIcon, Crown } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

// const tools = [
//   { id: 'convert', name: 'Convert', icon: Layers },
//   { id: 'compress', name: 'Compress', icon: Minimize2 },
//   { id: 'resize', name: 'Resize', icon: Maximize2 },
//   { id: 'filter', name: 'Filters', icon: Palette },
//   { id: 'crop', name: 'Crop', icon: Crop },
//   { id: 'rotate', name: 'Rotate', icon: RotateCw },
//   { id: 'watermark', name: 'Watermark', icon: Type },
//   { id: 'nameDate', name: 'Name & Date', icon: UserCheck },
//   { id: 'merge', name: 'Merge', icon: Grid },
// ];

// const toolDescriptions = {
//   convert: '🔄 Convert between JPG, PNG, WEBP, AVIF, GIF, PDF, DOCX and more — fast, lossless, right in your browser',
//   compress: '📦 Reduce file size while keeping quality — or compress to an exact target KB',
//   resize: '📐 Resize images to exact pixel dimensions, percentage scale, or target KB/MB file size',
//   filter: '🎨 Apply Black & White, Sepia, Invert, Warm Sunset, Cool Cyan, and Cyber Neon filters to your photos',
//   crop: '✂️ Crop to aspect ratio presets or custom pixel region',
//   rotate: '🔁 Rotate 90° / 180° or flip horizontally & vertically',
//   watermark: '🔏 Add text or logo watermark with custom opacity, size & position',
//   nameDate: '🪪 Add Candidate Name & Date banner (DOP/DOB) for official passport & exam photos',
//   merge: '🖼️ Merge multiple images side-by-side, stacked, or in a grid collage',
// };

// export default function Navbar({ activeTool, setActiveTool, onOpenAuth, onOpenPricing, onOpenAdmin }) {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const { user, logoutUser, isPro } = useAuth();

//   const handleToolSelect = (id) => {
//     setActiveTool(id);
//     setMenuOpen(false);
//   };

//   const getInitials = (name = '') =>
//     name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

//   return (
//     <header className="navbar-header">

//       {/* ── Main Row ── */}
//       <div className="navbar-row">

//         {/* Logo */}
//         <div className="navbar-logo">
//           <div className="navbar-logo-icon">
//             <Image size={18} color="#fff" />
//           </div>
//           <div>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
//               <span className="grad-text navbar-brand">PicCraft</span>
//               {isPro && <span className="badge badge-indigo" style={{ padding: '2px 6px', fontSize: '0.6rem' }}>PRO</span>}
//             </div>
//             <p className="navbar-tagline">All-in-One Toolbox</p>
//           </div>
//         </div>

//         {/* Logo */}
//         {/* <div className="navbar-logo"> */}
//         {/* Replace icon container with your custom image logo */}
//         {/* <img
//             src="/logo.svg"
//             alt="Logo"
//             style={{ width: 32, height: 32, objectFit: 'contain' }}
//           />
//           <div>
//             <span className="grad-text navbar-brand">YourNewName</span>
//             <p className="navbar-tagline">All-in-One Toolbox</p>
//           </div>
//         </div> */}


//         {/* Desktop Tool Tabs */}
//         <nav className="navbar-tools-desktop">
//           {tools.map(({ id, name, icon: Icon }) => (
//             <button
//               key={id}
//               onClick={() => handleToolSelect(id)}
//               className={`tool-tab${activeTool === id ? ' active' : ''}`}
//               style={{ flexShrink: 0, padding: '6px 9px', borderRadius: 8, fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 5 }}
//             >
//               <Icon size={13} />
//               <span>{name}</span>
//             </button>
//           ))}
//         </nav>

//         {/* Right Side */}
//         <div className="navbar-right">

//           {/* Admin Panel Button — for Admin users */}
//           {user?.is_admin && (
//             <button
//               onClick={onOpenAdmin}
//               className="btn btn-ghost btn-sm"
//               style={{ borderRadius: 9, padding: '5px 10px', fontSize: '0.76rem', fontWeight: 800, background: '#F5F3FF', color: '#7C3AED', border: '1px solid #DDD6FE' }}
//               title="Admin Control Panel"
//             >
//               👑 Admin Panel
//             </button>
//           )}

//           {/* PRO Button — for non-Pro users */}
//           {!isPro && (
//             <button onClick={onOpenPricing} className="navbar-pro-btn">
//               <Crown size={13} fill="#fff" />
//               <span>PRO</span>
//             </button>
//           )}

//           {/* Desktop auth */}
//           <div className="navbar-auth-desktop">
//             {user ? (
//               <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px 4px 5px', borderRadius: 99, background: '#F1F5F9', border: '1px solid #E2E8F0' }}>
//                   <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#fff', fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                     {getInitials(user.name)}
//                   </div>
//                   <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                     {user.name}
//                   </span>
//                 </div>
//                 <button onClick={logoutUser} className="btn btn-ghost btn-sm" style={{ padding: '6px 9px', borderRadius: 8 }} title="Sign Out">
//                   <LogOut size={13} color="#64748B" />
//                 </button>
//               </div>
//             ) : (
//               <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
//                 <button onClick={() => onOpenAuth('login')} className="btn btn-ghost btn-sm" style={{ borderRadius: 9, padding: '6px 11px', fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
//                   <LogIn size={13} color="#3B82F6" />
//                   <span>Sign In</span>
//                 </button>
//                 <button onClick={() => onOpenAuth('register')} className="btn btn-primary btn-sm" style={{ borderRadius: 9, padding: '7px 13px', fontWeight: 800, fontSize: '0.78rem', boxShadow: '0 3px 12px rgba(59,130,246,0.3)', whiteSpace: 'nowrap' }}>
//                   <UserIcon size={13} />
//                   <span>Sign Up</span>
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Hamburger — mobile only */}
//           <button className="navbar-hamburger" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu">
//             {menuOpen ? <X size={20} color="#334155" /> : <Menu size={20} color="#334155" />}
//           </button>
//         </div>
//       </div>

//       {/* ── Mobile Menu Dropdown ── */}
//       {menuOpen && (
//         <div className="navbar-mobile-menu">
//           {/* 3x3 tool grid on mobile */}
//           <div className="navbar-mobile-tools-grid">
//             {tools.map(({ id, name, icon: Icon }) => (
//               <button
//                 key={id}
//                 onClick={() => handleToolSelect(id)}
//                 className={`navbar-mobile-tool-btn${activeTool === id ? ' active' : ''}`}
//               >
//                 <Icon size={18} />
//                 <span>{name}</span>
//               </button>
//             ))}
//           </div>

//           {/* Auth row in mobile menu */}
//           <div className="navbar-mobile-auth-row">
//             {user ? (
//               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                   <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#fff', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                     {getInitials(user.name)}
//                   </div>
//                   <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A' }}>{user.name}</span>
//                 </div>
//                 <button onClick={logoutUser} className="btn btn-ghost btn-sm" style={{ gap: 5, borderRadius: 8 }}>
//                   <LogOut size={14} color="#64748B" />
//                   <span>Sign Out</span>
//                 </button>
//               </div>
//             ) : (
//               <>
//                 <button onClick={() => { onOpenAuth('login'); setMenuOpen(false); }} className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center', borderRadius: 9, padding: '9px 12px', fontWeight: 700 }}>
//                   <LogIn size={15} color="#3B82F6" />
//                   <span>Sign In</span>
//                 </button>
//                 <button onClick={() => { onOpenAuth('register'); setMenuOpen(false); }} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center', borderRadius: 9, padding: '9px 12px', fontWeight: 800, boxShadow: '0 3px 12px rgba(59,130,246,0.3)' }}>
//                   <UserIcon size={15} />
//                   <span>Sign Up</span>
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       )}

//     </header>
//   );
// }
