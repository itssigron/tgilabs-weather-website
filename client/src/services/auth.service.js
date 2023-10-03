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
        deleteCookie("access_token");
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

    static getCurrentUser() {
        let jwtData = parseJwt(getCookie('access_token'));
        
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