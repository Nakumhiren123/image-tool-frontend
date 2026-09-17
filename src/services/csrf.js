const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? 'http://localhost:5000/api' : '');

let csrfToken = null;

export async function getCsrfToken() {
    if (csrfToken) {
        return csrfToken;
    }

    const response = await fetch(`${API_BASE_URL}/auth/csrf`, {
        method: 'GET',
        credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok || !data.success || !data.csrfToken) {
        throw new Error(
            data.error || 'Unable to initialize security token.'
        );
    }

    csrfToken = data.csrfToken;

    return csrfToken;
}

export async function csrfFetch(url, options = {}) {
    const token = await getCsrfToken();

    const headers = new Headers(options.headers || {});

    headers.set('X-CSRF-Token', token);

    /*
     * Only set Content-Type automatically when a body is
     * actually being sent and the caller hasn't supplied it.
     */
    if (
        options.body &&
        !headers.has('Content-Type') &&
        !(options.body instanceof FormData)
    ) {
        headers.set('Content-Type', 'application/json');
    }

    return fetch(url, {
        ...options,
        credentials: 'include',
        headers,
    });
}

/*
 * Useful after logout/account deletion or if the server
 * rejects the token and the client needs a fresh one.
 */
export function clearCsrfToken() {
    csrfToken = null;
}