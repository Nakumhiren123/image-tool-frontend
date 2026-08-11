import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, FilePlus, Clipboard, Plus } from 'lucide-react';

export default function UploadArea({ onFilesSelected, title, subtitle, hasFiles = false, multiple = true }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragOver(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files?.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };
  const handleFileChange = (e) => {
    if (e.target.files?.length > 0) onFilesSelected(Array.from(e.target.files));
  };

  useEffect(() => {
    const onPaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const pasted = [];
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const f = item.getAsFile();
          if (f) pasted.push(f);
        }
      }
      if (pasted.length) onFilesSelected(pasted);
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [onFilesSelected]);

  const accepted = 'image/jpeg,image/png,image/webp,image/gif,image/avif,image/bmp,image/heic,image/heif,.heic,.heif';

  const defaultTitle = hasFiles ? 'Add More Images' : 'Select or Drop Images Here';
  const defaultBtnText = hasFiles ? 'Add Image' : 'Select Images';

  return (
    <div
      className={`drop-zone${isDragOver ? ' drag-over' : ''}`}
      style={hasFiles ? { padding: '32px 24px' } : {}}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accepted}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Icon */}
      <div className="upload-ring" style={hasFiles ? { width: 60, height: 60, borderRadius: 16, marginBottom: 14 } : {}}>
        <UploadCloud size={hasFiles ? 26 : 32} color="#3b82f6" />
      </div>

      {/* Text */}
      <h3 style={{
        fontFamily: 'var(--font-head)',
        fontWeight: 800,
        fontSize: hasFiles ? '1.15rem' : '1.35rem',
        letterSpacing: '-0.02em',
        color: 'var(--text-1)',
        marginBottom: 6,
      }}>
        {title || defaultTitle}
      </h3>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-3)', marginBottom: hasFiles ? 16 : 24 }}>
        {subtitle || (hasFiles ? 'Drop additional images here or click to browse' : 'Supports JPG, PNG, WEBP, GIF, HEIC (iPhone), AVIF, BMP — up to 10 MB per file')}
      </p>

      {/* CTA button */}
      <button
        type="button"
        className="btn btn-primary btn-md"
        style={{ borderRadius: 12, pointerEvents: 'none', marginBottom: hasFiles ? 12 : 20 }}
      >
        {hasFiles ? <Plus size={16} /> : <FilePlus size={15} />}
        <span>{defaultBtnText}</span>
      </button>

      {/* Hints */}
      {!hasFiles && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}>
          <span className="badge badge-indigo">Batch Support</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', color: 'var(--text-3)' }}>
            <Clipboard size={12} />
            Ctrl+V paste works
          </span>
        </div>
      )}
    </div>
  );
}
