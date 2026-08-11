import React, { useState, useEffect, useCallback } from 'react';
import {
  X, Download, Columns2, AlignVerticalSpaceAround,
  FileText, CheckCircle2, Sparkles, Image as ImageIcon,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { formatBytes } from '../lib/imageEngine';

export default function ImagePreview({ items, currentIndex, onNavigate, onClose, onDownload }) {
  const [sideBySide, setSideBySide] = useState(false);

  const item = items?.[currentIndex];


  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
    if (e.key === 'ArrowRight' && currentIndex < items.length - 1) onNavigate(currentIndex + 1);
    if (e.key === 'Escape') onClose();
  }, [currentIndex, items, onNavigate, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!item) return null;

  const { file, previewUrl, processedResult } = item;

  // Only navigate among items that have been processed
  const processedItems = items.map((it, idx) => ({ it, idx })).filter(({ it }) => it.processedResult);
  const totalProcessed = processedItems.length;
  // Position of current item among processed-only items
  const positionAmongProcessed = processedItems.findIndex(({ idx }) => idx === currentIndex);

  const hasPrev = currentIndex > 0 && items.slice(0, currentIndex).some(it => it.processedResult);
  const hasNext = currentIndex < items.length - 1 && items.slice(currentIndex + 1).some(it => it.processedResult);

  // Navigate to previous processed item
  const goPrev = () => {
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (items[i].processedResult) { onNavigate(i); return; }
    }
  };

  // Navigate to next processed item
  const goNext = () => {
    for (let i = currentIndex + 1; i < items.length; i++) {
      if (items[i].processedResult) { onNavigate(i); return; }
    }
  };

  const resName = processedResult?.file?.name?.toLowerCase() || '';
  const isPdf  = resName.endsWith('.pdf');
  const isDocx = resName.endsWith('.docx');

  const renderResultPreview = () => {
    if (!processedResult?.url) return null;

    if (isPdf) {
      return (
        <iframe
          src={processedResult.url}
          title="PDF Document Preview"
          style={{ width: '100%', height: '100%', minHeight: 300, border: 'none', borderRadius: 8, background: '#ffffff' }}
        />
      );
    }

    if (isDocx) {
      return (
        <div style={{
          width: '100%', height: '100%', minHeight: 200,
          background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
          border: '1px solid #BFDBFE', borderRadius: 14,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: 24, textAlign: 'center', gap: 14,
        }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(59,130,246,0.3)' }}>
            <FileText size={32} color="#ffffff" />
          </div>
          <div>
            <h4 style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.1rem', color: '#1E3A8A', marginBottom: 4 }}>Microsoft Word Document</h4>
            <p style={{ fontSize: '0.85rem', color: '#1E40AF', fontWeight: 600 }}>{processedResult.file?.name || 'document.docx'} — {formatBytes(processedResult.size)}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#047857', fontWeight: 700 }}>
            <CheckCircle2 size={15} /> Ready for Download
          </div>
          <button onClick={() => onDownload(item)} className="btn btn-primary btn-md" style={{ borderRadius: 10, gap: 8, marginTop: 6 }}>
            <Download size={15} /> Download .docx File
          </button>
        </div>
      );
    }

    return (
      <img src={processedResult.url} alt="Result" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 8 }} />
    );
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel preview-modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', borderBottom: '1px solid #E2E8F0',
          background: '#F8FAFC', gap: 12, flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #BFDBFE', flexShrink: 0 }}>
              <Sparkles size={16} color="#2563EB" />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</p>
              <p style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>
                Processed Output Ready
                {totalProcessed > 1 && (
                  <span style={{ marginLeft: 8, color: '#2563EB', fontWeight: 700 }}>
                    {positionAmongProcessed + 1} / {totalProcessed}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {!isPdf && !isDocx && (
              <button
                onClick={() => setSideBySide(!sideBySide)}
                className="btn btn-ghost btn-sm"
                style={{ gap: 5, background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#334155' }}
              >
                {sideBySide ? <AlignVerticalSpaceAround size={14} /> : <Columns2 size={14} />}
                <span className="preview-toggle-label">{sideBySide ? 'Stacked' : 'Side by Side'}</span>
              </button>
            )}
            <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '6px 10px', background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#334155' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Image Viewer ── */}
        <div className={`preview-body ${sideBySide ? 'preview-side-by-side' : 'preview-stacked'}`}>

          {/* Original */}
          <div className="preview-pane">
            <div className="preview-pane-label preview-pane-label--original">
              <ImageIcon size={12} color="#475569" />
              <span>ORIGINAL &nbsp;·&nbsp; <strong>{formatBytes(file.size)}</strong></span>
            </div>
            <div className="preview-img-box preview-img-box--original">
              <img src={previewUrl} alt="Original" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 8 }} />
            </div>
          </div>

          {/* Result */}
          <div className="preview-pane">
            <div className="preview-pane-label preview-pane-label--result">
              <CheckCircle2 size={12} color="#059669" />
              <span>RESULT &nbsp;·&nbsp; <strong>{processedResult ? formatBytes(processedResult.size) : 'Processing…'}</strong></span>
            </div>
            <div className="preview-img-box preview-img-box--result">
              {renderResultPreview()}
            </div>
          </div>

        </div>

        {/* ── Modal Footer ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', borderTop: '1px solid #E2E8F0',
          background: '#FFFFFF', gap: 12, flexWrap: 'wrap', flexShrink: 0,
        }}>

          {/* Left: size stats + navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '0.85rem', flexWrap: 'wrap' }}>
            <span style={{ color: '#64748B', fontWeight: 500 }}>
              Original: <strong style={{ color: '#0F172A', fontWeight: 800 }}>{formatBytes(file.size)}</strong>
            </span>
            {processedResult && (
              <span style={{ color: '#047857', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                Result: <strong style={{ color: '#059669', fontWeight: 800 }}>{formatBytes(processedResult.size)}</strong>
                {processedResult.size < file.size && (
                  <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                    {Math.round((1 - processedResult.size / file.size) * 100)}% Smaller
                  </span>
                )}
              </span>
            )}
          </div>

          {/* Right: prev/next navigation + download */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {totalProcessed > 1 && (
              <>
                <button
                  onClick={goPrev}
                  disabled={!hasPrev}
                  className="btn btn-ghost btn-sm"
                  title="Previous image (←)"
                  style={{
                    padding: '8px 12px', background: '#FFFFFF', border: '1px solid #CBD5E1',
                    color: hasPrev ? '#334155' : '#CBD5E1', cursor: hasPrev ? 'pointer' : 'default',
                    borderRadius: 10, display: 'flex', alignItems: 'center', gap: 4,
                  }}
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', minWidth: 48, textAlign: 'center' }}>
                  {positionAmongProcessed + 1} / {totalProcessed}
                </span>
                <button
                  onClick={goNext}
                  disabled={!hasNext}
                  className="btn btn-ghost btn-sm"
                  title="Next image (→)"
                  style={{
                    padding: '8px 12px', background: '#FFFFFF', border: '1px solid #CBD5E1',
                    color: hasNext ? '#334155' : '#CBD5E1', cursor: hasNext ? 'pointer' : 'default',
                    borderRadius: 10, display: 'flex', alignItems: 'center', gap: 4,
                  }}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </>
            )}

            {processedResult && (
              <button
                onClick={() => onDownload(item)}
                className="btn btn-success btn-md"
                style={{ padding: '9px 20px', fontSize: '0.88rem', gap: 8, borderRadius: 10 }}
              >
                <Download size={15} />
                Download {isPdf ? 'PDF' : isDocx ? 'DOCX' : 'Processed Image'}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
