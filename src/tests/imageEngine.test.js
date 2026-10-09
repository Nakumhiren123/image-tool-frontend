import './setup.js';
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  formatBytes,
  getFileExt,
  getMimeType,
  getExportFormat,
  isFormatSupported,
  encodeCanvasToBmpBlob,
  encodeCanvasToGifBlob,
} from '../lib/imageEngine.js';
import { CONVERTERS, getConverter, getConvertersByFrom, getConvertersByTo } from '../config/converters.js';

function createMockCanvas(width = 4, height = 4) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255;     // R
    data[i + 1] = 128; // G
    data[i + 2] = 64;  // B
    data[i + 3] = 255; // A
  }
  const ctx = {
    getImageData: (x, y, w, h) => ({ data, width: w || width, height: h || height }),
    fillStyle: '#FFFFFF',
    fillRect: () => {},
    drawImage: () => {},
  };
  return {
    width,
    height,
    getContext: () => ctx,
  };
}

test('formatBytes: all cases — zero, negative, bytes, KB, MB', () => {
  assert.equal(formatBytes(0),       '0 Bytes');  // zero
  assert.equal(formatBytes(-1),      '0 Bytes');  // negative input
  assert.equal(formatBytes(1023),    '1023 Bytes'); // just under 1KB
  assert.equal(formatBytes(1024),    '1 KB');     // exactly 1KB
  assert.equal(formatBytes(1048576), '1 MB');     // exactly 1MB
});

test('getFileExt extracts file extensions accurately', () => {
  assert.equal(getFileExt({ name: 'sample.jpg' }), 'jpeg');
  assert.equal(getFileExt({ name: 'photo.PNG' }), 'png');
  assert.equal(getFileExt({ name: 'image.webp' }), 'webp');
  assert.equal(getFileExt({ name: 'document.heic' }), 'heic');
});

test('getMimeType maps format extensions to valid MIME types', () => {
  assert.equal(getMimeType('jpg'), 'image/jpeg');
  assert.equal(getMimeType('png'), 'image/png');
  assert.equal(getMimeType('webp'), 'image/webp');
  assert.equal(getMimeType('heic'), 'image/heic');
  assert.equal(getMimeType('pdf'), 'application/pdf');
});

test('getExportFormat resolves requested export formats', () => {
  assert.equal(getExportFormat({ name: 'input.jpg' }, 'png'), 'png');
  assert.equal(getExportFormat({ name: 'input.png' }, 'webp'), 'webp');
  assert.equal(getExportFormat({ name: 'input.jpg' }, 'original'), 'jpeg');
});

test('isFormatSupported probe returns boolean', () => {
  assert.equal(typeof isFormatSupported('jpg'), 'boolean');
  assert.equal(isFormatSupported('jpg'), true);
});

test('encodeCanvasToBmpBlob: valid BMP header', async () => {
  const blob = encodeCanvasToBmpBlob(createMockCanvas());
  assert.equal(blob.type, 'image/bmp');
  const buf = await blob.arrayBuffer();
  const b = new Uint8Array(buf);
  assert.equal(b[0], 0x42, 'B');
  assert.equal(b[1], 0x4D, 'M');
  const v = new DataView(buf);
  assert.equal(v.getUint32(14, true), 40, 'InfoHeader size = 40');
  assert.equal(v.getUint16(28, true), 24, 'BitsPerPixel = 24');
});

test('encodeCanvasToGifBlob: valid GIF89a output', async () => {
  const blob = encodeCanvasToGifBlob(createMockCanvas());
  assert.equal(blob.type, 'image/gif');
  const buf = await blob.arrayBuffer();
  const b = new Uint8Array(buf);
  const header = String.fromCharCode(...b.slice(0, 6));
  assert.equal(header, 'GIF89a');
  assert.equal(b[b.length - 1], 0x3B, 'GIF trailer = 0x3B');
});

test('encodeCanvasToGifBlob: LZW uses variable-width codes', async () => {
  // Large uniform canvas forces code table growth
  const blob = encodeCanvasToGifBlob(createMockCanvas(100, 100));
  const buf = await blob.arrayBuffer();
  const b = new Uint8Array(buf);
  // Output should be larger than a trivially small fixed-9-bit output
  // and contain proper sub-block structure
  assert.ok(b.length > 800, 'GIF output should have substantial size for 100x100');
  assert.equal(b[b.length - 1], 0x3B, 'Trailer still present');
});

test('CONVERTERS matrix contains valid entries', () => {
  assert.ok(CONVERTERS.length > 50, 'Should contain 50+ converter pairs');
  const jpgToPng = getConverter('jpg-to-png');
  assert.ok(jpgToPng, 'jpg-to-png converter should exist');
  assert.equal(jpgToPng.from, 'jpg');
  assert.equal(jpgToPng.to, 'png');

  const heicToJpg = getConverter('heic-to-jpg');
  assert.ok(heicToJpg, 'heic-to-jpg converter should exist');

  const fromJpg = getConvertersByFrom('jpg');
  assert.ok(fromJpg.length > 0, 'Should have JPG converters');

  const toPng = getConvertersByTo('png');
  assert.ok(toPng.length > 0, 'Should have PNG target converters');
});
