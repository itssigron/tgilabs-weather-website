/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
import { getCookie, deleteCookie } from "./cookie.service";

const SERVER_URL = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? process.env.REACT_APP_SERVER_URL_DEV
    : process.env.REACT_APP_SERVER_URL_PROD;
const API_URL = `${SERVER_URL}/auth/`;

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

class AuthService {
    static login(usernameOrEmail, password) {
        return axios
            .create({ withCredentials: true })
            .post(API_URL + "login", {
                username: usernameOrEmail,
                password
            })
    }

    static logout() {
        axios
            .create({ withCredentials: true })
            .post(API_URL + "logout")
            // If the request came back with an error, then we need to manually delete the cookie
            .catch(() => deleteCookie('access_token'))
    }

    static register(username, email, password) {
        return axios
            .create({ withCredentials: true })
            .post(API_URL + "register", {
                username,
                email,
                password
            });
    }

    static requestPasswordReset(email) {
        return axios.post(API_URL + "request-password-reset", {
            email
        });
    }

    static validateResetPasswordToken(token) {
        return axios.get(API_URL + `reset-password/${token}`);
    }

    static resetPassword(token, email, password, confirmPassword) {
        return axios.post(API_URL + `reset-password/${token}`, {
            email,
            password,
            confirmPassword
        });
    }

    /**
     * Gets the current authenticated user.
     * If there is an access token but invalid (either expired or malformed), It will return `null`.
     * If there isnt an access token at all, it will return `undefined`.
     * Otherwise, it will return the parsed JWT object.
     * @returns {{username: string, sub: number, iat: number, exp: number}|null|undefined}
     */
    static getCurrentUser() {
        let accessToken = getCookie('access_token');
        if (!accessToken) return undefined;

        let jwtData = parseJwt(accessToken);

        // Check if the token has expired, if so, then logout and return null
        // We divide by 1000 because a jwt token contains the expiration date in seconds
        if (jwtData?.exp - (Date.now() / 1000) <= 0) {
            this.logout();
            jwtData = null;
        }

        return jwtData;
    }
}

export default AuthService;