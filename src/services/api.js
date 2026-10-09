/**
 * Backend API Client Service for Node.js + Express + Sharp Server
 */

import { csrfFetch } from './csrf';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000/api' : '');

async function handleApiResponse(response, defaultErrorText) {
  if (!response.ok) {
    let errData;
    try { errData = await response.json(); } catch { }
    const err = new Error(errData?.error || `${defaultErrorText}: ${response.statusText}`);
    if (errData) {
      err.code = errData.code;
      err.upgradeRequired = errData.upgradeRequired;
    }
    throw err;
  }
  return response;
}

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

    const rawResponse = await csrfFetch(`${API_BASE_URL}/convert`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    const response = await handleApiResponse(rawResponse, 'Backend Convert failed');

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

    const rawResponse = await csrfFetch(`${API_BASE_URL}/compress`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    const response = await handleApiResponse(rawResponse, 'Backend Compress failed');

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

    const rawResponse = await csrfFetch(`${API_BASE_URL}/resize`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    const response = await handleApiResponse(rawResponse, 'Backend Resize failed');

    const blob = await response.blob();
    const resizedFile = new File([blob], file.name, { type: blob.type });

    return {
      file: resizedFile,
      url: URL.createObjectURL(blob),
      size: blob.size,
    };
  }
};
