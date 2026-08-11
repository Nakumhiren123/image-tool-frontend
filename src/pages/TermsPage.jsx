import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle, RefreshCw, AlertTriangle, CreditCard, ArrowLeft, Image, Ban, Globe } from 'lucide-react';

export default function TermsPage() {
    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>

            {/* ── Hero Header ────────────────────────────────────────────────── */}
            <div style={{
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                color: '#fff', padding: '48px 24px 56px',
            }}>
                <div style={{ maxWidth: 780, margin: '0 auto' }}>
                    <Link to="/" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        color: '#94A3B8', fontSize: '0.82rem', fontWeight: 600,
                        textDecoration: 'none', marginBottom: 28,
                    }}
                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
                    >
                        <ArrowLeft size={14} /> Back to PicCraft
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <FileText size={22} color="#3B82F6" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                            Legal Agreements
                        </span>
                    </div>

                    <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', margin: '0 0 10px' }}>
                        Terms of Service & Refund Policy
                    </h1>
                    <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: 0 }}>
                        Effective Date: August 3, 2026 &nbsp;·&nbsp; Razorpay Merchant Compliant
                    </p>
                </div>
            </div>

            {/* ── Content ────────────────────────────────────────────────────── */}
            <div style={{ maxWidth: 780, margin: '0 auto', padding: '48px 24px 80px' }}>

                {/* Table of Contents */}
                <div style={{
                    background: '#fff', border: '1.5px solid #E2E8F0',
                    borderRadius: 16, padding: '22px 28px', marginBottom: 36,
                }}>
                    <p style={{ fontWeight: 800, fontSize: '0.82rem', color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                        Contents
                    </p>
                    <ol style={{ paddingLeft: 18, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {[
                            'Acceptance of Terms',
                            'Fair Usage & Pro Limits',
                            // 'Subscriptions & Billing',
                            'Prohibited Use',
                            'Intellectual Property',
                            'Limitation of Liability',
                            // 'Governing Law',
                        ].map((item, i) => (
                            <li key={i}>
                                <a href={`#term-${i + 1}`} style={{ color: '#3B82F6', fontSize: '0.88rem', fontWeight: 600, textDecoration: 'none' }}>
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ol>
                </div>

                {/* Sections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

                    <Section id="term-1" icon={<CheckCircle size={20} color="#10B981" />} title="1. Acceptance of Terms">
                        <p>
                            By accessing or using <strong>PicCraft Image Tool</strong>, you agree to be bound by these
                            Terms of Service. If you do not agree with any part of these terms, you must discontinue
                            use of the platform immediately. These terms apply to all visitors, users, and others who
                            access or use the service.
                        </p>
                    </Section>

                    <Section id="term-2" icon={<AlertTriangle size={20} color="#F59E0B" />} title="2. Fair Usage & Pro Limits">
                        <p>
                            Free tier users are limited to processing up to <strong>5 images per batch</strong> and
                            maximum file sizes of 10 MB. <strong>PicCraft Pro</strong> subscribers enjoy more files then free
                            batch processing, up to 500 MB file limits, and an ad-free clean interface.
                        </p>
                        <ul>
                            <li>Automated scraping, bot usage, or API abuse is strictly prohibited.</li>
                            <li>Accounts found violating fair use may be suspended without notice.</li>
                            <li>Pro features are for personal and commercial use by the account holder only — reselling is not permitted.</li>
                        </ul>
                    </Section>

                    {/* <Section id="term-3" icon={<CreditCard size={20} color="#3B82F6" />} title="3. Subscriptions & Billing">
                        <p>
                            Subscriptions are billed in advance on a Monthly (₹399 / $4.99) or Yearly (₹4,999 / $59.99)
                            recurring basis through Razorpay. You can't cancel your subscription.
                        </p>

                    </Section> */}



                    <Section id="term-3" icon={<Ban size={20} color="#EF4444" />} title="3. Prohibited Use">
                        <p>You agree not to use PicCraft to:</p>
                        <ul>
                            <li>Process, distribute, or store illegal, harmful, or offensive content.</li>
                            <li>Violate any applicable local, national, or international law or regulation.</li>
                            <li>Attempt to reverse-engineer, hack, or disrupt the platform's infrastructure.</li>
                            <li>Use automated tools to scrape or overload the API without prior written consent.</li>
                        </ul>
                    </Section>

                    <Section id="term-4" icon={<FileText size={20} color="#6366F1" />} title="4. Intellectual Property">
                        <p>
                            All content, branding, code, and design of PicCraft is the exclusive property of PicCraft
                            and its licensors, protected by copyright and intellectual property laws. You retain full
                            ownership of any images you process through PicCraft.
                        </p>
                    </Section>

                    <Section id="term-5" icon={<AlertTriangle size={20} color="#94A3B8" />} title="5. Limitation of Liability">
                        <p>
                            PicCraft is provided "as is" without warranties of any kind. To the fullest extent
                            permitted by law, PicCraft shall not be liable for any indirect, incidental, special,
                            consequential, or punitive damages resulting from your use of the service.
                        </p>
                    </Section>

                    {/* <Section id="term-6" icon={<Globe size={20} color="#3B82F6" />} title="6. Governing Law">
                        <p>
                            These Terms of Service shall be governed by and interpreted in accordance with the laws of
                            India. Any disputes shall be subject to the exclusive jurisdiction of the courts in
                            Ahmedabad, Gujarat, India.
                        </p>
                        <p>
                            For any questions regarding these terms, contact:{' '}
                            <a href="mailto:legal@piccraft.app" style={{ color: '#3B82F6', fontWeight: 600 }}>legal@piccraft.app</a>
                        </p>
                    </Section> */}

                </div>

                {/* Back link */}
                <div style={{ marginTop: 48, paddingTop: 28, borderTop: '1.5px solid #E2E8F0', textAlign: 'center' }}>
                    <Link to="/" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '12px 28px', borderRadius: 12,
                        background: '#0F172A', color: '#fff',
                        fontWeight: 800, fontSize: '0.88rem', textDecoration: 'none',
                    }}>
                        <Image size={15} /> Back to PicCraft
                    </Link>
                </div>

            </div>
        </div>
    );
}

function Section({ id, icon, title, children }) {
    return (
        <div id={id} style={{
            background: '#fff', borderRadius: 16,
            border: '1.5px solid #E2E8F0', padding: '28px 32px',
            scrollMarginTop: 24,
        }}>
            <h2 style={{
                display: 'flex', alignItems: 'center', gap: 10,
                fontSize: '1.1rem', fontWeight: 800, color: '#0F172A',
                marginBottom: 14, marginTop: 0,
            }}>
                {icon} {title}
            </h2>
            <div style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.7 }}>
                {children}
            </div>
        </div>
    );
}
