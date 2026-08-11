/**
 * Backend API Client Service for Node.js + Express + Sharp Server
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiService = {
  /**
   * Health Check to see if Node backend server is online
   */
  async checkBackendStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
      return response.ok;
    } catch {
      return false;
    }
  },

  /**
   * Send file to backend /convert endpoint
   */
  async convertImage(file, targetFormat, options = {}) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('format', targetFormat);
    formData.append('quality', options.quality || 80);

    const response = await fetch(`${API_BASE_URL}/convert`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Backend Convert failed: ${response.statusText}`);
    }

    const blob = await response.blob();
    const newName = file.name.replace(/\.[^/.]+$/, '') + '.' + targetFormat.toLowerCase();
    const convertedFile = new File([blob], newName, { type: blob.type });

    return {
      file: convertedFile,
      url: URL.createObjectURL(blob),
      size: blob.size,
    };
  },

  /**
   * Send file to backend /compress endpoint
   */
  async compressImage(file, quality, targetKB = null) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('quality', quality);
    if (targetKB) formData.append('targetKB', targetKB);

    const response = await fetch(`${API_BASE_URL}/compress`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Backend Compress failed: ${response.statusText}`);
    }

    const blob = await response.blob();
    const newName = file.name.replace(/\.[^/.]+$/, '') + '_compressed' + (file.name.match(/\.[^/.]+$/)?.[0] || '.jpg');
    const compressedFile = new File([blob], newName, { type: blob.type });

    return {
      file: compressedFile,
      url: URL.createObjectURL(blob),
      size: blob.size,
    };
  },

  /**
   * Send file to backend /resize endpoint
   */
  async resizeImage(file, width, height, maintainAspect = true) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('width', width);
    formData.append('height', height);
    formData.append('maintainAspect', maintainAspect);

    const response = await fetch(`${API_BASE_URL}/resize`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Backend Resize failed: ${response.statusText}`);
    }

    const blob = await response.blob();
    const resizedFile = new File([blob], file.name, { type: blob.type });

    return {
      file: resizedFile,
      url: URL.createObjectURL(blob),
      size: blob.size,
    };
  }
};
