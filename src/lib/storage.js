const isBrowser = typeof window !== "undefined";

export function readJSON(key, fallback) {
  try {
    if (!isBrowser) return fallback;
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  if (!isBrowser) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function remove(key) {
  if (!isBrowser) return;
  localStorage.removeItem(key);
}
