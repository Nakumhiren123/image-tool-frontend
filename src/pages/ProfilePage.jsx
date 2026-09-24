import React, { useState } from 'react';
import { User, Mail, Shield, Calendar, Monitor, Globe, Clock, LogOut, Trash2, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export default function ProfilePage() {
    const { user, logoutUser, deleteAccount } = useAuth();
    const [showDanger, setShowDanger] = useState(false);

    if (!user) {
        return (
            <div style={{ padding: 40, textAlign: 'center' }}>
                <h2>Please sign in to view your profile.</h2>
            </div>
        );
    }

    const initials = (user.name || 'U')
        .split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const isPro = user.is_pro || user.plan === 'pro';

    return (
        <main style={{
            width: '100%',
            maxWidth: 720,
            margin: '32px auto',
            padding: '0 16px',
            boxSizing: 'border-box',
        }}>

            {/* ── Header card ── */}
            <div style={{
                background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
                borderRadius: 20,
                padding: '28px 24px',
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                flexWrap: 'wrap',
            }}>
                <div style={{
                    width: 68, height: 68, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    border: '3px solid rgba(255,255,255,0.4)',
                    color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.4rem', fontWeight: 900, flexShrink: 0,
                }}>
                    {initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h1 style={{ margin: 0, fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', fontWeight: 900, color: '#fff' }}>
                        {user.name || 'My Account'}
                    </h1>
                    <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.email}
                    </p>
                </div>
                <div style={{
                    padding: '6px 14px', borderRadius: 99,
                    background: isPro ? '#F59E0B' : 'rgba(255,255,255,0.15)',
                    color: isPro ? '#0F172A' : '#fff',
                    fontWeight: 800, fontSize: '0.78rem',
                    border: isPro ? 'none' : '1px solid rgba(255,255,255,0.3)',
                    flexShrink: 0,
                }}>
                    {isPro ? '⚡ PRO' : 'Free Plan'}
                </div>
            </div>

            {/* ── Info grid ── */}
            <div style={{
                background: '#fff',
                border: '1px solid #E2E8F0',
                borderRadius: 20,
                overflow: 'hidden',
                marginBottom: 16,
                boxShadow: '0 4px 16px rgba(15,23,42,0.06)',
            }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: '0.82rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Account Details
                    </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                    {[
                        { icon: <User size={15} />, label: 'Name', value: user.name || 'Not provided' },
                        { icon: <Mail size={15} />, label: 'Email', value: user.email || 'Not provided' },
                        { icon: <Shield size={15} />, label: 'Plan', value: isPro ? 'Pro' : 'Free' },
                        { icon: <Calendar size={15} />, label: 'Joined', value: formatDate(user.createdAt) },
                        { icon: <Clock size={15} />, label: 'Last Login', value: formatDate(user.lastLogin) },
                        { icon: <Monitor size={15} />, label: 'Browser', value: user.browser || 'Unknown' },
                        { icon: <Globe size={15} />, label: 'Language', value: user.language || 'Unknown' },
                        { icon: <Globe size={15} />, label: 'Timezone', value: user.timezone || 'UTC' },
                    ].map(({ icon, label, value }) => (
                        <div key={label} style={{
                            padding: '14px 20px',
                            borderBottom: '1px solid #F8FAFC',
                            borderRight: '1px solid #F8FAFC',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94A3B8', fontSize: '0.75rem', fontWeight: 700, marginBottom: 4 }}>
                                {icon} {label}
                            </div>
                            <div style={{ color: '#0F172A', fontWeight: 700, fontSize: '0.9rem', wordBreak: 'break-word' }}>
                                {value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Actions ── */}
            <div style={{
                background: '#fff',
                border: '1px solid #E2E8F0',
                borderRadius: 20,
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(15,23,42,0.06)',
            }}>
                {/* Logout */}
                <button
                    type="button"
                    onClick={logoutUser}
                    style={{
                        width: '100%', padding: '16px 20px',
                        display: 'flex', alignItems: 'center', gap: 12,
                        background: 'transparent', border: 'none',
                        borderBottom: '1px solid #F1F5F9',
                        cursor: 'pointer', textAlign: 'left',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <LogOut size={16} color="#EF4444" />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>Sign Out</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#94A3B8' }}>Log out of your account</p>
                    </div>
                </button>

                {/* Delete account — collapsible danger zone */}
                <button
                    type="button"
                    onClick={() => setShowDanger(v => !v)}
                    style={{
                        width: '100%', padding: '16px 20px',
                        display: 'flex', alignItems: 'center', gap: 12,
                        background: 'transparent', border: 'none',
                        cursor: 'pointer', textAlign: 'left',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FFF7F7'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Trash2 size={16} color="#DC2626" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#DC2626' }}>Delete Account</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#94A3B8' }}>Permanently remove your account and data</p>
                    </div>
                    <ChevronDown size={16} color="#94A3B8" style={{ transform: showDanger ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                </button>

                {showDanger && (
                    <div style={{ padding: '0 20px 20px' }}>
                        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: 16 }}>
                            <p style={{ margin: '0 0 12px', fontSize: '0.82rem', color: '#991B1B', lineHeight: 1.5 }}>
                                ⚠️ This action <strong>cannot be undone</strong>. All your data will be permanently deleted.
                            </p>
                            <button
                                type="button"
                                onClick={async () => {
                                    if (!window.confirm('Are you sure? This cannot be undone.')) return;
                                    try {
                                        await deleteAccount();
                                        window.location.href = '/';
                                    } catch (err) {
                                        window.alert(err.message || 'Unable to delete account.');
                                    }
                                }}
                                style={{
                                    padding: '10px 20px', borderRadius: 10,
                                    background: '#DC2626', color: '#fff',
                                    fontWeight: 800, fontSize: '0.85rem',
                                    border: 'none', cursor: 'pointer',
                                }}
                            >
                                Yes, Delete My Account
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

function formatDate(value) {
    if (!value) return 'Not available';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Not available';
    return date.toLocaleString();
}



// import React from 'react';
// import { User, Mail, Shield, Calendar, Monitor, Globe, Clock } from 'lucide-react';
// import { useAuth } from '../context/useAuth';

// export default function ProfilePage() {
//     const { user, logoutUser, deleteAccount } = useAuth();

//     if (!user) {
//         return (
//             <div style={{ padding: 40, textAlign: 'center' }}>
//                 <h2>Please sign in to view your profile.</h2>
//             </div>
//         );
//     }

//     return (
//         <main style={{
//             width: '100%',
//             maxWidth: 1200,
//             margin: '40px auto',
//             padding: '0 24px',
//             boxSizing: 'border-box',
//         }}>
//             <div style={{
//                 background: '#fff',
//                 border: '1px solid #E2E8F0',
//                 borderRadius: 20,
//                 padding: 30,
//                 boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
//             }}>
//                 <div style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 16,
//                     marginBottom: 30,
//                 }}>
//                     <div style={{
//                         width: 64,
//                         height: 64,
//                         borderRadius: '50%',
//                         background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
//                         color: '#fff',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         fontSize: '1.3rem',
//                         fontWeight: 800,
//                     }}>
//                         {(user.name || 'U')
//                             .split(' ')
//                             .map((n) => n[0])
//                             .join('')
//                             .toUpperCase()
//                             .slice(0, 2)}
//                     </div>

//                     <div>
//                         <h1 style={{
//                             margin: 0,
//                             fontSize: '1.7rem',
//                             color: '#0F172A',
//                         }}>
//                             My Profile
//                         </h1>

//                         <p style={{
//                             margin: '5px 0 0',
//                             color: '#64748B',
//                         }}>
//                             Manage and view your PicCraft account information
//                         </p>
//                     </div>
//                 </div>

//                 <div style={{
//                     display: 'grid',
//                     gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
//                     gap: 14,
//                 }}>
//                     <ProfileItem
//                         icon={<User size={18} />}
//                         label="Name"
//                         value={user.name || 'Not provided'}
//                     />

//                     <ProfileItem
//                         icon={<Mail size={18} />}
//                         label="Email"
//                         value={user.email || 'Not provided'}
//                     />

//                     <ProfileItem
//                         icon={<Shield size={18} />}
//                         label="Plan"
//                         value={user.plan || (user.is_pro ? 'pro' : 'free')}
//                     />

//                     <ProfileItem
//                         icon={<Calendar size={18} />}
//                         label="Account Created"
//                         value={formatDate(user.createdAt)}
//                     />

//                     <ProfileItem
//                         icon={<Clock size={18} />}
//                         label="Last Login"
//                         value={formatDate(user.lastLogin)}
//                     />

//                     <ProfileItem
//                         icon={<Monitor size={18} />}
//                         label="Browser"
//                         value={user.browser || 'Unknown'}
//                     />

//                     <ProfileItem
//                         icon={<Globe size={18} />}
//                         label="Language"
//                         value={user.language || 'Unknown'}
//                     />

//                     <ProfileItem
//                         icon={<Globe size={18} />}
//                         label="Timezone"
//                         value={user.timezone || 'UTC'}
//                     />

//                     <div style={{
//                         marginTop: 24,
//                         display: 'flex',
//                         justifyContent: 'flex-end',
//                     }}>
//                         <button
//                             type="button"
//                             onClick={logoutUser}
//                             style={{
//                                 border: 'none',
//                                 borderRadius: 10,
//                                 padding: '11px 20px',
//                                 background: '#EF4444',
//                                 color: '#fff',
//                                 fontSize: '0.9rem',
//                                 fontWeight: 700,
//                                 cursor: 'pointer',
//                             }}
//                         >
//                             Logout
//                         </button>
//                     </div>

//                     <div style={{
//                         marginTop: 16,
//                         paddingTop: 20,
//                         borderTop: '1px solid #E2E8F0',
//                     }}>
//                         <button
//                             type="button"
//                             onClick={async () => {
//                                 const confirmed = window.confirm(
//                                     'Are you sure you want to delete your account? This action cannot be undone.'
//                                 );

//                                 if (!confirmed) return;

//                                 try {
//                                     await deleteAccount();
//                                     window.location.href = '/';
//                                 } catch (error) {
//                                     window.alert(error.message || 'Unable to delete account.');
//                                 }
//                             }}
//                             style={{
//                                 border: '1px solid #FCA5A5',
//                                 borderRadius: 10,
//                                 padding: '10px 18px',
//                                 background: '#FEF2F2',
//                                 color: '#DC2626',
//                                 fontSize: '0.9rem',
//                                 fontWeight: 700,
//                                 cursor: 'pointer',
//                             }}
//                         >
//                             Delete Account
//                         </button>
//                     </div>

//                 </div>
//             </div>
//         </main>
//     );
// }

// function ProfileItem({ icon, label, value }) {
//     return (
//         <div style={{
//             padding: 16,
//             border: '1px solid #E2E8F0',
//             borderRadius: 12,
//             background: '#F8FAFC',
//         }}>
//             <div style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: 8,
//                 marginBottom: 7,
//                 color: '#64748B',
//                 fontSize: '0.8rem',
//                 fontWeight: 700,
//             }}>
//                 {icon}
//                 <span>{label}</span>
//             </div>

//             <div style={{
//                 color: '#0F172A',
//                 fontWeight: 700,
//                 wordBreak: 'break-word',
//             }}>
//                 {value}
//             </div>
//         </div>
//     );
// }

// function formatDate(value) {
//     if (!value) return 'Not available';

//     const date = new Date(value);

//     if (Number.isNaN(date.getTime())) {
//         return 'Not available';
//     }

//     return date.toLocaleString();
// }