import React, { useEffect, useState } from 'react';
import CookieManager from './cookie';

function Authenticator({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const serverAuth = await CookieManager.checkServerAuth();
                if (!serverAuth.isLoggedIn) {
                    CookieManager.removeLoginCookies();
                    window.location.href = '/login';
                }
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Authentication check Failed:', error);
                window.location.href = '/login';
            } finally {
                setIsLoading(false);
            }
        };

        if (!CookieManager.isLoggedIn()) {
            window.location.href = '/login';
        } else {
            checkAuth();
        }
    }, []);

    if (isLoading) {
        return <div>Laden...</div>;
    }

    return isAuthenticated ? children : null;
}

export default Authenticator;