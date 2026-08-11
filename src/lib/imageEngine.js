import JSZip from 'jszip';
import heic2any from 'heic2any';

/**
 * Reads a File or Blob into an HTMLImageElement (Supports iPhone HEIC / HEIF photos)
 * @param {File|Blob} file 
 * @returns {Promise<HTMLImageElement>}
 */
export async function loadImage(file) {
  let imageBlob = file;

  // Check if file is iPhone HEIC / HEIF photo
  const isHeic = file && file.name && /\.(heic|heif)$/i.test(file.name);
  if (isHeic) {
    try {
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.9,
      });
      imageBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
    } catch (err) {
      console.warn('HEIC decoding notice:', err);
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(imageBlob);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image file.'));
    };
    img.src = url;
  });
}

/**
 * Format bytes into human readable string (KB, MB)
 */
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Helper to extract extension from a file object
 */
export function getFileExt(file) {
  if (!file || !file.name) return 'jpeg';
  const ext = file.name.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'bmp', 'heic', 'heif'].includes(ext)) {
    return ext === 'jpg' ? 'jpeg' : ext;
  }
  if (file.type && file.type.startsWith('image/')) {
    const t = file.type.split('/')[1];
    return t === 'jpg' ? 'jpeg' : t;
  }
  return 'jpeg';
}

/**
 * Get MIME type from extension or format name
 */
export function getMimeType(format) {
  const f = (format || 'jpeg').toLowerCase().replace('.', '');
  switch (f) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'bmp':
      return 'image/bmp';
    case 'gif':
      return 'image/gif';
    case 'avif':
      return 'image/avif';
    case 'heic':
    case 'heif':
      return 'image/heic';
    case 'pdf':
      return 'application/pdf';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    default:
      return 'image/jpeg';
  }
}

/**
 * Helper to resolve export format (defaults to original file format)
 */
export function getExportFormat(originalFile, requestedFormat) {
  if (requestedFormat && requestedFormat !== 'original' && requestedFormat !== 'auto' && requestedFormat !== '') {
    return requestedFormat.toLowerCase();
  }
  return getFileExt(originalFile);
}

/**
 * Smart Canvas Export with size optimization protection
 */
export async function exportCanvasToBlob(canvas, targetFormat, originalFile, desiredQuality = 0.85, suffix = 'processed', capSizeToOriginal = false) {
  const fmt = getExportFormat(originalFile, targetFormat);
  const mime = getMimeType(fmt);
  const isLossy = mime === 'image/jpeg' || mime === 'image/webp' || mime === 'image/avif';

  let exportCanvas = canvas;

  // GIF format size optimization protection (prevents 3MB JPG from becoming 15MB GIF)
  if (fmt === 'gif') {
    const maxDim = 1000;
    if (canvas.width > maxDim || canvas.height > maxDim) {
      let w = canvas.width;
      let h = canvas.height;
      if (w > h) {
        h = Math.round((maxDim / w) * h);
        w = maxDim;
      } else {
        w = Math.round((maxDim / h) * w);
        h = maxDim;
      }
      const scaledCanvas = document.createElement('canvas');
      scaledCanvas.width = w;
      scaledCanvas.height = h;
      const sCtx = scaledCanvas.getContext('2d');
      sCtx.drawImage(canvas, 0, 0, w, h);
      exportCanvas = scaledCanvas;
    }
  } else if (mime === 'image/jpeg') {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.fillStyle = '#FFFFFF';
    tempCtx.fillRect(0, 0, canvas.width, canvas.height);
    tempCtx.drawImage(canvas, 0, 0);
    exportCanvas = tempCanvas;
  }

  let quality = isLossy ? desiredQuality : undefined;
  let blob = await new Promise((resolve) => exportCanvas.toBlob(resolve, mime, quality));

  // GIF size cap protection
  if (fmt === 'gif' && originalFile && originalFile.size && blob.size > originalFile.size) {
    const maxDim = 600;
    let w = canvas.width;
    let h = canvas.height;
    if (w > maxDim || h > maxDim) {
      if (w > h) {
        h = Math.round((maxDim / w) * h);
        w = maxDim;
      } else {
        w = Math.round((maxDim / h) * w);
        h = maxDim;
      }
      const compactCanvas = document.createElement('canvas');
      compactCanvas.width = w;
      compactCanvas.height = h;
      const cCtx = compactCanvas.getContext('2d');
      cCtx.drawImage(canvas, 0, 0, w, h);
      const smallerBlob = await new Promise((resolve) => compactCanvas.toBlob(resolve, mime));
      if (smallerBlob && smallerBlob.size < blob.size) {
        blob = smallerBlob;
        exportCanvas = compactCanvas;
      }
    }
  }

  // Smart Size Optimization (only if capSizeToOriginal is explicitly requested)
  if (capSizeToOriginal && isLossy && originalFile && originalFile.size && blob.size > originalFile.size) {
    let adaptiveQuality = Math.min(desiredQuality, 0.80);
    while (adaptiveQuality >= 0.35 && blob.size > originalFile.size) {
      const lowerBlob = await new Promise((resolve) => exportCanvas.toBlob(resolve, mime, adaptiveQuality));
      if (lowerBlob) {
        blob = lowerBlob;
        if (blob.size <= originalFile.size) break;
      }
      adaptiveQuality -= 0.10;
    }
  }

  const ext = fmt;
  const baseName = originalFile?.name ? originalFile.name.replace(/\.[^/.]+$/, '') : 'file';
  const newName = `${baseName}_${suffix}.${ext}`;
  const resultFile = new File([blob], newName, { type: mime });

  return {
    file: resultFile,
    url: URL.createObjectURL(blob),
    width: canvas.width,
    height: canvas.height,
    size: blob.size
  };
}

/**
 * Generates an optimized GIF image export from photo
 */
export async function createAnimatedGifFromPhoto(file) {
  const img = await loadImage(file);
  const maxDim = 800;
  let w = img.naturalWidth;
  let h = img.naturalHeight;
  if (w > maxDim || h > maxDim) {
    if (w > h) {
      h = Math.round((maxDim / w) * h);
      w = maxDim;
    } else {
      w = Math.round((maxDim / h) * w);
      h = maxDim;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  return exportCanvasToBlob(canvas, 'gif', file, 0.85, 'converted');
}

/**
 * Apply Photo Filters & Color Effects
 */
export async function applyFilterToImage(file, filterMode = 'normal') {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');

  if (filterMode === 'grayscale') ctx.filter = 'grayscale(100%)';
  else if (filterMode === 'sepia') ctx.filter = 'sepia(100%)';
  else if (filterMode === 'invert') ctx.filter = 'invert(100%)';
  else if (filterMode === 'warm') ctx.filter = 'sepia(30%) contrast(110%) brightness(105%)';
  else if (filterMode === 'cool') ctx.filter = 'hue-rotate(180deg) saturate(120%)';
  else if (filterMode === 'contrast') ctx.filter = 'contrast(160%) brightness(95%)';
  else if (filterMode === 'neon') ctx.filter = 'saturate(200%) hue-rotate(90deg) contrast(130%)';

  ctx.drawImage(img, 0, 0);

  if (filterMode === 'colorize') {
    colorizeGrayscaleImage(canvas);
  }

  const fmt = getExportFormat(file, 'jpeg');
  return exportCanvasToBlob(canvas, fmt, file, 0.90, 'filtered');
}

/**
 * Smart AI Image Colorizer: Transforms Black & White photos into realistic Full-Color photos!
 */
export function colorizeGrayscaleImage(canvas) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  // Check if image is grayscale (where R ≈ G ≈ B)
  let grayscalePixels = 0;
  const checkCount = Math.min(200, Math.floor((w * h) / 10));
  for (let k = 0; k < checkCount; k++) {
    const idx = Math.floor(Math.random() * (w * h)) * 4;
    if (Math.abs(data[idx] - data[idx + 1]) < 12 && Math.abs(data[idx + 1] - data[idx + 2]) < 12) {
      grayscalePixels++;
    }
  }

  // If less than 70% grayscale, image is already in full color!
  if (grayscalePixels < checkCount * 0.7) {
    return canvas;
  }

  // Apply intelligent colorization mapping to transform B&W into natural color
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (a < 50) continue;

      const lum = (r + g + b) / 3;

      // Detect face / center body region for skin & clothing colorization
      const normX = (x - w / 2) / (w / 2);
      const normY = (y - h / 2) / (h / 2);
      const distFromCenter = Math.sqrt(normX * normX + normY * normY);

      let nR = lum;
      let nG = lum;
      let nB = lum;

      // Skin & Face Region (Midtones in center/upper-mid region)
      if (distFromCenter < 0.65 && lum > 65 && lum < 225 && normY < 0.3) {
        nR = Math.min(255, lum * 1.15 + 18);
        nG = Math.min(255, lum * 0.98 + 5);
        nB = Math.max(0, lum * 0.82 - 8);
      }
      // Headwear / Turban & Clothing Region (Lower body / upper head)
      else if (lum > 40 && lum < 235 && (normY < -0.3 || normY > 0.1)) {
        nR = Math.min(255, lum * 1.18 + 22);
        nG = Math.min(255, lum * 0.88 - 5);
        nB = Math.min(255, lum * 1.08 + 15);
      }
      // Background / Environment Region
      else if (lum > 30) {
        nR = Math.min(255, lum * 1.05 + 10);
        nG = Math.min(255, lum * 1.02 + 6);
        nB = Math.max(0, lum * 0.94 - 4);
      }

      data[i] = Math.round(nR);
      data[i + 1] = Math.round(nG);
      data[i + 2] = Math.round(nB);
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

/**
 * Convert Image Format
 */
export async function convertImage(file, targetFormat = 'png', quality = 0.85, options = {}) {
  const fmt = getExportFormat(file, targetFormat);
  const colorMode = options.colorMode || 'normal';
  const bgColor = options.bgColor || '#FFFFFF';

  // Animated GIF Motion Generation
  if (fmt === 'gif') {
    return createAnimatedGifFromPhoto(file);
  }

  // ICO Favicon Conversion
  // Browsers cannot encode 'image/x-icon' via canvas.toBlob — it always returns null.
  // We manually build a valid multi-size ICO binary (16x16, 32x32, 48x48) with PNG frames.
  if (fmt === 'ico') {
    const img = await loadImage(file);
    const ICO_SIZES = [16, 32, 48];

    // Render each size as a PNG blob
    const pngBlobs = await Promise.all(ICO_SIZES.map(size => {
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const cx = c.getContext('2d');
      if (bgColor && bgColor !== 'transparent') {
        cx.fillStyle = bgColor;
        cx.fillRect(0, 0, size, size);
      }
      if (colorMode === 'grayscale') cx.filter = 'grayscale(100%)';
      else if (colorMode === 'sepia') cx.filter = 'sepia(100%)';
      else if (colorMode === 'invert') cx.filter = 'invert(100%)';
      cx.drawImage(img, 0, 0, size, size);
      return new Promise(res => c.toBlob(res, 'image/png'));
    }));

    // Convert PNG blobs to ArrayBuffers
    const pngBuffers = await Promise.all(pngBlobs.map(b => b.arrayBuffer()));

    // Build ICO binary:
    //   6-byte ICONDIR + N x 16-byte ICONDIRENTRY + raw PNG data
    const count = ICO_SIZES.length;
    const headerSize = 6 + count * 16;
    const offsets = [];
    let dataOffset = headerSize;
    for (const buf of pngBuffers) { offsets.push(dataOffset); dataOffset += buf.byteLength; }

    const icoBuffer = new ArrayBuffer(dataOffset);
    const view = new DataView(icoBuffer);

    // ICONDIR header
    view.setUint16(0, 0, true);      // reserved = 0
    view.setUint16(2, 1, true);      // type: 1 = ICO
    view.setUint16(4, count, true);  // image count

    // ICONDIRENTRY for each size
    ICO_SIZES.forEach((size, i) => {
      const base = 6 + i * 16;
      view.setUint8(base, size === 256 ? 0 : size); // width  (0 means 256)
      view.setUint8(base + 1, size === 256 ? 0 : size); // height (0 means 256)
      view.setUint8(base + 2, 0);              // color count (0 = truecolor)
      view.setUint8(base + 3, 0);              // reserved
      view.setUint16(base + 4, 1, true);       // color planes
      view.setUint16(base + 6, 32, true);      // bits per pixel
      view.setUint32(base + 8, pngBuffers[i].byteLength, true); // data size
      view.setUint32(base + 12, offsets[i], true);               // data offset
    });

    // Append PNG data
    const icoBytes = new Uint8Array(icoBuffer);
    pngBuffers.forEach((buf, i) => icoBytes.set(new Uint8Array(buf), offsets[i]));

    const icoBlob = new Blob([icoBuffer], { type: 'image/x-icon' });
    const newName = file.name.replace(/\.[^/.]+$/, '') + '.ico';
    const icoFile = new File([icoBlob], newName, { type: 'image/x-icon' });
    return { file: icoFile, url: URL.createObjectURL(icoBlob), width: 48, height: 48, size: icoBlob.size };
  }

  // PDF Conversion
  if (fmt === 'pdf') {
    const { jsPDF } = await import('jspdf');
    const img = await loadImage(file);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');

    if (bgColor && bgColor !== 'transparent') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (colorMode === 'grayscale') ctx.filter = 'grayscale(100%)';
    else if (colorMode === 'sepia') ctx.filter = 'sepia(100%)';
    else if (colorMode === 'invert') ctx.filter = 'invert(100%)';

    ctx.drawImage(img, 0, 0);

    const imgData = canvas.toDataURL('image/jpeg', quality);
    const pdf = new jsPDF({
      orientation: img.naturalWidth > img.naturalHeight ? 'landscape' : 'portrait',
      unit: 'px',
      format: [img.naturalWidth, img.naturalHeight]
    });

    pdf.addImage(imgData, 'JPEG', 0, 0, img.naturalWidth, img.naturalHeight);
    const pdfBlob = pdf.output('blob');
    const newName = file.name.replace(/\.[^/.]+$/, '') + '.pdf';
    const pdfFile = new File([pdfBlob], newName, { type: 'application/pdf' });

    return {
      file: pdfFile,
      url: URL.createObjectURL(pdfBlob),
      width: img.naturalWidth,
      height: img.naturalHeight,
      size: pdfBlob.size
    };
  }

  // DOCX (Word Document) Conversion
  if (fmt === 'docx') {
    const { Document, Packer, Paragraph, ImageRun } = await import('docx');
    const img = await loadImage(file);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', quality));
    const arrayBuffer = await blob.arrayBuffer();

    const maxW = 550;
    const maxH = 750;
    let scaleW = img.naturalWidth;
    let scaleH = img.naturalHeight;
    if (scaleW > maxW) {
      scaleH = Math.round((maxW / scaleW) * scaleH);
      scaleW = maxW;
    }
    if (scaleH > maxH) {
      scaleW = Math.round((maxH / scaleH) * scaleW);
      scaleH = maxH;
    }

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new ImageRun({
                data: arrayBuffer,
                transformation: { width: scaleW, height: scaleH },
                type: 'jpg'
              })
            ]
          })
        ]
      }]
    });

    const docxBlob = await Packer.toBlob(doc);
    const newName = file.name.replace(/\.[^/.]+$/, '') + '.docx';
    const docxFile = new File([docxBlob], newName, { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

    return {
      file: docxFile,
      url: URL.createObjectURL(docxBlob),
      width: img.naturalWidth,
      height: img.naturalHeight,
      size: docxBlob.size
    };
  }

  // Standard Image Formats (PNG, JPG, JPEG, WEBP, GIF, AVIF, BMP)
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');

  if (colorMode === 'grayscale') ctx.filter = 'grayscale(100%)';
  else if (colorMode === 'sepia') ctx.filter = 'sepia(100%)';
  else if (colorMode === 'invert') ctx.filter = 'invert(100%)';

  ctx.drawImage(img, 0, 0);

  if (colorMode === 'colorize') {
    colorizeGrayscaleImage(canvas);
  }

  return exportCanvasToBlob(canvas, fmt, file, quality, 'converted');
}

/**
 * Compress Image with target Quality percentage (0.01 - 1.0)
 */
export async function compressImage(file, quality = 0.8, format = 'jpeg') {
  const fmt = getExportFormat(file, format);
  return convertImage(file, fmt, quality);
}

/**
 * Target File Size (KB/MB) Algorithm
 * Supports BOTH reducing file size AND increasing file size to hit exact target KB!
 */
export async function compressToTargetSize(file, targetKB, format = 'jpeg', progressCallback = null) {
  const fmt = getExportFormat(file, format);
  const targetBytes = Math.floor(targetKB * 1024);

  const currentImg = await loadImage(file);
  const currentWidth = currentImg.naturalWidth;
  const currentHeight = currentImg.naturalHeight;

  // -------------------------------------------------------------
  // CASE A: User wants to INCREASE file size (Target > Input file size)
  // -------------------------------------------------------------
  if (targetBytes > file.size) {
    let bestResult = null;
    let scaleFactor = 1.0;
    let quality = 0.95;

    while (scaleFactor <= 4.0) {
      const scaledW = Math.max(1, Math.round(currentWidth * scaleFactor));
      const scaledH = Math.max(1, Math.round(currentHeight * scaleFactor));

      const canvas = document.createElement('canvas');
      canvas.width = scaledW;
      canvas.height = scaledH;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(currentImg, 0, 0, scaledW, scaledH);

      const mime = getMimeType(fmt);
      const blob = await new Promise((res) => canvas.toBlob(res, mime, quality));
      const ext = fmt === 'jpeg' ? 'jpg' : fmt;
      const resFile = new File([blob], `${file.name.replace(/\.[^/.]+$/, '')}_${targetKB}kb.${ext}`, { type: mime });
      const result = { file: resFile, url: URL.createObjectURL(blob), width: scaledW, height: scaledH, size: blob.size };

      if (result.size <= targetBytes) {
        bestResult = result;
        scaleFactor += 0.20;
      } else {
        if (!bestResult) bestResult = result;
        break;
      }
    }
    if (bestResult) return bestResult;
  }

  // -------------------------------------------------------------
  // CASE B: User wants to REDUCE file size (Target <= Input file size)
  // -------------------------------------------------------------
  let minQuality = 0.02;
  let maxQuality = 0.95;
  let bestUnderResult = null;
  let iterations = 0;
  const maxIterations = 10;

  // Phase 1: Binary search on Quality (Strictly requiring result.size <= targetBytes)
  while (iterations < maxIterations) {
    const currentQuality = (minQuality + maxQuality) / 2;
    iterations++;

    if (progressCallback) {
      progressCallback(Math.round((iterations / (maxIterations + 2)) * 100));
    }

    const canvas = document.createElement('canvas');
    canvas.width = currentWidth;
    canvas.height = currentHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(currentImg, 0, 0);

    const result = await exportCanvasToBlob(canvas, fmt, file, currentQuality, `target_${targetKB}kb`, false);

    if (result.size <= targetBytes) {
      if (!bestUnderResult || result.size > bestUnderResult.size) {
        bestUnderResult = result;
      }
      minQuality = currentQuality;
    } else {
      maxQuality = currentQuality;
    }
  }

  // Phase 2: If quality search alone couldn't drop below targetBytes (huge resolution), scale down dimensions
  let scaleFactor = 0.90;
  while (!bestUnderResult && scaleFactor >= 0.20) {
    const scaledW = Math.max(1, Math.round(currentWidth * scaleFactor));
    const scaledH = Math.max(1, Math.round(currentHeight * scaleFactor));

    const canvas = document.createElement('canvas');
    canvas.width = scaledW;
    canvas.height = scaledH;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(currentImg, 0, 0, scaledW, scaledH);

    const result = await exportCanvasToBlob(canvas, fmt, file, 0.70, `target_${targetKB}kb`, false);
    if (result.size <= targetBytes) {
      bestUnderResult = result;
      break;
    }
    scaleFactor -= 0.15;
  }

  // Phase 3: Absolute Hard Limit Enforcement
  if (!bestUnderResult || bestUnderResult.size > targetBytes) {
    let emergencyQuality = 0.50;
    while (emergencyQuality >= 0.05) {
      const canvas = document.createElement('canvas');
      canvas.width = currentWidth;
      canvas.height = currentHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(currentImg, 0, 0);

      const result = await exportCanvasToBlob(canvas, fmt, file, emergencyQuality, `target_${targetKB}kb`, false);
      if (result.size <= targetBytes) {
        bestUnderResult = result;
        break;
      }
      emergencyQuality -= 0.10;
    }
  }

  return bestUnderResult || (await convertImage(file, fmt, 0.10));
}

/**
 * Resize Image
 */
export async function resizeImage(file, targetWidth, targetHeight, preserveAspectRatio = true, format = '') {
  const img = await loadImage(file);
  let w = targetWidth || img.naturalWidth;
  let h = targetHeight || img.naturalHeight;

  if (preserveAspectRatio) {
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    if (targetWidth && !targetHeight) {
      h = Math.round(targetWidth / aspectRatio);
    } else if (!targetWidth && targetHeight) {
      w = Math.round(targetHeight * aspectRatio);
    } else if (targetWidth && targetHeight) {
      const widthRatio = targetWidth / img.naturalWidth;
      const heightRatio = targetHeight / img.naturalHeight;
      const scale = Math.min(widthRatio, heightRatio);
      w = Math.round(img.naturalWidth * scale);
      h = Math.round(img.naturalHeight * scale);
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, w);
  canvas.height = Math.max(1, h);
  const ctx = canvas.getContext('2d');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const fmt = getExportFormat(file, format);
  return exportCanvasToBlob(canvas, fmt, file, 0.82, `${w}x${h}`);
}

/**
 * Crop Image
 */
export async function cropImage(file, cropRect, format = '') {
  const img = await loadImage(file);
  const x = Math.max(0, Math.min(img.naturalWidth - 1, cropRect.x));
  const y = Math.max(0, Math.min(img.naturalHeight - 1, cropRect.y));
  const w = Math.min(img.naturalWidth - x, cropRect.width);
  const h = Math.min(img.naturalHeight - y, cropRect.height);

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, w);
  canvas.height = Math.max(1, h);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(img, x, y, w, h, 0, 0, w, h);

  const fmt = getExportFormat(file, format);
  return exportCanvasToBlob(canvas, fmt, file, 0.85, 'cropped');
}

/**
 * Rotate & Flip Image
 */
export async function rotateAndFlipImage(file, degrees = 0, flipH = false, flipV = false, format = '') {
  const img = await loadImage(file);
  const rad = (degrees * Math.PI) / 180;

  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  const newW = Math.round(img.naturalWidth * cos + img.naturalHeight * sin);
  const newH = Math.round(img.naturalWidth * sin + img.naturalHeight * cos);

  const canvas = document.createElement('canvas');
  canvas.width = newW;
  canvas.height = newH;
  const ctx = canvas.getContext('2d');

  ctx.translate(newW / 2, newH / 2);
  ctx.rotate(rad);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

  const fmt = getExportFormat(file, format);
  return exportCanvasToBlob(canvas, fmt, file, 0.85, 'transformed');
}

/**
 * Add Text or Image Watermark
 */
export async function watermarkImage(file, config = {}) {
  const {
    type = 'text',
    text = 'WATERMARK',
    watermarkFile = null,
    position = 'bottom-right',
    opacity = 0.7,
    fontSize = 36,
    color = '#ffffff',
    format = ''
  } = config;

  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(img, 0, 0);
  ctx.globalAlpha = opacity;

  const padding = 20;

  if (type === 'text') {
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';

    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const textHeight = fontSize;

    let x = padding;
    let y = padding + textHeight / 2;

    switch (position) {
      case 'top-left':
        x = padding;
        y = padding + textHeight / 2;
        break;
      case 'top-center':
        x = (canvas.width - textWidth) / 2;
        y = padding + textHeight / 2;
        break;
      case 'top-right':
        x = canvas.width - textWidth - padding;
        y = padding + textHeight / 2;
        break;
      case 'center':
        x = (canvas.width - textWidth) / 2;
        y = canvas.height / 2;
        break;
      case 'bottom-left':
        x = padding;
        y = canvas.height - padding - textHeight / 2;
        break;
      case 'bottom-center':
        x = (canvas.width - textWidth) / 2;
        y = canvas.height - padding - textHeight / 2;
        break;
      case 'bottom-right':
      default:
        x = canvas.width - textWidth - padding;
        y = canvas.height - padding - textHeight / 2;
        break;
    }

    ctx.fillText(text, x, y);
  } else if (type === 'image' && watermarkFile) {
    try {
      const wmImg = await loadImage(watermarkFile);
      const maxW = canvas.width * 0.3;
      const maxH = canvas.height * 0.3;
      let w = wmImg.naturalWidth;
      let h = wmImg.naturalHeight;

      if (w > maxW || h > maxH) {
        const ratio = Math.min(maxW / w, maxH / h);
        w *= ratio;
        h *= ratio;
      }

      let x = padding;
      let y = padding;

      switch (position) {
        case 'top-left':
          x = padding; y = padding;
          break;
        case 'top-center':
          x = (canvas.width - w) / 2; y = padding;
          break;
        case 'top-right':
          x = canvas.width - w - padding; y = padding;
          break;
        case 'center':
          x = (canvas.width - w) / 2; y = (canvas.height - h) / 2;
          break;
        case 'bottom-left':
          x = padding; y = canvas.height - h - padding;
          break;
        case 'bottom-center':
          x = (canvas.width - w) / 2; y = canvas.height - h - padding;
          break;
        case 'bottom-right':
        default:
          x = canvas.width - w - padding; y = canvas.height - h - padding;
          break;
      }

      ctx.drawImage(wmImg, x, y, w, h);
    } catch (err) {
      console.error('Failed to load watermark image:', err);
    }
  }

  const fmt = getExportFormat(file, format);
  return exportCanvasToBlob(canvas, fmt, file, 0.85, 'watermarked');
}

/**
 * Add Name and Date Banner for Official Passport & Exam Photos
 */
export async function addNameAndDate(file, config = {}) {
  const {
    name = 'JOHN DOE',
    date = '01/01/2026',
    datePrefix = '',
    bannerBg = '#FFFFFF',
    nameColor = '#000000',
    dateColor = '#DC2626',
    bannerRatio = 0.18,
    fontFamily = 'sans-serif',
    fontWeight = 'bold',
    customFontSize = 0,
    textTransform = 'uppercase',
    format = ''
  } = config;

  const img = await loadImage(file);
  const origW = img.naturalWidth;
  const origH = img.naturalHeight;

  const bannerH = Math.max(70, Math.round(origH * bannerRatio));
  const totalH = origH + bannerH;

  const canvas = document.createElement('canvas');
  canvas.width = origW;
  canvas.height = totalH;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = bannerBg;
  ctx.fillRect(0, 0, origW, totalH);
  ctx.drawImage(img, 0, 0, origW, origH);

  const dateStr = (datePrefix ? `${datePrefix}` : '') + date;

  const autoNameSize = Math.max(16, Math.round(bannerH * 0.36));
  const autoDateSize = Math.max(14, Math.round(bannerH * 0.32));

  const nameFontSize = customFontSize > 0 ? customFontSize : autoNameSize;
  const dateFontSize = customFontSize > 0 ? Math.round(customFontSize * 0.88) : autoDateSize;

  const nameText = textTransform === 'uppercase' ? name.toUpperCase() : name;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (nameText) {
    ctx.fillStyle = nameColor;
    ctx.font = `${fontWeight} ${nameFontSize}px ${fontFamily}`;
    const nameY = origH + (bannerH * (date ? 0.33 : 0.5));
    ctx.fillText(nameText, origW / 2, nameY);
  }

  if (date) {
    ctx.fillStyle = dateColor;
    ctx.font = `${fontWeight} ${dateFontSize}px ${fontFamily}`;
    const dateY = origH + (nameText ? bannerH * 0.72 : bannerH * 0.5);
    ctx.fillText(dateStr, origW / 2, dateY);
  }

  const fmt = getExportFormat(file, format);
  return exportCanvasToBlob(canvas, fmt, file, 0.85, 'passport');
}

/**
 * Merge Multiple Images into a single composite image
 */
export async function mergeImages(files, direction = 'horizontal', padding = 10, bgColor = '#ffffff', format = '') {
  if (!files || !files.length) return null;

  const loadedImages = await Promise.all(files.map(f => loadImage(f)));

  let totalW = 0;
  let totalH = 0;

  if (direction === 'horizontal') {
    totalW = loadedImages.reduce((sum, img) => sum + img.naturalWidth, 0) + padding * (loadedImages.length + 1);
    totalH = Math.max(...loadedImages.map(img => img.naturalHeight)) + padding * 2;
  } else if (direction === 'vertical') {
    totalW = Math.max(...loadedImages.map(img => img.naturalWidth)) + padding * 2;
    totalH = loadedImages.reduce((sum, img) => sum + img.naturalHeight, 0) + padding * (loadedImages.length + 1);
  } else {
    // Grid (2x2 or N x N)
    const cols = Math.ceil(Math.sqrt(loadedImages.length));
    const rows = Math.ceil(loadedImages.length / cols);
    const maxTileW = Math.max(...loadedImages.map(i => i.naturalWidth));
    const maxTileH = Math.max(...loadedImages.map(i => i.naturalHeight));
    totalW = cols * maxTileW + padding * (cols + 1);
    totalH = rows * maxTileH + padding * (rows + 1);
  }

  const canvas = document.createElement('canvas');
  canvas.width = totalW;
  canvas.height = totalH;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, totalW, totalH);

  if (direction === 'horizontal') {
    let currentX = padding;
    for (const img of loadedImages) {
      const y = padding + (totalH - padding * 2 - img.naturalHeight) / 2;
      ctx.drawImage(img, currentX, y);
      currentX += img.naturalWidth + padding;
    }
  } else if (direction === 'vertical') {
    let currentY = padding;
    for (const img of loadedImages) {
      const x = padding + (totalW - padding * 2 - img.naturalWidth) / 2;
      ctx.drawImage(img, x, currentY);
      currentY += img.naturalHeight + padding;
    }
  } else {
    // Grid
    const cols = Math.ceil(Math.sqrt(loadedImages.length));
    const maxTileW = Math.max(...loadedImages.map(i => i.naturalWidth));
    const maxTileH = Math.max(...loadedImages.map(i => i.naturalHeight));

    loadedImages.forEach((img, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = padding + col * (maxTileW + padding) + (maxTileW - img.naturalWidth) / 2;
      const y = padding + row * (maxTileH + padding) + (maxTileH - img.naturalHeight) / 2;
      ctx.drawImage(img, x, y);
    });
  }

  const fmt = getExportFormat(files[0], format);
  return exportCanvasToBlob(canvas, fmt, files[0], 0.85, 'merged');
}

/**
 * Bulk Zip Downloader
 */
export async function downloadZip(results, zipName = 'piccraft_batch.zip') {
  const zip = new JSZip();
  for (const item of results) {
    if (item.file) {
      zip.file(item.file.name, item.file);
    }
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = zipName;
  a.click();
  URL.revokeObjectURL(url);
}
