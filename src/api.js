// src/lib/api.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

export function clearToken() {
  localStorage.removeItem("token");
}

// aliasuri pentru cod mai vechi
export const getAuthToken = getToken;
export const setAuthToken = setToken;
export function clearAuthToken() {
  clearToken();
}

export async function apiFetch(path, options = {}) {
  const headers = options.headers ? { ...options.headers } : {};
  const token = getToken();

  if (!headers["Content-Type"] && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  } else {
    data = null;
  }

  if (!res.ok) {
    const msg =
      data && data.error ? data.error : res.statusText || "Request failed";
    throw new Error(msg);
  }

  return data;
}

// opțional: un obiect api pentru alte părți ale app-ului
export const api = {
  login(email, password) {
    return apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  login2FA(code) {
    return apiFetch("/auth/login/2fa", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  },
  register({ username, email, password }) {
    return apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });
  },
  verifyEmail(token) {
    return apiFetch(`/auth/verify-email?token=${encodeURIComponent(token)}`);
  },
  me() {
    return apiFetch("/auth/me");
  },
  setup2FA() {
    return apiFetch("/auth/2fa/setup");
  },
  confirm2FA(code) {
    return apiFetch("/auth/2fa/confirm", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  },
};
