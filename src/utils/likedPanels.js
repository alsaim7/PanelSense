export const LIKED_PANELS_KEY = 'panelcraft_liked_panels';

export function getLikedPanels() {
  try {
    const stored = JSON.parse(localStorage.getItem(LIKED_PANELS_KEY) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

export function isPanelLiked(panelId) {
  if (!panelId) return false;
  return getLikedPanels().some((panel) => String(panel.id) === String(panelId));
}

export function toggleLikedPanel(panel) {
  if (!panel?.id) return { liked: false, panels: getLikedPanels() };

  const current = getLikedPanels();
  const exists = current.some((item) => String(item.id) === String(panel.id));
  const panels = exists
    ? current.filter((item) => String(item.id) !== String(panel.id))
    : [
        {
          id: panel.id,
          name: panel.name,
          image_url: panel.image_url,
          category: panel.category,
          color: panel.color,
          style: panel.style,
          description: panel.description,
          tags: panel.tags,
          likedAt: new Date().toISOString(),
        },
        ...current,
      ];

  localStorage.setItem(LIKED_PANELS_KEY, JSON.stringify(panels));
  window.dispatchEvent(new CustomEvent('panelcraft:liked-panels-updated'));
  return { liked: !exists, panels };
}
