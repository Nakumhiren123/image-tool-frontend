import React from 'react';
import { Sparkles, Archive, RefreshCw } from 'lucide-react';

export default function DownloadButton({ onProcessAll, onDownloadZip, isProcessing, processedCount, totalCount }) {
  const hasResults = processedCount > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Main Process CTA */}
      <button
        onClick={onProcessAll}
        disabled={isProcessing || totalCount === 0}
        className="btn btn-process"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}
      >
        {isProcessing ? (
          <>
            <RefreshCw size={16} className="animate-spin-sm" />
            <span>Processing {processedCount} / {totalCount}…</span>
          </>
        ) : (
          <>
            <Sparkles size={16} />
            <span>
              {totalCount === 0
                ? 'Upload images to begin'
                : `Process ${totalCount > 1 ? `All ${totalCount} Images` : 'Image'}`}
            </span>
          </>
        )}
      </button>

      {/* ZIP download (batch only) */}
      {totalCount > 1 && hasResults && (
        <button
          onClick={onDownloadZip}
          disabled={isProcessing}
          className="btn btn-success btn-lg"
          style={{ width: '100%', justifyContent: 'center', borderRadius: 14, gap: 10 }}
        >
          <Archive size={16} />
          <span>Download All as ZIP ({processedCount} images)</span>
        </button>
      )}
    </div>
  );
}

