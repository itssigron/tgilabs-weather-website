/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';

const SERVER_URL = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? process.env.REACT_APP_SERVER_URL_DEV
    : process.env.REACT_APP_SERVER_URL_PROD;
const API_URL = `${SERVER_URL}/`;

class UserService {
    static getWeather(city) {
        return axios.get(API_URL + `weather?city=${encodeURIComponent(city)}`);
    }
}

export default UserService;
