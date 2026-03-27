const storage = window.sessionStorage;

const STORAGE_KEYS = {
  name: "user_name",
  role: "user_role",
  id: "user_id",
};

export function getStoredSession() {
  return {
    isAuthenticated: Boolean(storage.getItem(STORAGE_KEYS.role)),
    role: storage.getItem(STORAGE_KEYS.role) || "",
    name: storage.getItem(STORAGE_KEYS.name) || "",
    userId: storage.getItem(STORAGE_KEYS.id) || "",
  };
}

export function storeSession(user) {
  if (!user) return;
  if (user.user_id) storage.setItem(STORAGE_KEYS.id, String(user.user_id));
  if (user.name) storage.setItem(STORAGE_KEYS.name, user.name);
  if (user.role) storage.setItem(STORAGE_KEYS.role, user.role);
}

export function clearSession() {
  Object.values(STORAGE_KEYS).forEach((key) => storage.removeItem(key));
}

export function isAllowedRole(role, allowedRoles = []) {
  return !allowedRoles.length || allowedRoles.includes(role);
}
