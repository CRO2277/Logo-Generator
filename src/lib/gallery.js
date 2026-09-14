// Saved-logo gallery, persisted in localStorage.

const KEY = 'logoforge:gallery';

export function listSaved() {
  try {
    const items = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export function saveToGallery(cfg) {
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    cfg,
    createdAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(KEY, JSON.stringify([entry, ...listSaved()]));
  } catch {
    /* storage full/unavailable — keep in-memory only */
  }
  return entry;
}

export function removeFromGallery(id) {
  const items = listSaved().filter((i) => i.id !== id);
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
  return items;
}
