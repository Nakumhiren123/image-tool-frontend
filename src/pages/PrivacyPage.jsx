import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, Server, Cookie, ArrowLeft, Image } from 'lucide-react';

export default function PrivacyPage() {
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
                        transition: 'color .18s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
                    >
                        <ArrowLeft size={14} /> Back to PicCraft
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <ShieldCheck size={22} color="#10B981" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                            Data Protection & Trust
                        </span>
                    </div>

                    <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', margin: '0 0 10px' }}>
                        Privacy Policy
                    </h1>
                    <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: 0 }}>
                        Effective Date: August 3, 2026 &nbsp;·&nbsp; Last Updated: August 3, 2026
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
                            'Zero Image Storage Policy',
                            'Personal Information Collected',
                            'Payment Processing & Security',
                            'Cookies & Advertising',
                            // 'Data Retention & Deletion',
                            // 'Your Rights & Contact',
                        ].map((item, i) => (
                            <li key={i}>
                                <a href={`#section-${i + 1}`} style={{ color: '#3B82F6', fontSize: '0.88rem', fontWeight: 600, textDecoration: 'none' }}>
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ol>
                </div>

                {/* Sections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

                    <Section id="section-1" icon={<Lock size={20} color="#3B82F6" />} title="1. Zero Image Storage Policy">
                        <p>
                            At <strong>PicCraft</strong>, user privacy is our top priority. All client-side operations
                            occur entirely within your web browser memory without
                            ever touching our servers. For server-assisted processing, uploaded files are
                            stored temporarily in isolated memory buffers and are <strong>permanently auto-purged immediately</strong> upon
                            download. We never view, archive, or share your images.
                        </p>
                    </Section>

                    <Section id="section-2" icon={<Eye size={20} color="#3B82F6" />} title="2. Personal Information Collected">
                        <p>
                            When you create an account, we collect minimal information necessary to provide subscription access:
                        </p>
                        <ul>
                            <li>Full Name and Email Address (for account authentication).</li>
                            <li>Encrypted Password Hash (we never store plain text passwords).</li>
                            <li>Basic Browser Telemetry (IP address, OS, browser type for security monitoring).</li>
                        </ul>
                        <p>
                            We do not sell, rent, or share your personal information with third parties for marketing
                            purposes. Information is used solely to operate the PicCraft platform.
                        </p>
                    </Section>

                    <Section id="section-3" icon={<Server size={20} color="#3B82F6" />} title="3. Payment Processing & Security">
                        <p>
                            All monetary transactions are processed securely through <strong>Razorpay Payment Gateway</strong> using
                            PCI-DSS compliant encryption. PicCraft does not store credit card numbers, CVVs, or banking
                            credentials on our servers. All payment data is handled entirely by Razorpay's secure infrastructure.
                        </p>
                        <InfoBox color="#EFF6FF" border="#BFDBFE" textColor="#1E40AF">
                            Razorpay is PCI-DSS Level 1 certified — the highest level of payment security. Your card
                            details are never transmitted to or stored on PicCraft servers.
                        </InfoBox>
                    </Section>

                    <Section id="section-4" icon={<Cookie size={20} color="#3B82F6" />} title="4. Cookies & Advertising">
                        <p>
                            We use essential HTTP-Only session cookies to maintain your login status and subscription tier.
                            For free users, non-personalized advertising tags may be displayed. These ads do not use behavioural tracking for PicCraft users.
                        </p>
                        <ul>
                            <li><strong>Essential Cookies:</strong> Login session, subscription status.</li>
                            <li><strong>Analytics Cookies:</strong> Anonymous page view tracking (no personal data).</li>
                            <li><strong>Ad Cookies (Free Users only):</strong> Non-personalized tags.</li>
                        </ul>
                    </Section>

                    {/* <Section id="section-5" icon={<ShieldCheck size={20} color="#3B82F6" />} title="5. Data Retention & Deletion">
                        <p>
                            Account information is retained as long as your account is active. You may request deletion of
                            your account and all associated data at any time by emailing{' '}
                            <a href="mailto:privacy@piccraft.app" style={{ color: '#3B82F6', fontWeight: 600 }}>privacy@piccraft.app</a>.
                            All data is permanently erased within 30 days of a deletion request.
                        </p>
                    </Section> */}

                    <Section id="section-5" icon={<ShieldCheck size={20} color="#10B981" />} title="5. Contact">
                        {/* <p>Depending on your jurisdiction, you may have the right to:</p>
                        <ul>
                            <li>Access the personal data we hold about you.</li>
                            <li>Request correction of inaccurate data.</li>
                            <li>Request deletion of your data (Right to be Forgotten).</li>
                            <li>Object to or restrict processing of your data.</li>
                            <li>Lodge a complaint with your local data protection authority.</li>
                        </ul> */}
                        <p>
                            For any privacy-related enquiries, contact us at:{' '}
                            <a href="mailto:privacy@piccraft.app" style={{ color: '#3B82F6', fontWeight: 600 }}>privacy@piccraft.app</a>
                        </p>
                    </Section>

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

function InfoBox({ color, border, textColor, children }) {
    return (
        <div style={{
            background: color, border: `1.5px solid ${border}`,
            borderRadius: 12, padding: '14px 18px', marginTop: 14,
            fontSize: '0.85rem', color: textColor, lineHeight: 1.6,
        }}>
            {children}
        </div>
    );
}
