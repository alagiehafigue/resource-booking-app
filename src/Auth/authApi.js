import { API_BASE } from "../config/api";
import { clearSession } from "./session";

const AUTH_ERROR_STATUSES = new Set([401, 403]);

async function readResponse(res) {
  const isJson = res.headers.get("content-type")?.includes("application/json");
  if (isJson) {
    return res.json().catch(() => null);
  }

  return res.text().catch(() => null);
}

function buildError(res, data) {
  const message =
    (data && typeof data === "object" && (data.message || data.error)) ||
    (typeof data === "string" && data) ||
    `Request failed (${res.status})`;
  const error = new Error(message);
  error.status = res.status;
  error.data = data;
  return error;
}

function redirectToLogin() {
  if (typeof window === "undefined") return;

  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
}

export async function refreshSession() {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    clearSession();
    return false;
  }

  return true;
}

export async function logoutSession({ redirect = true } = {}) {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // Ignore logout transport errors and clear local session anyway.
  } finally {
    clearSession();
    if (redirect) {
      redirectToLogin();
    }
  }
}

export async function deleteAccountSession() {
  try {
    await apiRequest("/auth/delete-account", { method: "DELETE" }, true);
  } finally {
    clearSession();
    redirectToLogin();
  }
}

export async function apiRequest(path, options = {}, retrying = false) {
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const data = await readResponse(res);

  if (res.ok) {
    return data;
  }

  if (!retrying && AUTH_ERROR_STATUSES.has(res.status)) {
    const refreshed = await refreshSession();
    if (refreshed) {
      return apiRequest(path, options, true);
    }

    redirectToLogin();
  }

  throw buildError(res, data);
}
