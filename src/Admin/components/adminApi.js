import { API_BASE } from "../../config/api.js";

// function getAuthToken() {
//   return (
//     localStorage.getItem("token") ||
//     localStorage.getItem("access_token") ||
//     localStorage.getItem("accessToken") ||
//     ""
//   );
// }

export async function apiFetch(path, options = {}) {
  // const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  // if (token && !headers.has("Authorization")) {
  //   headers.set("Authorization", `Bearer ${token}`);
  // }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers, credentials: "include" });
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && (data.message || data.error)) ||
      (typeof data === "string" && data) ||
      `Request failed (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

