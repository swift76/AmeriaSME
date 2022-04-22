import { API_URL, BASE_URL } from 'app/configs/constants';

import axios from 'axios';

const instance = axios.create({
    withCredentials: false,
    baseURL: `${BASE_URL}${API_URL}`
});

export default instance;
