import { useContext } from 'react';
import AuthContext from './AuthContext';

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        return {
            user: null,
            loading: false,
            isPro: false,
            isAdFree: false,
            updateSubscription: () => { },
            upgradeToPro: () => { },
            upgradeToAdFree: () => { },
            registerUser: async () => { },
            loginUser: async () => { },
            loginWithGoogle: async () => { },
            logoutUser: async () => { },
            deleteAccount: async () => { },
            checkAuth: async () => { },
        };
    }

    return context;
}