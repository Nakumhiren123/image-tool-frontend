import React from 'react';
import { User, Mail, Shield, Calendar, Monitor, Globe, Clock } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export default function ProfilePage() {
    const { user, logoutUser, deleteAccount } = useAuth();

    if (!user) {
        return (
            <div style={{ padding: 40, textAlign: 'center' }}>
                <h2>Please sign in to view your profile.</h2>
            </div>
        );
    }

    return (
        <main style={{
            width: '100%',
            maxWidth: 1200,
            margin: '40px auto',
            padding: '0 24px',
            boxSizing: 'border-box',
        }}>
            <div style={{
                background: '#fff',
                border: '1px solid #E2E8F0',
                borderRadius: 20,
                padding: 30,
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    marginBottom: 30,
                }}>
                    <div style={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.3rem',
                        fontWeight: 800,
                    }}>
                        {(user.name || 'U')
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)}
                    </div>

                    <div>
                        <h1 style={{
                            margin: 0,
                            fontSize: '1.7rem',
                            color: '#0F172A',
                        }}>
                            My Profile
                        </h1>

                        <p style={{
                            margin: '5px 0 0',
                            color: '#64748B',
                        }}>
                            Manage and view your PicCraft account information
                        </p>
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 14,
                }}>
                    <ProfileItem
                        icon={<User size={18} />}
                        label="Name"
                        value={user.name || 'Not provided'}
                    />

                    <ProfileItem
                        icon={<Mail size={18} />}
                        label="Email"
                        value={user.email || 'Not provided'}
                    />

                    <ProfileItem
                        icon={<Shield size={18} />}
                        label="Plan"
                        value={user.plan || (user.is_pro ? 'pro' : 'free')}
                    />

                    <ProfileItem
                        icon={<Calendar size={18} />}
                        label="Account Created"
                        value={formatDate(user.createdAt)}
                    />

                    <ProfileItem
                        icon={<Clock size={18} />}
                        label="Last Login"
                        value={formatDate(user.lastLogin)}
                    />

                    <ProfileItem
                        icon={<Monitor size={18} />}
                        label="Browser"
                        value={user.browser || 'Unknown'}
                    />

                    <ProfileItem
                        icon={<Globe size={18} />}
                        label="Language"
                        value={user.language || 'Unknown'}
                    />

                    <ProfileItem
                        icon={<Globe size={18} />}
                        label="Timezone"
                        value={user.timezone || 'UTC'}
                    />

                    <div style={{
                        marginTop: 24,
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}>
                        <button
                            type="button"
                            onClick={logoutUser}
                            style={{
                                border: 'none',
                                borderRadius: 10,
                                padding: '11px 20px',
                                background: '#EF4444',
                                color: '#fff',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                            }}
                        >
                            Logout
                        </button>
                    </div>

                    <div style={{
                        marginTop: 16,
                        paddingTop: 20,
                        borderTop: '1px solid #E2E8F0',
                    }}>
                        <button
                            type="button"
                            onClick={async () => {
                                const confirmed = window.confirm(
                                    'Are you sure you want to delete your account? This action cannot be undone.'
                                );

                                if (!confirmed) return;

                                try {
                                    await deleteAccount();
                                    window.location.href = '/';
                                } catch (error) {
                                    window.alert(error.message || 'Unable to delete account.');
                                }
                            }}
                            style={{
                                border: '1px solid #FCA5A5',
                                borderRadius: 10,
                                padding: '10px 18px',
                                background: '#FEF2F2',
                                color: '#DC2626',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                            }}
                        >
                            Delete Account
                        </button>
                    </div>

                </div>
            </div>
        </main>
    );
}

function ProfileItem({ icon, label, value }) {
    return (
        <div style={{
            padding: 16,
            border: '1px solid #E2E8F0',
            borderRadius: 12,
            background: '#F8FAFC',
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 7,
                color: '#64748B',
                fontSize: '0.8rem',
                fontWeight: 700,
            }}>
                {icon}
                <span>{label}</span>
            </div>

            <div style={{
                color: '#0F172A',
                fontWeight: 700,
                wordBreak: 'break-word',
            }}>
                {value}
            </div>
        </div>
    );
}

function formatDate(value) {
    if (!value) return 'Not available';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'Not available';
    }

    return date.toLocaleString();
}