import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CONVERTERS } from '../src/config/converters.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://image-tool-frontend.vercel.app';
const TODAY = new Date().toISOString().split('T')[0];

const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'monthly' },
  { path: '/converters', priority: '1.0', changefreq: 'monthly' },
  { path: '/convert', priority: '0.9', changefreq: 'monthly' },
  { path: '/compress', priority: '0.7', changefreq: 'monthly' },
  { path: '/resize', priority: '0.7', changefreq: 'monthly' },
  { path: '/filter', priority: '0.7', changefreq: 'monthly' },
  { path: '/crop', priority: '0.7', changefreq: 'monthly' },
  { path: '/rotate', priority: '0.7', changefreq: 'monthly' },
  { path: '/watermark', priority: '0.7', changefreq: 'monthly' },
  { path: '/name-date', priority: '0.7', changefreq: 'monthly' },
  { path: '/merge', priority: '0.7', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.5', changefreq: 'monthly' },
  { path: '/terms', priority: '0.5', changefreq: 'monthly' },
  { path: '/api-docs', priority: '0.5', changefreq: 'monthly' },
];

const converterRoutes = CONVERTERS.map(c => ({
  path: `/${c.slug}`,
  priority: '0.9',
  changefreq: 'monthly',
}));

const allRoutes = [...staticRoutes, ...converterRoutes];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(r => `  <url>
    <loc>${BASE_URL}${r.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

const outputPath = path.join(__dirname, '../public/sitemap.xml');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, sitemapXml, 'utf8');

console.log(`✅ Sitemap successfully generated at ${outputPath} with ${allRoutes.length} URLs.`);
