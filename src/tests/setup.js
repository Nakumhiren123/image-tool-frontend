if (typeof window === 'undefined') {
  global.window = {
    __heic2any__worker: null,
    navigator: {
      userAgent: 'node',
      mediaDevices: { getUserMedia: () => {} },
    },
  };
} else if (!window.navigator || !window.navigator.mediaDevices) {
  window.navigator = window.navigator || {};
  window.navigator.mediaDevices = { getUserMedia: () => {} };
}

if (typeof navigator === 'undefined') {
  global.navigator = global.window.navigator;
}

if (typeof document === 'undefined') {
  global.document = {
    createElement: (tag) => {
      if (tag === 'canvas') {
        const data = new Uint8ClampedArray(16 * 16 * 4).fill(255);
        const ctx = {
          getImageData: (x, y, w, h) => ({ data, width: w || 16, height: h || 16 }),
          fillStyle: '#FFFFFF',
          fillRect: () => {},
          drawImage: () => {},
        };
        return { width: 16, height: 16, getContext: () => ctx, toDataURL: (t) => `data:${t};base64,` };
      }
      return { width: 0, height: 0, getContext: () => null };
    }
  };
}

if (typeof globalThis.Worker === 'undefined') {
  globalThis.Worker = class { constructor() {} };
}

if (typeof globalThis.URL === 'undefined' || !globalThis.URL.createObjectURL) {
  globalThis.URL = globalThis.URL || {};
  globalThis.URL.createObjectURL = () => 'blob:mock-url';
  globalThis.URL.revokeObjectURL = () => {};
}
