// src/config/converters.js
// Central config for all supported image conversion pairs.
// Used by: App.jsx (routes), Navbar (dropdown), ConvertersHubPage (grid), SEOHead (meta tags)

export const CONVERTERS = [

    // ── JPG ──────────────────────────────────────────
    { from: 'jpg', to: 'png', slug: 'jpg-to-png', label: 'JPG to PNG', description: 'Convert JPG images to PNG with transparent background support' },
    { from: 'jpg', to: 'jpeg', slug: 'jpg-to-jpeg', label: 'JPG to JPEG', description: 'Convert JPG to JPEG format — same quality, renamed extension' },
    { from: 'jpg', to: 'webp', slug: 'jpg-to-webp', label: 'JPG to WEBP', description: 'Convert JPG to WEBP for smaller file sizes and faster web loading' },
    { from: 'jpg', to: 'avif', slug: 'jpg-to-avif', label: 'JPG to AVIF', description: 'Convert JPG to AVIF — next-gen format with superior compression' },
    { from: 'jpg', to: 'gif', slug: 'jpg-to-gif', label: 'JPG to GIF', description: 'Convert JPG images to GIF format' },
    { from: 'jpg', to: 'bmp', slug: 'jpg-to-bmp', label: 'JPG to BMP', description: 'Convert JPG to BMP bitmap format for Windows compatibility' },
    { from: 'jpg', to: 'pdf', slug: 'jpg-to-pdf', label: 'JPG to PDF', description: 'Convert JPG images to PDF document format' },

    // ── PNG ──────────────────────────────────────────
    { from: 'png', to: 'jpg', slug: 'png-to-jpg', label: 'PNG to JPG', description: 'Convert PNG images to JPG — smaller file size for photos' },
    { from: 'png', to: 'jpeg', slug: 'png-to-jpeg', label: 'PNG to JPEG', description: 'Convert PNG to JPEG format for smaller, shareable images' },
    { from: 'png', to: 'webp', slug: 'png-to-webp', label: 'PNG to WEBP', description: 'Convert PNG to WEBP for better web performance' },
    { from: 'png', to: 'avif', slug: 'png-to-avif', label: 'PNG to AVIF', description: 'Convert PNG to AVIF for next-gen image compression' },
    { from: 'png', to: 'gif', slug: 'png-to-gif', label: 'PNG to GIF', description: 'Convert PNG images to GIF format' },
    { from: 'png', to: 'bmp', slug: 'png-to-bmp', label: 'PNG to BMP', description: 'Convert PNG to BMP bitmap format' },
    { from: 'png', to: 'pdf', slug: 'png-to-pdf', label: 'PNG to PDF', description: 'Convert PNG images to PDF document' },

    // ── JPEG ─────────────────────────────────────────
    { from: 'jpeg', to: 'jpg', slug: 'jpeg-to-jpg', label: 'JPEG to JPG', description: 'Convert JPEG to JPG — same format, different extension' },
    { from: 'jpeg', to: 'png', slug: 'jpeg-to-png', label: 'JPEG to PNG', description: 'Convert JPEG to PNG with lossless quality' },
    { from: 'jpeg', to: 'webp', slug: 'jpeg-to-webp', label: 'JPEG to WEBP', description: 'Convert JPEG to WEBP for faster websites' },
    { from: 'jpeg', to: 'avif', slug: 'jpeg-to-avif', label: 'JPEG to AVIF', description: 'Convert JPEG to AVIF for next-gen compression' },
    { from: 'jpeg', to: 'gif', slug: 'jpeg-to-gif', label: 'JPEG to GIF', description: 'Convert JPEG images to GIF format' },
    { from: 'jpeg', to: 'bmp', slug: 'jpeg-to-bmp', label: 'JPEG to BMP', description: 'Convert JPEG to BMP bitmap format' },
    { from: 'jpeg', to: 'pdf', slug: 'jpeg-to-pdf', label: 'JPEG to PDF', description: 'Convert JPEG images to PDF document' },

    // ── WEBP ─────────────────────────────────────────
    { from: 'webp', to: 'jpg', slug: 'webp-to-jpg', label: 'WEBP to JPG', description: 'Convert WEBP images to JPG for universal compatibility' },
    { from: 'webp', to: 'jpeg', slug: 'webp-to-jpeg', label: 'WEBP to JPEG', description: 'Convert WEBP to JPEG format' },
    { from: 'webp', to: 'png', slug: 'webp-to-png', label: 'WEBP to PNG', description: 'Convert WEBP to PNG with transparency support' },
    { from: 'webp', to: 'avif', slug: 'webp-to-avif', label: 'WEBP to AVIF', description: 'Convert WEBP to AVIF next-gen format' },
    { from: 'webp', to: 'gif', slug: 'webp-to-gif', label: 'WEBP to GIF', description: 'Convert WEBP images to GIF format' },
    { from: 'webp', to: 'bmp', slug: 'webp-to-bmp', label: 'WEBP to BMP', description: 'Convert WEBP to BMP bitmap format' },

    // ── AVIF ─────────────────────────────────────────
    { from: 'avif', to: 'jpg', slug: 'avif-to-jpg', label: 'AVIF to JPG', description: 'Convert AVIF images to JPG for broad compatibility' },
    { from: 'avif', to: 'jpeg', slug: 'avif-to-jpeg', label: 'AVIF to JPEG', description: 'Convert AVIF to JPEG format' },
    { from: 'avif', to: 'png', slug: 'avif-to-png', label: 'AVIF to PNG', description: 'Convert AVIF to PNG with lossless quality' },
    { from: 'avif', to: 'webp', slug: 'avif-to-webp', label: 'AVIF to WEBP', description: 'Convert AVIF to WEBP format' },

    // ── GIF ──────────────────────────────────────────
    { from: 'gif', to: 'jpg', slug: 'gif-to-jpg', label: 'GIF to JPG', description: 'Convert GIF images to JPG format' },
    { from: 'gif', to: 'jpeg', slug: 'gif-to-jpeg', label: 'GIF to JPEG', description: 'Convert GIF to JPEG format' },
    { from: 'gif', to: 'png', slug: 'gif-to-png', label: 'GIF to PNG', description: 'Convert GIF to PNG with transparency support' },
    { from: 'gif', to: 'webp', slug: 'gif-to-webp', label: 'GIF to WEBP', description: 'Convert GIF to WEBP for better compression' },

    // ── BMP ──────────────────────────────────────────
    { from: 'bmp', to: 'jpg', slug: 'bmp-to-jpg', label: 'BMP to JPG', description: 'Convert BMP bitmap to JPG for smaller file sizes' },
    { from: 'bmp', to: 'jpeg', slug: 'bmp-to-jpeg', label: 'BMP to JPEG', description: 'Convert BMP to JPEG format' },
    { from: 'bmp', to: 'png', slug: 'bmp-to-png', label: 'BMP to PNG', description: 'Convert BMP bitmap to PNG format' },
    { from: 'bmp', to: 'webp', slug: 'bmp-to-webp', label: 'BMP to WEBP', description: 'Convert BMP to WEBP for web-optimized images' },

    // ── ICO (Favicon) ────────────────────────────────
    { from: 'png', to: 'ico', slug: 'png-to-ico', label: 'PNG to ICO', description: 'Convert PNG images to ICO favicon format for websites' },
    { from: 'jpg', to: 'ico', slug: 'jpg-to-ico', label: 'JPG to ICO', description: 'Convert JPG images to ICO favicon format' },
    { from: 'jpeg', to: 'ico', slug: 'jpeg-to-ico', label: 'JPEG to ICO', description: 'Convert JPEG images to ICO favicon format' },
    { from: 'webp', to: 'ico', slug: 'webp-to-ico', label: 'WEBP to ICO', description: 'Convert WEBP images to ICO favicon format' },
    { from: 'avif', to: 'ico', slug: 'avif-to-ico', label: 'AVIF to ICO', description: 'Convert AVIF images to ICO favicon format' },
    { from: 'gif', to: 'ico', slug: 'gif-to-ico', label: 'GIF to ICO', description: 'Convert GIF images to ICO favicon format' },
    { from: 'bmp', to: 'ico', slug: 'bmp-to-ico', label: 'BMP to ICO', description: 'Convert BMP images to ICO favicon format' },
    { from: 'heic', to: 'ico', slug: 'heic-to-ico', label: 'HEIC to ICO', description: 'Convert iPhone HEIC photos to ICO favicon format' },

    // ── HEIC / HEIF (iPhone photos) ──────────────────
    { from: 'heic', to: 'jpg', slug: 'heic-to-jpg', label: 'HEIC to JPG', description: 'Convert iPhone HEIC photos to JPG for universal sharing' },
    { from: 'heic', to: 'jpeg', slug: 'heic-to-jpeg', label: 'HEIC to JPEG', description: 'Convert iPhone HEIC photos to JPEG format' },
    { from: 'heic', to: 'png', slug: 'heic-to-png', label: 'HEIC to PNG', description: 'Convert iPhone HEIC photos to PNG format' },
    { from: 'heic', to: 'webp', slug: 'heic-to-webp', label: 'HEIC to WEBP', description: 'Convert iPhone HEIC photos to WEBP format' },
    { from: 'heif', to: 'jpg', slug: 'heif-to-jpg', label: 'HEIF to JPG', description: 'Convert HEIF images to JPG for universal compatibility' },
    { from: 'heif', to: 'png', slug: 'heif-to-png', label: 'HEIF to PNG', description: 'Convert HEIF images to PNG format' },
];

// ── Helper: get a single converter by slug ──────────────────────────────────
export function getConverter(slug) {
    return CONVERTERS.find(c => c.slug === slug) || null;
}

// ── Helper: get all converters for a given `from` format ───────────────────
export function getConvertersByFrom(from) {
    return CONVERTERS.filter(c => c.from === from.toLowerCase());
}

// ── Helper: get all converters for a given `to` format ─────────────────────
export function getConvertersByTo(to) {
    return CONVERTERS.filter(c => c.to === to.toLowerCase());
}

// ── Helper: group converters by `from` format (used in hub page grid) ──────
export function getConvertersGrouped() {
    return CONVERTERS.reduce((groups, converter) => {
        const key = converter.from.toUpperCase();
        if (!groups[key]) groups[key] = [];
        groups[key].push(converter);
        return groups;
    }, {});
}

// ── Format display labels (for UI badges, dropdowns, etc.) ─────────────────
export const FORMAT_LABELS = {
    jpg: 'JPG',
    jpeg: 'JPEG',
    png: 'PNG',
    webp: 'WEBP',
    avif: 'AVIF',
    gif: 'GIF',
    bmp: 'BMP',
    pdf: 'PDF',
    heic: 'HEIC',
    heif: 'HEIF',
    ico: 'ICO',
};

// ── Format colors (for UI badges) ──────────────────────────────────────────
export const FORMAT_COLORS = {
    jpg: { bg: '#FEF3C7', color: '#D97706' },
    jpeg: { bg: '#FEF3C7', color: '#D97706' },
    png: { bg: '#EDE9FE', color: '#7C3AED' },
    webp: { bg: '#D1FAE5', color: '#059669' },
    avif: { bg: '#DBEAFE', color: '#2563EB' },
    gif: { bg: '#FCE7F3', color: '#DB2777' },
    bmp: { bg: '#F1F5F9', color: '#475569' },
    pdf: { bg: '#FEE2E2', color: '#DC2626' },
    heic: { bg: '#F0FDF4', color: '#16A34A' },
    heif: { bg: '#F0FDF4', color: '#16A34A' },
    ico: { bg: '#F0F9FF', color: '#0284C7' },
};

// ── SEO meta per converter (used in SEOHead component) ─────────────────────
export function getConverterSEO(from, to) {
    if (!from || !to) return {
        title: 'Free Online Image Converter — PicCraft',
        description: 'Convert images between JPG, PNG, WEBP, AVIF, GIF, BMP and more. Free, fast, no upload required.',
        keywords: 'image converter, jpg to png, png to jpg, webp converter, free image converter',
    };

    const FROM = from.toUpperCase();
    const TO = to.toUpperCase();

    return {
        title: `${FROM} to ${TO} Converter — Free Online Tool | PicCraft`,
        description: `Convert ${FROM} images to ${TO} format free online. No signup, no upload limit on Pro. Fast browser-based ${FROM} to ${TO} converter.`,
        keywords: `${from} to ${to}, convert ${from} to ${to}, ${from} to ${to} converter, free ${from} to ${to}, online ${from} to ${to}`,
    };
}