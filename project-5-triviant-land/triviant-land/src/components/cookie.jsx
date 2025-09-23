import Cookies from 'js-cookie';

const CookieManager = {
    setLoginCookies: (username, token) => {
        Cookies.set('user', username, {
            expires: 7, // 7 days
            sameSite: 'lax',
            secure: false
        });

        Cookies.set('userToken', token, {
            expires: 7,
            sameSite: 'lax',
            secure: false
        });
    },

    clearLoginCookies: () => {
        Cookies.remove('user');
        Cookies.remove('userToken');
    },

    getLoginCookies: () => {
        return {
            user: Cookies.get('user'),
            token: Cookies.get('userToken')
        };
    }
};

export default CookieManager;