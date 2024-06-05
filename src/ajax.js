import axios from "axios";

function csrfToken() {
    return window._serverData ? window._serverData.csrfToken : '';
}

export const ajax = axios.create({
    // timeout: 3000,
    headers: {
    },
    paramsSerializer: {
        indexes: null // by default: false
    },
    withXSRFToken: false // di
});


ajax.interceptors.request.use(config => {
    if (config.method == "post") {
        console.info(csrfToken());
        config.headers["X-XSRF-TOKEN"] = csrfToken();
    }
    return config;
}, error => {
    return Promise.reject({errCode: 0, errMsg: 'Unknown error'});
});

// Add a response interceptor
ajax.interceptors.response.use(response => {
    return response.data;
}, error => {
    if (axios.isCancel(error))
        return Promise.reject({errCode: 0, errMsg: 'Cancelled'});
    if (error.response && error.response.data)
        return Promise.reject(error.response.data);
    return Promise.reject({errCode: 0, errMsg: 'Network error'});
});