import React from 'react';
import { Link } from 'react-router-dom';
import {
    ShieldCheck,
    Lock,
    Eye,
    Server,
    Cookie,
    ArrowLeft,
    Image,
    Clock,
    UserX,
} from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>

            {/* Hero Header */}
            <div style={{
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                color: '#fff',
                padding: '48px 24px 56px',
            }}>
                <div style={{ maxWidth: 780, margin: '0 auto' }}>
                    <Link
                        to="/"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            color: '#94A3B8',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            marginBottom: 28,
                        }}
                    >
                        <ArrowLeft size={14} />
                        Back to PicCraft
                    </Link>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        marginBottom: 10
                    }}>
                        <ShieldCheck size={22} color="#10B981" />

                        <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            color: '#10B981',
                            textTransform: 'uppercase',
                            letterSpacing: '0.07em'
                        }}>
                            Data Protection & Trust
                        </span>
                    </div>

                    <h1 style={{
                        fontSize: '2.2rem',
                        fontWeight: 900,
                        color: '#fff',
                        margin: '0 0 10px'
                    }}>
                        Privacy Policy
                    </h1>

                    <p style={{
                        fontSize: '0.88rem',
                        color: '#94A3B8',
                        margin: 0
                    }}>
                        Effective Date: August 3, 2026 &nbsp;·&nbsp;
                        Last Updated: August 15, 2026
                    </p>
                </div>
            </div>

            {/* Content */}
            <div style={{
                maxWidth: 780,
                margin: '0 auto',
                padding: '48px 24px 80px'
            }}>

                {/* Table of Contents */}
                <div style={{
                    background: '#fff',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: 16,
                    padding: '22px 28px',
                    marginBottom: 36,
                }}>
                    <p style={{
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        color: '#6366F1',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginBottom: 12
                    }}>
                        Contents
                    </p>

                    <ol style={{
                        paddingLeft: 18,
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6
                    }}>
                        {[
                            'Zero Image Storage Policy',
                            'Personal Information Collected',
                            'Technical Information & Security',
                            'Payment Processing & Security',
                            'Cookies & Advertising',
                            'Data Retention',
                            'Account Logout & Deletion',
                            'Your Privacy Rights & Contact',
                        ].map((item, i) => (
                            <li key={i}>
                                <a
                                    href={`#section-${i + 1}`}
                                    style={{
                                        color: '#3B82F6',
                                        fontSize: '0.88rem',
                                        fontWeight: 600,
                                        textDecoration: 'none'
                                    }}
                                >
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ol>
                </div>

                {/* Sections */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 32
                }}>

                    {/* 1 */}
                    <Section
                        id="section-1"
                        icon={<Lock size={20} color="#3B82F6" />}
                        title="1. Zero Image Storage Policy"
                    >
                        <p>
                            At <strong>PicCraft</strong>, user privacy is a priority.
                            Client-side image operations are performed within your web
                            browser where supported. For server-assisted processing,
                            uploaded files are processed using temporary server-side
                            memory buffers and are not intended to be permanently stored
                            as part of your account.
                        </p>

                        <p>
                            We do not use uploaded images for advertising, profiling,
                            or sale to third parties.
                        </p>
                    </Section>

                    {/* 2 */}
                    <Section
                        id="section-2"
                        icon={<Eye size={20} color="#3B82F6" />}
                        title="2. Personal Information Collected"
                    >
                        <p>
                            When you create and use a PicCraft account, we may collect
                            information necessary to provide authentication,
                            subscriptions, security, and core service functionality.
                        </p>

                        <ul>
                            <li>
                                <strong>Name and email address</strong> for account
                                identification and authentication.
                            </li>

                            <li>
                                <strong>Password information</strong> stored as a
                                cryptographic password hash rather than plain-text
                                passwords.
                            </li>

                            <li>
                                <strong>Account and subscription information</strong>
                                required to provide paid features and manage your
                                subscription status.
                            </li>
                        </ul>

                        <p>
                            We do not sell or rent your personal information to third
                            parties for their own marketing purposes.
                        </p>
                    </Section>

                    {/* 3 */}
                    <Section
                        id="section-3"
                        icon={<Server size={20} color="#3B82F6" />}
                        title="3. Technical Information & Security"
                    >
                        <p>
                            To operate and protect the service, we may process limited
                            technical information associated with your use of PicCraft.
                        </p>

                        <ul>
                            <li><strong>IP address</strong> for security, abuse prevention,
                                and operational purposes.</li>

                            <li><strong>Browser type</strong> for compatibility,
                                troubleshooting, and security purposes.</li>

                            <li><strong>Operating system</strong> for compatibility
                                and troubleshooting.</li>

                            <li><strong>Language preference</strong> where required
                                for service functionality.</li>

                            <li><strong>Timezone</strong> where required for
                                account or service functionality.</li>
                        </ul>

                        <p>
                            We do not retain technical metadata indefinitely without
                            a legitimate operational, security, or legal reason.
                            Technical information is subject to appropriate retention
                            and cleanup practices.
                        </p>
                    </Section>

                    {/* 4 */}
                    <Section
                        id="section-4"
                        icon={<Server size={20} color="#3B82F6" />}
                        title="4. Payment Processing & Security"
                    >
                        <p>
                            Monetary transactions are processed through
                            <strong> Razorpay Payment Gateway</strong>.
                            PicCraft does not store complete credit card numbers,
                            CVVs, or banking credentials on its servers.
                        </p>

                        <InfoBox
                            color="#EFF6FF"
                            border="#BFDBFE"
                            textColor="#1E40AF"
                        >
                            Payment processing information is handled through the
                            payment provider's infrastructure. PicCraft may retain
                            transaction identifiers and payment-related records
                            necessary for subscription management, reconciliation,
                            fraud prevention, and legitimate business or legal
                            requirements.
                        </InfoBox>
                    </Section>

                    {/* 5 */}
                    <Section
                        id="section-5"
                        icon={<Cookie size={20} color="#3B82F6" />}
                        title="5. Cookies & Advertising"
                    >
                        <p>
                            PicCraft uses essential HTTP-only session cookies to
                            maintain authenticated sessions and provide account
                            functionality.
                        </p>

                        <ul>
                            <li>
                                <strong>Essential cookies:</strong> used for login
                                sessions and account functionality.
                            </li>

                            <li>
                                <strong>Analytics:</strong> where enabled, information
                                may be used to understand general service usage.
                            </li>

                            <li>
                                <strong>Advertising:</strong> free users may see
                                advertisements. Advertising providers may apply their
                                own privacy policies and technologies.
                            </li>
                        </ul>
                    </Section>

                    {/* 6 */}
                    <Section
                        id="section-6"
                        icon={<Clock size={20} color="#3B82F6" />}
                        title="6. Data Retention"
                    >
                        <p>
                            We retain information only for as long as reasonably
                            necessary for the purpose for which it was collected,
                            including providing the service, maintaining security,
                            preventing abuse, resolving disputes, and meeting
                            applicable legal or accounting obligations.
                        </p>

                        <ul>
                            <li>
                                Account information may be retained while your account
                                is active.
                            </li>

                            <li>
                                Technical and security information is subject to
                                appropriate retention and cleanup practices.
                            </li>

                            <li>
                                Payment and transaction records may need to be retained
                                for accounting, fraud prevention, dispute resolution,
                                or legal obligations.
                            </li>
                        </ul>

                        <p>
                            Retention periods may differ depending on the type of
                            information and the purpose for which it is processed.
                        </p>
                    </Section>

                    {/* 7 */}
                    <Section
                        id="section-7"
                        icon={<UserX size={20} color="#EF4444" />}
                        title="7. Account Logout & Deletion"
                    >
                        <p>
                            You can sign out of your PicCraft account at any time.
                            Signing out ends your current authenticated session on
                            the device or browser.
                        </p>

                        <p>
                            If you choose to delete your account, PicCraft may
                            deactivate or anonymize account information associated
                            with that account. Certain transaction or payment records
                            may be retained where necessary for legitimate business,
                            accounting, fraud prevention, dispute resolution, or
                            legal purposes.
                        </p>

                        <p>
                            Account deletion does not mean that every record must
                            necessarily be erased immediately where retention is
                            legally or operationally required.
                        </p>
                    </Section>

                    {/* 8 */}
                    <Section
                        id="section-8"
                        icon={<ShieldCheck size={20} color="#10B981" />}
                        title="8. Your Privacy Rights & Contact"
                    >
                        <p>
                            Depending on your location and applicable law, you may
                            have rights relating to your personal information,
                            including rights to access, correct, or request deletion
                            of personal information.
                        </p>

                        <p>
                            For privacy-related questions or requests, contact us at:
                            {' '}
                            <a
                                href="mailto:privacy@piccraft.app"
                                style={{
                                    color: '#3B82F6',
                                    fontWeight: 600
                                }}
                            >
                                privacy@piccraft.app
                            </a>
                        </p>
                    </Section>

                </div>

                {/* Back link */}
                <div style={{
                    marginTop: 48,
                    paddingTop: 28,
                    borderTop: '1.5px solid #E2E8F0',
                    textAlign: 'center'
                }}>
                    <Link
                        to="/"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '12px 28px',
                            borderRadius: 12,
                            background: '#0F172A',
                            color: '#fff',
                            fontWeight: 800,
                            fontSize: '0.88rem',
                            textDecoration: 'none',
                        }}
                    >
                        <Image size={15} />
                        Back to PicCraft
                    </Link>
                </div>

            </div>
        </div>
    );
}

function Section({ id, icon, title, children }) {
    return (
        <div
            id={id}
            style={{
                background: '#fff',
                borderRadius: 16,
                border: '1.5px solid #E2E8F0',
                padding: '28px 32px',
                scrollMarginTop: 24,
            }}
        >
            <h2 style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: '1.1rem',
                fontWeight: 800,
                color: '#0F172A',
                marginBottom: 14,
                marginTop: 0,
            }}>
                {icon}
                {title}
            </h2>

            <div style={{
                fontSize: '0.9rem',
                color: '#475569',
                lineHeight: 1.7
            }}>
                {children}
            </div>
        </div>
    );
}

function InfoBox({ color, border, textColor, children }) {
    return (
        <div style={{
            background: color,
            border: `1.5px solid ${border}`,
            borderRadius: 12,
            padding: '14px 18px',
            marginTop: 14,
            fontSize: '0.85rem',
            color: textColor,
            lineHeight: 1.6,
        }}>
            {children}
        </div>
    );
}