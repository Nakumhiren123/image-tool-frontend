// src/components/seo/SEOHead.jsx
import { useEffect } from 'react';
import { getConverterSEO } from '../../config/converters';

const BASE_URL = 'https://piccraft.app';

const SEO_PRESETS = {
  default: {
    title: 'PicCraft — Free Online Image Converter, Compressor & Resizer (Target KB)',
    description: 'Compress image to 20KB, 50KB, 100KB with target size precision. Convert JPG, PNG, WEBP, AVIF, HEIC online. Resize passport photos instantly.',
    keywords: 'image converter, compress image to 50kb, image compressor, resize image online, convert jpg to png, heic to jpg, passport photo resizer',
    canonical: `${BASE_URL}/`,
  },
  convert: {
    title: 'Image Converter — Convert JPG, PNG, WEBP, AVIF, HEIC Online | PicCraft',
    description: 'Convert images to JPG, PNG, WEBP, AVIF, or GIF online for free. Fast batch image format converter with zero quality loss.',
    keywords: 'image converter, convert jpg to png, convert png to webp, convert heic to jpg, online format converter, avif converter',
    canonical: `${BASE_URL}/convert`,
  },
  compress: {
    title: 'Image Compressor (Target 20KB, 50KB, 100KB) | PicCraft',
    description: 'Compress images to exact target KB size (20KB, 50KB, 100KB, 200KB). Intelligent binary search compression algorithm for exam documents & web.',
    keywords: 'compress image to 50kb, compress image to 20kb, target kb image compressor, reduce image size in kb, reduce photo size online',
    canonical: `${BASE_URL}/compress`,
  },
  resize: {
    title: 'Passport & Document Photo Resizer Online | PicCraft',
    description: 'Resize photos to exact pixel dimensions, inches, or millimeters. Passport photo resizer for US, Schengen, Indian Passport, and online applications.',
    keywords: 'passport photo resizer, resize image online, resize photo to 3.5x4.5 cm, photo resizer for admission form, crop image dimensions',
    canonical: `${BASE_URL}/resize`,
  },
  filter: {
    title: 'Photo Filters & Color Effects Online | PicCraft',
    description: 'Apply Black & White, Sepia, Invert, Warm, Cool, and Neon filters to your photos online for free.',
    keywords: 'photo filters online, black and white photo, sepia filter, photo color effects, image filter online',
    canonical: `${BASE_URL}/filter`,
  },
  crop: {
    title: 'Image Cropper Online — Crop to Any Ratio | PicCraft',
    description: 'Crop images to any aspect ratio or custom pixel region. Free online image cropper.',
    keywords: 'image cropper online, crop photo, crop image to ratio, free image crop tool',
    canonical: `${BASE_URL}/crop`,
  },
  rotate: {
    title: 'Rotate & Flip Images Online | PicCraft',
    description: 'Rotate images 90°, 180°, 270° or flip horizontally and vertically online for free.',
    keywords: 'rotate image online, flip image, rotate photo 90 degrees, image rotation tool',
    canonical: `${BASE_URL}/rotate`,
  },
  watermark: {
    title: 'Add Watermark to Images Online | PicCraft',
    description: 'Add text or logo watermark to your images online. Control opacity, position, and font size.',
    keywords: 'add watermark online, image watermark, text watermark, logo watermark, watermark photo',
    canonical: `${BASE_URL}/watermark`,
  },
  nameDate: {
    title: 'Name & Date Banner for Passport & Exam Photos | PicCraft',
    description: 'Add candidate name and date of photo (DOP/DOB) banner for official exam and passport photos online.',
    keywords: 'exam photo name date, passport photo banner, add name to photo, DOP DOB photo, exam registration photo',
    canonical: `${BASE_URL}/name-date`,
  },
  merge: {
    title: 'Merge Images Online — Combine Side by Side or Grid | PicCraft',
    description: 'Merge multiple images horizontally, vertically, or in a grid collage online for free.',
    keywords: 'merge images online, combine photos, image collage, side by side photos, merge jpg online',
    canonical: `${BASE_URL}/merge`,
  },
};

export default function SEOHead({ activeTab, from, to }) {
  useEffect(() => {
    let preset;

    // ── Converter-specific page (e.g. /jpg-to-png) ──
    if (activeTab === 'convert' && from && to) {
      const seo = getConverterSEO(from, to);
      preset = {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
        canonical: `${BASE_URL}/${from}-to-${to}`,
      };
    } else {
      // ── All other pages use the presets above ──
      preset = SEO_PRESETS[activeTab] || SEO_PRESETS.default;
    }

    // ── Update Document Title ──
    document.title = preset.title;

    // ── Update Meta Description ──
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', preset.description);

    // ── Update Meta Keywords ──
    let metaKw = document.querySelector('meta[name="keywords"]');
    if (!metaKw) {
      metaKw = document.createElement('meta');
      metaKw.setAttribute('name', 'keywords');
      document.head.appendChild(metaKw);
    }
    metaKw.setAttribute('content', preset.keywords);

    // ── Update Open Graph Title ──
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', preset.title);

    // ── Update Open Graph Description ──
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', preset.description);

    // ── Update Open Graph URL ──
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', preset.canonical);

    // ── Update Canonical Link ──
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', preset.canonical);

  }, [activeTab, from, to]); // re-runs when route changes

  return null;
}