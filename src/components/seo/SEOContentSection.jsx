import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Zap, ShieldCheck, Target, Layers, FileImage, Sparkles } from 'lucide-react';

const FAQS = [
  {
    q: 'How do I compress an image to an exact size like 20KB or 50KB?',
    a: 'Use our Target KB Compression tool. Simply upload your image, specify your desired target file size (e.g. 50 KB), and our intelligent binary search compression engine will automatically iterate through quality levels to deliver an optimized image under your target size.'
  },
  {
    q: 'Is it safe to upload sensitive documents and private photos to PicCraft?',
    a: 'Yes, 100% safe! All processed images are handled in transient memory or isolated output directories and are automatically deleted immediately after download. We do not store, view, or share any user files.'
  },
  {
    q: 'Can I convert Apple HEIC photos to JPG or PNG?',
    a: 'Yes! PicCraft supports client-side HEIC to JPG and HEIC to PNG conversion directly in your web browser. You can convert iPhone photos without losing image quality.'
  },
  {
    q: 'What formats can I convert my images to?',
    a: 'PicCraft supports conversion between all popular web image formats including JPG, JPEG, PNG, WEBP, AVIF, and GIF.'
  },
  {
    q: 'Does PicCraft support passport and visa photo resizing?',
    a: 'Yes, our Image Resizer includes one-click presets for US Passport (2x2 inches), Schengen Visa (35x45 mm), Indian Passport, and online government exam upload limits.'
  }
];

export default function SEOContentSection() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Generate JSON-LD for Google Rich Snippet FAQPage & HowTo
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': FAQS.map(faq => ({
      '@type': 'Question',
      'name': faq.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.a
      }
    }))
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': 'How to Compress an Image to a Target KB Size',
    'description': 'Step-by-step guide to compress images to 20KB, 50KB, or 100KB online.',
    'step': [
      {
        '@type': 'HowToStep',
        'name': 'Upload Image',
        'text': 'Drag and drop your image into the PicCraft upload box.'
      },
      {
        '@type': 'HowToStep',
        'name': 'Set Target KB Size',
        'text': 'Enter your target size in KB (e.g. 50 KB) or select a compression quality preset.'
      },
      {
        '@type': 'HowToStep',
        'name': 'Download Optimized Image',
        'text': 'Click Process and download your compressed image immediately.'
      }
    ]
  };

  return (
    <section className="seo-content-section" style={{ padding: '60px 24px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>

      {/* Embedded Rich Snippet Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* ── SEO Heading & Intro ── */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{
            padding: '4px 12px', borderRadius: 99, background: '#EFF6FF', color: '#2563EB',
            fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em',
            display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12
          }}>
            <Sparkles size={14} /> Ultimate Image Utility
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: 12 }}>
            Free Online Image Converter, Target KB Compressor & Resizer
          </h2>
          <p style={{ fontSize: '1rem', color: '#64748B', maxWidth: 750, margin: '0 auto', lineHeight: 1.6 }}>
            PicCraft is an all-in-one web image toolkit designed for speed, privacy, and precision. Compress photos to exact sizes (20KB, 50KB, 100KB), convert formats (JPG, PNG, WEBP, AVIF, HEIC), and resize document photos effortlessly.
          </p>
        </div>

        {/* ── 3-Column SEO Feature Highlights ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 56 }}>

          <div style={{ background: '#FFFFFF', padding: 28, borderRadius: 16, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Target size={24} color="#2563EB" />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>
              Target KB Precision Search
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
              Specify exact KB limits for government exams, visa forms, or web uploads. Our C++ libvips Sharp engine automatically finds the optimal quality match.
            </p>
          </div>

          <div style={{ background: '#FFFFFF', padding: 28, borderRadius: 16, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <FileImage size={24} color="#16A34A" />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>
              Universal Format Conversion
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
              Convert between JPG, PNG, WEBP, AVIF, and iPhone HEIC formats. Preserve transparency, adjust background colors, and export batch ZIPs in seconds.
            </p>
          </div>

          <div style={{ background: '#FFFFFF', padding: 28, borderRadius: 16, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FAF5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <ShieldCheck size={24} color="#9333EA" />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>
              100% Secure & Private
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
              Your privacy is guaranteed. Heavy operations happen locally or in transient server memory with instant auto-purge upon file download.
            </p>
          </div>

        </div>

        {/* ── How-To Guide Section (Structured Data Target) ── */}
        <div style={{ background: '#FFFFFF', padding: 36, borderRadius: 20, border: '1px solid #E2E8F0', marginBottom: 56 }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A', marginBottom: 20, textAlign: 'center' }}>
            How to Convert & Compress Images in 3 Simple Steps
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 12, border: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#2563EB', marginBottom: 4 }}>STEP 1</div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>Upload Files</h4>
              <p style={{ fontSize: '0.82rem', color: '#64748B' }}>Drag and drop images or select files from your computer or phone.</p>
            </div>
            <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 12, border: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#2563EB', marginBottom: 4 }}>STEP 2</div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>Choose Mode & Size</h4>
              <p style={{ fontSize: '0.82rem', color: '#64748B' }}>Select target format (JPG, PNG, WEBP), size in KB, or preset dimensions.</p>
            </div>
            <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 12, border: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#2563EB', marginBottom: 4 }}>STEP 3</div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#2563EB', marginBottom: 4 }}>Download Results</h4>
              <p style={{ fontSize: '0.82rem', color: '#64748B' }}>Download high-quality processed images individually or as a single ZIP file.</p>
            </div>
          </div>
        </div>

        {/* ── Interactive FAQ Accordion (Google FAQPage Rich Snippet) ── */}
        <div style={{ maxWidth: 850, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <HelpCircle size={22} color="#2563EB" /> Frequently Asked Questions
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQS.map((faq, index) => (
              <div
                key={index}
                style={{
                  background: '#FFFFFF', borderRadius: 14, border: '1px solid #E2E8F0',
                  overflow: 'hidden', transition: 'all 0.2s ease-in-out'
                }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  style={{
                    width: '100%', padding: '18px 24px', background: 'none', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer', textAlign: 'left', fontWeight: 800, fontSize: '0.95rem', color: '#0F172A'
                  }}
                  aria-expanded={openFaq === index}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    color="#64748B"
                    style={{ transform: openFaq === index ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                  />
                </button>

                {openFaq === index && (
                  <div style={{ padding: '0 24px 20px', fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, borderTop: '1px solid #F1F5F9' }}>
                    <p style={{ marginTop: 12 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
}
