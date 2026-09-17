import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext';
import {
  csrfFetch,
  clearCsrfToken,
} from '../services/csrf';


// API base — configured via VITE_API_URL in .env, never hardcoded
const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000/api' : '');

const AUTH_URL = `${API_BASE}/auth`;

// ── NOTE on localStorage usage ────────────────────────────────────────────────
// We do NOT store the JWT token in localStorage — it lives in an HttpOnly cookie
// managed by the backend. We store only non-sensitive UI-state hints (isPro,
// isAdFree) that are always verified against the server on page load.
// These hints exist only to avoid a flash of "free user" UI on first render.
// ─────────────────────────────────────────────────────────────────────────────

function getLocalHint(key) {
  try { return localStorage.getItem(key) === 'true'; } catch { return false; }
}
function setLocalHint(key, val) {
  try {
    if (val) {
      localStorage.setItem(key, 'true');
    } else {
      localStorage.removeItem(key);
    }
  } catch {
    // Ignore localStorage errors.
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(() => getLocalHint('piccraft_pro'));
  const [isAdFree, setIsAdFree] = useState(() => getLocalHint('piccraft_adfree'));

  // Send timezone to backend via cookie (used for user metadata only — not auth)
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      document.cookie = `user_tz=${encodeURIComponent(tz)}; path=/; max-age=31536000; SameSite=Lax`;
    } catch { }
  }, []);

  useEffect(() => { checkAuth(); }, []);

  /** Sync isPro / isAdFree from server response and update localStorage hints */
  const applyServerFlags = (serverUser) => {
    const pro = !!serverUser?.is_pro;
    const adFree = !!(serverUser?.is_ad_free || serverUser?.is_pro);
    setIsPro(pro);
    setIsAdFree(adFree);
    setLocalHint('piccraft_pro', pro);
    setLocalHint('piccraft_adfree', adFree);
  };

  const clearAllFlags = () => {
    setIsPro(false);
    setIsAdFree(false);
    setLocalHint('piccraft_pro', false);
    setLocalHint('piccraft_adfree', false);
  };

  /** Verify session with server — HttpOnly cookie is sent automatically */
  const checkAuth = async () => {
    try {
      const res = await fetch(`${AUTH_URL}/me`, { method: 'GET', credentials: 'include' });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        applyServerFlags(data.user);
      } else {
        setUser(null);
        clearAllFlags();
      }
    } catch {
      setUser(null);
      clearAllFlags();
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (name, email, password) => {
    const res = await csrfFetch(`${AUTH_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Registration failed');
    setUser(data.user);
    clearAllFlags(); // new accounts start free
    return data;
  };

  const loginUser = async (email, password) => {
    const res = await csrfFetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Login failed');
    setUser(data.user);
    applyServerFlags(data.user);
    return data;
  };

  const loginWithGoogle = async (credential) => {
    const res = await csrfFetch(`${AUTH_URL}/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ credential }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Google login failed');
    setUser(data.user);
    applyServerFlags(data.user);
    return data;
  };

  const logoutUser = async () => {
    try {
      await csrfFetch(`${AUTH_URL}/logout`, {
        method: 'POST',
      });

      clearCsrfToken();
    } catch { }
    setUser(null);
    clearAllFlags();
  };

  const deleteAccount = async () => {
    const res = await csrfFetch(`${AUTH_URL}/account`, {
      method: 'DELETE',
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Unable to delete account');
    }

    clearCsrfToken();
    setUser(null);
    clearAllFlags();

    return data;
  };

  /** Called after payment verification succeeds */
  const updateSubscription = (plan, expiresAt) => {
    setIsPro(true);
    setIsAdFree(true);
    setLocalHint('piccraft_pro', true);
    setLocalHint('piccraft_adfree', true);
    setUser((prev) => prev ? {
      ...prev,
      is_pro: true,
      is_ad_free: true,
      plan: plan || 'monthly',
      subscription_status: 'active',
      expires_at: expiresAt,
    } : prev);
  };

  /** Legacy aliases retained for backwards compatibility */
  const upgradeToPro = () => updateSubscription('monthly', new Date(Date.now() + 30 * 86400e3).toISOString());
  const upgradeToAdFree = () => { setIsAdFree(true); setLocalHint('piccraft_adfree', true); };

  return (
    <AuthContext.Provider value={{
      user, loading,
      isPro, isAdFree,
      updateSubscription, upgradeToPro, upgradeToAdFree,
      registerUser, loginUser, loginWithGoogle, logoutUser, deleteAccount, checkAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
}


// import React, { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext();

// const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/auth';

// function clearProFlag()   { localStorage.removeItem('piccraft_pro'); }
// function setProFlag()     { localStorage.setItem('piccraft_pro', 'true'); }
// function clearAdFreeFlag(){ localStorage.removeItem('piccraft_adfree'); }
// function setAdFreeFlag()  { localStorage.setItem('piccraft_adfree', 'true'); }

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   // Initialise from localStorage as a cached hint; server is the source of truth
//   const [isPro,    setIsPro]    = useState(() => localStorage.getItem('piccraft_pro')    === 'true');
//   const [isAdFree, setIsAdFree] = useState(() => localStorage.getItem('piccraft_adfree') === 'true');

//   useEffect(() => {
//     try {
//       const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
//       document.cookie = `user_tz=${encodeURIComponent(tz)}; path=/; max-age=31536000; SameSite=Lax`;
//     } catch (e) {}
//   }, []);

//   useEffect(() => { checkAuth(); }, []);

//   /** Sync both isPro and isAdFree from the server response */
//   const applyServerFlags = (serverUser) => {
//     if (serverUser?.is_pro) { setIsPro(true);    setProFlag();    }
//     else                    { setIsPro(false);   clearProFlag();  }

//     if (serverUser?.is_ad_free || serverUser?.is_pro) {
//       // Bundle buyers (is_pro) are always ad-free too
//       setIsAdFree(true);
//       setAdFreeFlag();
//     } else {
//       setIsAdFree(false);
//       clearAdFreeFlag();
//     }
//   };

//   /** Clear all flags — used on logout and when no session is found */
//   const clearAllFlags = () => {
//     setIsPro(false);    clearProFlag();
//     setIsAdFree(false); clearAdFreeFlag();
//   };

//   const checkAuth = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/me`, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//       });
//       const data = await res.json();
//       if (data.success && data.user) {
//         setUser(data.user);
//         applyServerFlags(data.user);
//       } else {
//         setUser(null);
//         clearAllFlags();
//       }
//     } catch (e) {
//       setUser(null);
//       clearAllFlags();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const registerUser = async (name, email, password) => {
//     const res = await fetch(`${API_BASE}/register`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       credentials: 'include',
//       body: JSON.stringify({ name, email, password }),
//     });
//     const data = await res.json();
//     if (!res.ok || !data.success) throw new Error(data.error || 'Registration failed');
//     setUser(data.user);
//     clearAllFlags(); // new accounts start with no passes
//     return data;
//   };

//   const loginUser = async (email, password) => {
//     const res = await fetch(`${API_BASE}/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       credentials: 'include',
//       body: JSON.stringify({ email, password }),
//     });
//     const data = await res.json();
//     if (!res.ok || !data.success) throw new Error(data.error || 'Login failed');
//     setUser(data.user);
//     applyServerFlags(data.user);
//     return data;
//   };

//   const loginWithGoogle = async (credential) => {
//     const res = await fetch(`${API_BASE}/google`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       credentials: 'include',
//       body: JSON.stringify({ credential }),
//     });
//     const data = await res.json();
//     if (!res.ok || !data.success) throw new Error(data.error || 'Google login failed');
//     setUser(data.user);
//     applyServerFlags(data.user);
//     return data;
//   };

//   const logoutUser = async () => {
//     try {
//       await fetch(`${API_BASE}/logout`, { method: 'POST', credentials: 'include' });
//     } catch (e) {}
//     setUser(null);
//     clearAllFlags();
//   };

//   /** Called after Subscription purchase is verified */
//   const updateSubscription = (plan, expiresAt) => {
//     setIsPro(true);    setProFlag();
//     setIsAdFree(true); setAdFreeFlag();
//     setUser((prev) => (prev ? {
//       ...prev,
//       is_pro: true,
//       is_ad_free: true,
//       plan: plan || 'monthly',
//       subscription_status: 'active',
//       expires_at: expiresAt,
//     } : prev));
//   };

//   /** Legacy helper retained for backwards compatibility */
//   const upgradeToPro = () => {
//     updateSubscription('monthly', new Date(Date.now() + 30 * 86400 * 1000).toISOString());
//   };

//   const upgradeToAdFree = () => {
//     setIsAdFree(true); setAdFreeFlag();
//   };

//   return (
//     <AuthContext.Provider value={{
//       user, loading,
//       isPro, isAdFree,
//       updateSubscription, upgradeToPro, upgradeToAdFree,
//       registerUser, loginUser, loginWithGoogle, logoutUser, checkAuth,
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     return {
//       user: null, loading: false,
//       isPro: false, isAdFree: false,
//       updateSubscription: () => {}, upgradeToPro: () => {}, upgradeToAdFree: () => {},
//       registerUser: async () => {}, loginUser: async () => {},
//       loginWithGoogle: async () => {}, logoutUser: async () => {},
//       checkAuth: async () => {},
//     };
//   }
//   return context;
// }
