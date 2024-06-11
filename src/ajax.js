import axios from "axios";

function csrfToken() {
    return window._serverData ? window._serverData.csrfToken : '';
}

function onUnauthorized() {
    location.href = "/login?redirect=" + encodeURIComponent(location.href);
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
    if (config.method === "post" || config.method === "patch" || config.method === "put") {
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
    if (error.response) {
        if (error.response.status === 401) {
            onUnauthorized();
            return Promise.reject({result: 401, message: 'Need login'});
        }

        if (error.response.data)
            return Promise.reject(error.response.data);
    }
    return Promise.reject({errCode: 0, errMsg: 'Network error'});
});