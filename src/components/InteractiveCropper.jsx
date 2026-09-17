import React, { useRef, useState, useEffect, useCallback } from 'react';

export default function InteractiveCropper({ item, cropRect, setCropRect }) {
  const wrapperRef = useRef(null);   // inner overflow:hidden div (for size measurements)
  const outerRef = useRef(null);     // outer no-overflow div (for touch listener)
  const imgRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, rect: { ...cropRect } });
  const [imgLayout, setImgLayout] = useState({ x: 0, y: 0, w: 0, h: 0 });

  const origW = item?.width || 800;
  const origH = item?.height || 600;

  // ── Calculate the actual rendered image rect inside the container ──
  // objectFit:contain adds black bars — we need the real image pixel area
  const updateImgLayout = useCallback(() => {
    const img = imgRef.current;
    const wrap = wrapperRef.current;
    if (!img || !wrap) return;

    const containerW = wrap.offsetWidth;
    const containerH = img.offsetHeight; // img element height (maxHeight constrained)

    const imgAspect = origW / origH;
    const containerAspect = containerW / containerH;

    let renderedW, renderedH, offsetX, offsetY;

    if (imgAspect > containerAspect) {
      // Image is wider — pillarboxed (black on top/bottom)
      renderedW = containerW;
      renderedH = containerW / imgAspect;
      offsetX = 0;
      offsetY = (containerH - renderedH) / 2;
    } else {
      // Image is taller — letterboxed (black on left/right)
      renderedH = containerH;
      renderedW = containerH * imgAspect;
      offsetX = (containerW - renderedW) / 2;
      offsetY = 0;
    }

    setImgLayout({ x: offsetX, y: offsetY, w: renderedW, h: renderedH });
  }, [origW, origH]);

  useEffect(() => {
    updateImgLayout();
    window.addEventListener('resize', updateImgLayout);
    return () => window.removeEventListener('resize', updateImgLayout);
  }, [updateImgLayout, item]);

  const getClientPos = (e) => {
    if (e.touches && e.touches.length > 0)
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  };

  const handleDragStart = useCallback((e, type) => {
    // Only call preventDefault on non-passive events (mouse events)
    // Touch events attached via React props are passive by default — prevent via ref listeners below
    if (e.type !== 'touchstart') {
      e.preventDefault();
    }
    e.stopPropagation();
    const { x, y } = getClientPos(e);
    setIsDragging(true);
    setDragType(type);
    setDragStart({ x, y, rect: { ...cropRect } });
  }, [cropRect]);

  const handleDragMove = useCallback((e) => {
    if (!isDragging || imgLayout.w === 0) return;
    e.preventDefault();

    const scale = imgLayout.w / origW; // pixels per original pixel
    const { x: clientX, y: clientY } = getClientPos(e);
    const dx = Math.round((clientX - dragStart.x) / scale);
    const dy = Math.round((clientY - dragStart.y) / scale);
    const { x: iX, y: iY, width: iW, height: iH } = dragStart.rect;

    let newX = iX, newY = iY, newW = iW, newH = iH;

    switch (dragType) {
      case 'move':
        newX = Math.max(0, Math.min(origW - iW, iX + dx));
        newY = Math.max(0, Math.min(origH - iH, iY + dy));
        break;
      case 'se':
        newW = Math.max(20, Math.min(origW - iX, iW + dx));
        newH = Math.max(20, Math.min(origH - iY, iH + dy));
        break;
      case 'sw': {
        const cdx = Math.max(-iX, Math.min(iW - 20, dx));
        newX = iX + cdx; newW = iW - cdx;
        newH = Math.max(20, Math.min(origH - iY, iH + dy));
        break;
      }
      case 'ne': {
        const cdy = Math.max(-iY, Math.min(iH - 20, dy));
        newY = iY + cdy; newH = iH - cdy;
        newW = Math.max(20, Math.min(origW - iX, iW + dx));
        break;
      }
      case 'nw': {
        const cdx = Math.max(-iX, Math.min(iW - 20, dx));
        const cdy = Math.max(-iY, Math.min(iH - 20, dy));
        newX = iX + cdx; newW = iW - cdx;
        newY = iY + cdy; newH = iH - cdy;
        break;
      }
      case 'e': newW = Math.max(20, Math.min(origW - iX, iW + dx)); break;
      case 'w': {
        const cdx = Math.max(-iX, Math.min(iW - 20, dx));
        newX = iX + cdx; newW = iW - cdx;
        break;
      }
      case 's': newH = Math.max(20, Math.min(origH - iY, iH + dy)); break;
      case 'n': {
        const cdy = Math.max(-iY, Math.min(iH - 20, dy));
        newY = iY + cdy; newH = iH - cdy;
        break;
      }
      default: break;
    }

    setCropRect({
      x: Math.round(newX), y: Math.round(newY),
      width: Math.round(newW), height: Math.round(newH),
    });
  }, [isDragging, dragType, dragStart, origW, origH, imgLayout, setCropRect]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDragType(null);
  }, []);

  // Attach non-passive touchstart listeners to the wrapper so preventDefault works on mobile
  const wrapperTouchStartRef = useCallback((node) => {
    if (!node) return;
    // We need non-passive touchstart on the whole wrapper so scroll is blocked during crop
    const onTouchStart = (e) => {
      // Only block default if a drag handle initiated the touch (isDragging set via React handler)
      // We set a flag on the element via data attribute in the handle's onTouchStart
      if (e.target.dataset.cropHandle) {
        e.preventDefault();
      }
    };
    node.addEventListener('touchstart', onTouchStart, { passive: false });
    return () => node.removeEventListener('touchstart', onTouchStart);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchmove', handleDragMove, { passive: false });
    window.addEventListener('touchend', handleDragEnd);
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // ── All positions in absolute pixels relative to the wrapper div ──
  const scale = imgLayout.w > 0 ? imgLayout.w / origW : 1;

  // Crop box position in pixels within wrapper
  const boxX = imgLayout.x + cropRect.x * scale;
  const boxY = imgLayout.y + cropRect.y * scale;
  const boxW = cropRect.width * scale;
  const boxH = cropRect.height * scale;

  const overlayColor = 'rgba(0,0,0,0.6)';

  const cornerHandles = [
    { dir: 'nw', top: boxY - 7, left: boxX - 7, cursor: 'nwse-resize' },
    { dir: 'ne', top: boxY - 7, left: boxX + boxW - 7, cursor: 'nesw-resize' },
    { dir: 'sw', top: boxY + boxH - 7, left: boxX - 7, cursor: 'nesw-resize' },
    { dir: 'se', top: boxY + boxH - 7, left: boxX + boxW - 7, cursor: 'nwse-resize' },
  ];

  const edgeHandles = [
    { dir: 'n', top: boxY - 5, left: boxX + boxW / 2 - 10, w: 20, h: 8, cursor: 'ns-resize' },
    { dir: 's', top: boxY + boxH - 3, left: boxX + boxW / 2 - 10, w: 20, h: 8, cursor: 'ns-resize' },
    { dir: 'w', top: boxY + boxH / 2 - 10, left: boxX - 5, w: 8, h: 20, cursor: 'ew-resize' },
    { dir: 'e', top: boxY + boxH / 2 - 10, left: boxX + boxW - 3, w: 8, h: 20, cursor: 'ew-resize' },
  ];

  return (
    <div style={{
      background: '#1E293B',
      borderRadius: 16,
      padding: 14,
      width: '100%',
      boxSizing: 'border-box',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      marginBottom: 20,
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', marginBottom: 12,
        color: '#94A3B8', fontSize: '0.75rem', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        <span>✂ Interactive Crop Box</span>
        <span style={{ color: '#3B82F6', fontFamily: 'monospace' }}>
          {cropRect.width} × {cropRect.height} px
        </span>
      </div>

      {/*
        Two-layer structure:
        - outerDiv: position:relative, NO overflow:hidden — handles live here so they never get clipped
        - innerDiv (wrapperRef): overflow:hidden — only the image + overlays live here
      */}
      <div
        ref={(node) => {
          outerRef.current = node;
          wrapperTouchStartRef(node);
        }}
        style={{
          position: 'relative',
          width: '100%',
          borderRadius: 10,
          cursor: isDragging ? 'grabbing' : 'crosshair',
          touchAction: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
        }}
      >
        {/* Inner clipping container — image + dark overlays only */}
        <div
          ref={wrapperRef}
          style={{
            position: 'relative',
            width: '100%',
            borderRadius: 10,
            background: '#000',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            pointerEvents: 'none',
          }}
        >
          {/* Image */}
          <img
            ref={imgRef}
            src={item.previewUrl}
            alt="Crop Target"
            draggable={false}
            onLoad={updateImgLayout}
            style={{
              display: 'block',
              width: '100%',
              maxHeight: 340,
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
          />

          {imgLayout.w > 0 && (
            <>
              {/* 4 dark overlay panels — only over actual image area */}
              {/* Top */}
              <div style={{ position: 'absolute', background: overlayColor, pointerEvents: 'none', left: imgLayout.x, top: imgLayout.y, width: imgLayout.w, height: boxY - imgLayout.y }} />
              {/* Bottom */}
              <div style={{ position: 'absolute', background: overlayColor, pointerEvents: 'none', left: imgLayout.x, top: boxY + boxH, width: imgLayout.w, height: imgLayout.y + imgLayout.h - boxY - boxH }} />
              {/* Left */}
              <div style={{ position: 'absolute', background: overlayColor, pointerEvents: 'none', left: imgLayout.x, top: boxY, width: boxX - imgLayout.x, height: boxH }} />
              {/* Right */}
              <div style={{ position: 'absolute', background: overlayColor, pointerEvents: 'none', left: boxX + boxW, top: boxY, width: imgLayout.x + imgLayout.w - boxX - boxW, height: boxH }} />

              {/* Black bars outside image (letterbox/pillarbox areas) */}
              <div style={{ position: 'absolute', background: '#000', pointerEvents: 'none', left: 0, top: 0, width: imgLayout.x, height: '100%' }} />
              <div style={{ position: 'absolute', background: '#000', pointerEvents: 'none', right: 0, top: 0, width: imgLayout.x, height: '100%' }} />
              <div style={{ position: 'absolute', background: '#000', pointerEvents: 'none', left: 0, top: 0, width: '100%', height: imgLayout.y }} />
              <div style={{ position: 'absolute', background: '#000', pointerEvents: 'none', left: 0, bottom: 0, width: '100%', height: imgLayout.y }} />
            </>
          )}
        </div>

        {/* Handles layer — sits on top of inner div, NOT clipped */}
        {imgLayout.w > 0 && (
          <>
            {/* Crop box border + grid — interactive move area */}
            <div
              data-crop-handle="true"
              onMouseDown={(e) => handleDragStart(e, 'move')}
              onTouchStart={(e) => handleDragStart(e, 'move')}
              style={{
                position: 'absolute',
                left: boxX, top: boxY, width: boxW, height: boxH,
                border: '2px solid #3B82F6',
                cursor: 'move', boxSizing: 'border-box',
                zIndex: 10,
              }}
            >
              {/* Rule of thirds */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', pointerEvents: 'none' }}>
                <div style={{ flex: 1, borderBottom: '1px dashed rgba(255,255,255,0.3)' }} />
                <div style={{ flex: 1, borderBottom: '1px dashed rgba(255,255,255,0.3)' }} />
                <div style={{ flex: 1 }} />
              </div>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', pointerEvents: 'none' }}>
                <div style={{ flex: 1, borderRight: '1px dashed rgba(255,255,255,0.3)' }} />
                <div style={{ flex: 1, borderRight: '1px dashed rgba(255,255,255,0.3)' }} />
                <div style={{ flex: 1 }} />
              </div>
            </div>

            {/* Corner handles — 44×44px touch target, visual 14×14 dot */}
            {cornerHandles.map(({ dir, top, left, cursor }) => (
              <div
                key={dir}
                data-crop-handle="true"
                onMouseDown={(e) => handleDragStart(e, dir)}
                onTouchStart={(e) => handleDragStart(e, dir)}
                style={{
                  position: 'absolute',
                  top: top - 15, left: left - 15,
                  width: 44, height: 44,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor, zIndex: 20, touchAction: 'none',
                }}
              >
                <div style={{
                  width: 14, height: 14,
                  background: '#fff', border: '2px solid #3B82F6',
                  borderRadius: 3, boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                  pointerEvents: 'none',
                }} />
              </div>
            ))}

            {/* Edge handles — padded for easier mobile tapping */}
            {edgeHandles.map(({ dir, top, left, w, h, cursor }) => {
              const isHorizontal = dir === 'n' || dir === 's';
              const padX = isHorizontal ? 0 : 16;
              const padY = isHorizontal ? 16 : 0;
              return (
                <div
                  key={dir}
                  data-crop-handle="true"
                  onMouseDown={(e) => handleDragStart(e, dir)}
                  onTouchStart={(e) => handleDragStart(e, dir)}
                  style={{
                    position: 'absolute',
                    top: top - padY, left: left - padX,
                    width: w + padX * 2, height: h + padY * 2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor, zIndex: 20, touchAction: 'none',
                  }}
                >
                  <div style={{
                    width: w, height: h,
                    background: '#3B82F6', borderRadius: 2,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
                    pointerEvents: 'none',
                  }} />
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Footer */}
      <p style={{ margin: '10px 0 0', fontSize: '0.7rem', color: '#475569', textAlign: 'center', fontWeight: 600 }}>
        Drag box to move • Drag corners or edges to resize
      </p>
    </div>
  );
}
