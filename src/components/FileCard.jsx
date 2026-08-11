import React from 'react';
import { Trash2, Eye, Download, ArrowRight, RefreshCw, FileText, Film } from 'lucide-react';
import { formatBytes } from '../lib/imageEngine';

export default function FileCard({ item, onRemove, onPreview, onDownloadSingle, isProcessing }) {
  const { file, previewUrl, processedResult, status } = item;
  const origSize = file?.size || 0;
  const newSize = processedResult?.size || 0;
  const pct = origSize > 0 && newSize > 0
    ? Math.round(((origSize - newSize) / origSize) * 100)
    : 0;
  const isSmaller = pct > 0;
  const isDone = status === 'done' && processedResult;
  const isRunning = isProcessing && status !== 'done';

  const resName = processedResult?.file?.name?.toLowerCase() || '';
  const origName = file?.name?.toLowerCase() || '';
  const isPdf = resName.endsWith('.pdf');
  const isDocx = resName.endsWith('.docx');
  const isGif = file?.type === 'image/gif' || origName.endsWith('.gif') || resName.endsWith('.gif');

  return (
    <div className="file-card animate-in">
      {/* Thumbnail */}
      <div className="file-thumb" style={{ position: 'relative' }}>
        {isPdf ? (
          <div style={{ width: '100%', height: '100%', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <FileText size={20} color="#ef4444" />
            <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#fca5a5' }}>PDF</span>
          </div>
        ) : isDocx ? (
          <div style={{ width: '100%', height: '100%', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <FileText size={20} color="#3b82f6" />
            <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#93c5fd' }}>DOCX</span>
          </div>
        ) : (
          <img src={processedResult?.url || previewUrl} alt={file.name} />
        )}

        {/* Prominent GIF Thumbnail Badge */}
        {isGif && (
          <div style={{
            position: 'absolute',
            bottom: 4,
            left: 4,
            background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
            color: '#fff',
            fontSize: '0.6rem',
            fontWeight: 900,
            padding: '2px 6px',
            borderRadius: 6,
            letterSpacing: '0.06em',
            zIndex: 10,
            boxShadow: '0 2px 8px rgba(124,58,237,0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
          }}>
            <Film size={10} color="#fff" />
            GIF
          </div>
        )}

        <div
          className="preview-overlay"
          onClick={(e) => { e.stopPropagation(); onPreview(item); }}
          title="Compare original vs result"
        >
          <Eye size={16} color="#fff" />
        </div>
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
          <p style={{
            fontWeight: 700,
            fontSize: '0.85rem',
            color: 'var(--text-1)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 240,
            margin: 0,
          }} title={file.name}>
            {file.name}
          </p>

          {/* Animated GIF Tag next to title */}
          {isGif && (
            <span style={{
              background: 'linear-gradient(135deg, #7C3AED, #DB2777)',
              color: '#fff',
              fontSize: '0.62rem',
              fontWeight: 900,
              padding: '1px 6px',
              borderRadius: 99,
              letterSpacing: '0.04em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              flexShrink: 0,
            }}>
              🎬 Animated GIF
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>{formatBytes(origSize)}</span>

          {isDone && (
            <>
              <ArrowRight size={12} color="var(--text-3)" />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6ee7b7' }}>
                {formatBytes(newSize)}
              </span>
              {pct !== 0 && (
                <span className={`badge ${isSmaller ? 'badge-emerald' : 'badge-amber'}`}>
                  {isSmaller ? `-${pct}%` : `+${Math.abs(pct)}%`}
                </span>
              )}
            </>
          )}

          {isRunning && (
            <span className="badge badge-indigo" style={{ animationName: 'pulse' }}>Processing…</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {isDone && (
          <button
            onClick={() => onDownloadSingle(item)}
            className="btn btn-success btn-sm"
            style={{ borderRadius: 9, gap: 5 }}
          >
            <Download size={13} />
            Save
          </button>
        )}

        {isRunning && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: '0.75rem', fontWeight: 700, color: '#a5b4fc',
          }}>
            <RefreshCw size={13} className="animate-spin-sm" />
            Processing
          </span>
        )}

        <button
          onClick={() => onPreview(item)}
          className="btn btn-ghost btn-sm"
          style={{ padding: '6px 8px', borderRadius: 9 }}
          title="Preview"
        >
          <Eye size={14} />
        </button>

        <button
          onClick={() => onRemove(item.id)}
          className="btn btn-danger btn-sm"
          style={{ padding: '6px 8px', borderRadius: 9 }}
          title="Remove"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
