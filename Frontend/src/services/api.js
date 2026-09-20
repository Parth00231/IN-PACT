// Central API client. Every call to the backend should go through `apiFetch`
// so auth headers, error handling, and the base URL live in exactly one place.

// Auto-normalize base URL to guarantee /api suffix regardless of trailing slashes or user env input
function getNormalizedBaseUrl() {
  let url = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").trim().replace(/\/+$/, "");
  if (!url.endsWith("/api")) {
    url += "/api";
  }
  return url;
}

const BASE_URL = getNormalizedBaseUrl();

const TOKEN_KEY = "inpact_token";

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

/**
 * Wraps fetch() with the backend's base URL, JSON handling, auth header,
 * and a consistent error shape so callers don't each re-implement this.
 *
 * @param {string} path - e.g. "/auth/login" (leading slash, no /api prefix)
 * @param {object} options - standard fetch options; body may be a plain object
 *                            (will be JSON.stringify'd automatically)
 */
export async function apiFetch(path, options = {}) {
    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const body =
        options.body && typeof options.body !== "string"
            ? JSON.stringify(options.body)
            : options.body;

    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers, body });

    let data;
    try {
        data = await res.json();
    } catch {
        // Non-JSON response (e.g. the server crashed and returned an HTML error page)
        throw new Error(`Server returned an unexpected response (status ${res.status})`);
    }

    if (!res.ok || data.success === false) {
        throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return data;
}