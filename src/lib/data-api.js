const baseUrl = "";
const loginUrl = "/login?redirect=";

function csrfToken() {
    return window._csrfToken;
}

function redirectToLogin() {
    location.href = loginUrl + encodeURIComponent(location.href);
}

export default async function fetchData(url, init = {}) {
    const headers  = {
        'accept': 'application/json',
        'content-type': 'application/json'
    };
    const method = init.method?.toUpperCase() || "GET";
    if (method === "POST" || init.method === "PATCH" || init.method === "PUT") {
        headers["X-XSRF-TOKEN"] = csrfToken();
    }
    init.headers = {
        ...headers,
        ...init.headers,
    }

    let res;
    try {
        res = await fetch(baseUrl + url, init);
    } catch (e) {
        throw {errCode: "UNKNOWN", errMsg: e.message};
    }
    if (res.status === 401) {
        redirectToLogin();
        return {};
    }
    if (!res.ok) {
        let error;
        try {
            error = await res.json();
        } catch (e) {
            throw {errCode: "UNKNOWN", errMsg: "Unknown error"};
        }
        throw error;
    }
    if (res.headers.get('Content-Length') === '0') {
        return null;
    }
    return res.json();
}

export async function getSession() {
    const {csrfToken, ...props} = await fetchData('/api/session')
    window._csrfToken = csrfToken;
    return props;
}

export async function postSendLoginCode(params) {
    return fetchData('/auth/send-code', {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(params),
    })
}

export async function postLoginAuthCode(params) {
    return fetchData('/auth/verify-code', {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(params),
    })
}

export async function verifySignup(params) {
    return fetchData('/auth/signup/verify', {
        method: 'POST',
        body: JSON.stringify(params),
    })
}

export async function signup(params) {
    return fetchData('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(params),
    })
}

export async function login(params) {
    return fetchData('/auth/login', {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(params),
    })
}

export async function getUserProfile() {
    return fetchData('/api/user/profile')
}

export async function getOidcProviders() {
    return fetchData('/api/oidc-providers')
}

export async function updateUserProfile(params) {
    return fetchData('/api/user/profile', {
        method: 'POST',
        body: JSON.stringify(params),
    })
}

export async function updateUserLocale(params) {
    return fetchData('/api/user/locale', {
        method: 'POST',
        body: JSON.stringify(params),
    })
}

export async function verifyUserEmail(params) {
    return fetchData('/api/user/email/verification', {
        method: 'POST',
        body: JSON.stringify(params),
    })
}

export async function updateUserEmail(params) {
    return fetchData('/api/user/email', {
        method: 'POST',
        body: JSON.stringify(params),
    })
}

export async function verifyUserPhone(params) {
    return fetchData('/api/user/phone/verification', {
        method: 'POST',
        body: JSON.stringify(params),
    })
}

export async function updateUserPhone(params) {
    return fetchData('/api/user/phone', {
        method: 'POST',
        body: JSON.stringify(params),
    })
}

export async function updateUserPassword(params) {
    return fetchData('/api/user/password', {
        method: 'POST',
        body: JSON.stringify(params),
    })
}

export async function presignUpload() {
    return fetchData(`/api/presign-upload`, {
        method: 'POST',
    });
}

export async function updateUserAvatar(file) {
    const {url, key, cdnUrl} = await presignUpload();
    const uploadResp = await fetch(url, {
        method: "PUT",
        headers: {"Content-Type":  file.type},
        body: file,
    });

    if (!uploadResp.ok) {
        const message = await uploadResp.text();
        throw new Error(`Fail to upload! ${message}`);
    }


    await updateUserProfile({avatar: key});
    return {cdnUrl};
}